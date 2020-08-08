// const timeExp = /^\[(\d{2}):(\d{2})\.(\d{2})](.*)$/
//
// const requestAnimationFrame: any = (() => {
//   return window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     function (callback) {
//       setTimeout(callback, 1000/60)
//     }
// })()
//
// interface Line {
//   time: number;
//   text: string;
// }
//
// interface Tags {
//   album?: string;
//   title?: string;
//   artist?: string;
//   by?: string;
//   offset?: number;
// }
//
// class LyricParserClass {
//   lrc: string
//   lines: Array<Line>
//   linesCopy: Array<Line>
//   tags: Tags
//
//   private strategies = {
//     al(me: LyricParserClass, val: string) {
//       me.tags.album = val
//     },
//     ti(me: LyricParserClass, val: string) {
//       me.tags.title = val
//     },
//     ar(me: LyricParserClass, val: string) {
//       me.tags.artist = val
//     },
//     by(me: LyricParserClass, val: string) {
//       me.tags.by = val
//     },
//     offset(me: LyricParserClass, val: string) {
//       me.tags.offset = parseInt(val)
//     }
//   }
//   private startTime = 0
//
//   constructor(lyric: string) {
//     this.lrc = lyric
//     this.lines = []
//     this.linesCopy = []
//     this.tags = {}
//     this.parse()
//   }
//
//   parse(): void {
//     const allLines = this.lrc.split('\n')
//     for (const line of allLines) {
//       if (timeExp.test(line)) {
//         this.parseTime(line)
//       } else {
//         this.parseTags(line)
//       }
//     }
//   }
//
//   parseTags(line: string): void {
//     if (!line) {
//       return
//     }
//     const keyVal = line.split(':')
//     const key = keyVal[0].slice(1).toLowerCase().trim()
//     const val = keyVal[1].slice(0, -1).trim();
//     (this.strategies as any)[key](this, val)
//   }
//
//   parseTime(line: string): void {
//     const matches = timeExp.exec(line)
//     const minitue = matches![1]
//     const second = matches![2]
//     const decimals = matches![3]
//     const lyric = matches![4]
//
//     const minTimeStamp = parseInt(minitue) * 60
//     const secTimeStamp = parseInt(second)
//     const decList = decimals.split('')
//     const decTimeStamp = parseInt(decList[0]) * 0.1 + parseInt(decList[1]) * 0.01
//
//     this.lines.push({
//       time: minTimeStamp + secTimeStamp + decTimeStamp,
//       text: lyric
//     })
//     this.linesCopy = this.lines.slice()
//   }
// }
//
// export default LyricParserClass
