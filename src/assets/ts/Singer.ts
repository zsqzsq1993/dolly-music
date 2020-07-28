export interface SingerInstance {
  id: string;
  name: string;
  avatar: string;
}

export class Singer implements SingerInstance {
  id: string
  name: string
  avatar: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
