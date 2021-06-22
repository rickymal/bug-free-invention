export class Route {
    constructor() {
      this.routers = new Map()
    }
  
    insert(path,definition) {
      this.routers.set(path,definition)
    }
  
  }
  
  
  