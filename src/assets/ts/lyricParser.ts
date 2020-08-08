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

interface LyricParser {
  lrc: string;
  lines: Array<Line>;
  tags: Tags;
  play: (callback: any) => void;
}

const lyricParser: any = (function () {
  let lrc: string
  let startTime: number
  let callback: any
  let exit: any
  let id: number
  let linesCopy: Array<Line>
  const lines: Array<Line> = []
  const tags: Tags = {}

  const timeExp = /^\[(\d{2}):(\d{2})\.(\d{2})](.*)$/

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

  function step(timestamp: number) {
    if (!startTime) {
      startTime = timestamp
    }

    const delta = timestamp - startTime

    if (Math.abs(delta - linesCopy[0].time * 1000) < 200) {
      linesCopy.shift()
      const index = lines.length - linesCopy.length - 1
      callback(index)
    }

    if (!linesCopy.length) {
      exit()
    }

    id = requestAnimationFrame(step)
  }

  function play(_callback: any) {
    if (!lines.length) {
      console.warn('Initializing is not done yet.')
      return
    }

    callback = _callback

    return new Promise(resolve => {
      exit = resolve
      id = requestAnimationFrame(step)
    }).then(() => {
      cancelAnimationFrame(id)
    })
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
    const val = keyVal[1].slice(0, -1).trim();
    (strategies as any)[key](val)
  }

  function parseTime(line: string): void {
    const matches = timeExp.exec(line)
    const minitue = matches![1]
    const second = matches![2]
    const decimals = matches![3]
    const lyric = matches![4]

    const minTimeStamp = parseInt(minitue) * 60
    const secTimeStamp = parseInt(second)
    const decList = decimals.split('')
    const decTimeStamp = parseInt(decList[0]) * 0.1 + parseInt(decList[1]) * 0.01

    lines.push({
      time: minTimeStamp + secTimeStamp + decTimeStamp,
      text: lyric
    })

    linesCopy = lines.slice()
  }

  return function (lyric: string): LyricParser {
    lrc = lyric
    parse()

    return {
      lrc,
      lines,
      tags,
      play
    }
  }
})()

export default lyricParser
