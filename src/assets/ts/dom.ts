export function hasClass(element: HTMLElement, className: string): boolean {
  return element.className.indexOf(className) !== -1
}

export function addClass(element: HTMLElement, className: string): void {
  if (!hasClass(element, className)) {
    const originClassName = element.className.trim()
    element.className = originClassName + ' ' + className.trim()
  }
}

export function getData(el: HTMLElement, name: string, val?: any): any {
  const prefix = 'data-'
  name = prefix + name
  return typeof val !== 'undefined'
    ? el.setAttribute(name, val)
    : el.getAttribute(name)
}

export const prefixStyle = (() => {
  const div: HTMLDivElement = document.createElement('div')

  let prefix: string | boolean = false

  const map: any = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  if (!prefix) {
    prefix = (() => {
      for (const key in map) {
        if ((div.style as any)[map[key]] !== undefined) {
          return key
        }
      }
      return false
    })()
  }

  return (style: string) => {
    if (prefix) {
      if (prefix === 'standard') {
        prefix = ''
      }
      return prefix + style.charAt(0).toUpperCase() + style.slice(1)
    } else {
      console.warn(`style property ${style} does not exist`)
      return false
    }
  }
})()
