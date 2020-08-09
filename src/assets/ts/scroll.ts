import BScroll from '@better-scroll/core'

const MINIPLAYER_HEIGHT = 60

export function refreshScrollWithPlayer(wrapper: HTMLElement, scroll: BScroll): void {
  wrapper.style.bottom = MINIPLAYER_HEIGHT + 'px'
  scroll.refresh()
}

export function refreshScrollWithoutPlayer(wrapper: HTMLElement, scroll: BScroll): void {
  wrapper.style.bottom = '0'
  scroll.refresh()
}
