interface Line {
  time: number;
  text: string;
}

interface Tags {
  album?: string;
  title?: string;
  artist?: string;
  by?: string;
  offset?: number;
}

export interface LyricParser {
  lrc: string;
  lines: Array<Line>;
  tags: Tags;
  play: (callback: any) => void;
  restart: any;
  pause: any;
  seek: any;
  repeat: any;
}

const lyricParser: any = function () {
  let lrc: string
  let startTime: number
  let callback: any
  let lines: Array<Line>
  let tags: Tags
  let id: number
  let pausedTime: number
  let currentIndex: number
  let requiredTime: number
  let skipTime: boolean
  let duration: number

  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2})](.*)/

  const requestAnimationFrame: any = (() => {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  })()

  const cancelAnimationFrame: any = (() => {
    return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      function (id: number) {
        window.clearTimeout(id)
      }
  })()

  const strategies = {
    al(val: string) {
      tags.album = val
    },
    ti(val: string) {
      tags.title = val
    },
    ar(val: string) {
      tags.artist = val
    },
    by(val: string) {
      tags.by = val
    },
    offset(val: string) {
      tags.offset = parseInt(val)
    }
  }

  function play(_callback: any) {
    if (!lines.length) {
      const message = 'Lyrics Array is Empty.'
      console.warn(message)
      throw new Error(message)
    }

    callback = _callback

    cancelAnimationFrame(id)
    id = requestAnimationFrame(step)
  }

  function step(timestamp: number) {
    if (!startTime) {
      startTime = timestamp
    }

    if (timestamp > duration) {
      return
    }

    let currentTime = timestamp - startTime

    if (skipTime) {
      currentTime = hanleSkipTime(currentTime)
    }

    const index = calCurrentIndex(currentTime)

    if (index !== currentIndex) {
      currentIndex = index
      callback(currentIndex)
    }

    goLoop()
  }

  function goLoop() {
    cancelAnimationFrame(id)
    id = requestAnimationFrame(step)
  }

  function hanleSkipTime(currentTime: number) {
    const deltaTime = requiredTime - currentTime
    startTime -= deltaTime
    skipTime = false
    return requiredTime
  }

  function calCurrentIndex(currentTime: number) {
    for (let i = 0; i < lines.length; i++) {
      if (currentTime <= lines[i].time * 1000) {
        return i - 1 < 0 ? 0 : (i - 1)
      }
    }
    return lines.length - 1
  }

  function pause() {
    cancelAnimationFrame(id)
    pausedTime = +new Date()
  }

  function restart() {
    if (pausedTime) {
      const duration = +new Date() - pausedTime
      startTime += duration
      pausedTime = 0
      goLoop()
    }
  }

  function init() {
    lrc = ''
    lines = []
    tags = {}
    startTime = 0
    currentIndex = 0
    requiredTime = 0
    skipTime = false
    id = 0
    pausedTime = 0
    duration = 0
  }

  function parse() {
    const allLines = lrc.split('\n')
    for (const line of allLines) {
      if (timeExp.test(line)) {
        parseTime(line)
      } else {
        parseTags(line)
      }
    }
  }

  function parseTags(line: string): void {
    if (!line) {
      return
    }
    const keyVal = line.split(':')
    const key = keyVal[0].slice(1).toLowerCase().trim()
    const val = keyVal[1].slice(0, -1).trim()
    if ((strategies as any)[key]) {
      (strategies as any)[key](val)
    }
  }

  function parseTime(line: string): void {
    const matches = timeExp.exec(line)
    const minitue = matches![1]
    const second = matches![2]
    const decimals = matches![3]
    const lyric = matches![4]
    if (!lyric) {
      return
    }

    const minTimeStamp = parseInt(minitue) * 60
    const secTimeStamp = parseInt(second)
    const decList = decimals.split('')
    const decTimeStamp = parseInt(decList[0]) * 0.1 + parseInt(decList[1]) * 0.01

    lines.push({
      time: minTimeStamp + secTimeStamp + decTimeStamp + (tags.offset || 0),
      text: lyric
    })
  }

  function repeat() {
    currentIndex = 0
    startTime = 0
    requiredTime = 0
    skipTime = false
    goLoop()
  }

  function seek(currentTime: number) {
    skipTime = true
    requiredTime = currentTime * 1000
  }

  return function (lyric: string, interval: number): LyricParser {
    init()

    lrc = lyric
    duration = interval * 1000

    parse()

    return {
      lrc,
      lines,
      tags,
      play,
      restart,
      pause,
      seek,
      repeat
    }
  }
}

export default lyricParser()
