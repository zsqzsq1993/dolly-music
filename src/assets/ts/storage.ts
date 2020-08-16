const serverMode = typeof window === 'undefined'

interface StorageApi {
  serialize: (val: any) => string;

  deserialize: (val: string) => any;

  get: (key: string, def?: any) => any;

  set: (key: string, val: any) => void;

  remove: (key: string) => void;

  clear: () => void;

  disable: boolean;
}

interface Storage extends StorageApi{
  storage: any;
}

const $storage = {
  storage: !serverMode
    ? window.localStorage
    : null,

  session: {
    storage: !serverMode
      ? window.sessionStorage
      : null
  }
}

const api: StorageApi = {
  get(this: Storage, key: string, def?: any) {
    def = def || null
    if (this.disable) {
      return def
    }
    const val = this.storage!.getItem(key)
    return this.deserialize(val) || def
  },

  set(this: Storage, key: string, val: any) {
    if (this.disable) {
      return
    }
    this.storage.setItem(key, this.serialize(val))
  },

  serialize(val: any): string {
    if (typeof val === 'string') {
      return val
    } else {
      return JSON.stringify(val)
    }
  },

  deserialize(val: string): any {
    return JSON.parse(val) || undefined
  },

  remove(this: Storage, key: string) {
    if (this.disable) {
      return
    }
    this.storage.remove(key)
  },

  clear(this: Storage) {
    if (this.disable) {
      return
    }
    this.storage.clear()
  },

  disable: false,
}

const storage = Object.assign({} as Storage, $storage, api)
Object.assign(storage.session, api)

storage.disable = (function () {
  try {
    const key = '__test__'
    storage.set(key, key)
    if (storage.get(key, '') !== key) {
      return true
    } else {
      storage.remove(key)
      return false
    }
  } catch (e) {
    return true
  }
})()

export default storage




