export function hasClass(element: HTMLElement, className: string): boolean {
  return element.className.indexOf(className) !== -1
}

export function addClass(element: HTMLElement, className: string): void {
  if (!hasClass(element, className)) {
    const originClassName = element.className.trim()
    element.className = originClassName + ' ' + className.trim()
  }
}
