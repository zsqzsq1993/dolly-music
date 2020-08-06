export function shuffle(list: Array<any>) {
  const _list = list.slice()
  for (let i = 0; i < _list.length; i++) {
    const t = randomBetween(0, i)
    const tempt = _list[t]
    _list[t] = _list[i]
    _list[i] = tempt
  }
  return _list
}

function randomBetween(min: number, max: number): number {
  return (min + (max - min + 1) * Math.random()) | 0
}
