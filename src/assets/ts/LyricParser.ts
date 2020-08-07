const timeExp = /^\[(\d{2}):(\d{2})\.(\d{2})](.*)$/

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

export default class LyricParser {
  lrc: string
  lines: Array<Line>
  tags: Tags

  private strategies = {
    al(me: LyricParser, val: string) {
      me.tags.album = val
    },
    ti(me: LyricParser, val: string) {
      me.tags.title = val
    },
    ar(me: LyricParser, val: string) {
      me.tags.artist = val
    },
    by(me: LyricParser, val: string) {
      me.tags.by = val
    },
    offset(me: LyricParser, val: string) {
      me.tags.offset = parseInt(val)
    }
  }

  constructor(lyric: string) {
    this.lrc = lyric
    this.lines = []
    this.tags = {}
    this.parse()
  }

  parse(): void {
    const allLines = this.lrc.split('\n')
    for (const line of allLines) {
      if (timeExp.test(line)) {
        this.parseTime(line)
      } else {
        this.parseTags(line)
      }
    }
  }

  parseTags(line: string): void {
    if (!line) {
      return
    }
    const keyVal = line.split(':')
    const key = keyVal[0].slice(1).toLowerCase().trim()
    const val = keyVal[1].slice(0, -1).trim();
    (this.strategies as any)[key](this, val)
  }

  parseTime(line: string): void {
    const matches = timeExp.exec(line)
    const minitue = matches![1]
    const second = matches![2]
    const decimals = matches![3]
    const lyric = matches![4]

    const minTimeStamp = parseInt(minitue) * 60
    const secTimeStamp = parseInt(second)
    const decList = decimals.split('')
    const decTimeStamp = parseInt(decList[0]) * 0.1 + parseInt(decList[1]) * 0.01

    this.lines.push({
      time: minTimeStamp + secTimeStamp + decTimeStamp,
      text: lyric
    })
  }
}
