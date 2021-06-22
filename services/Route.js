export class Route {
    constructor() {
      this.routers = new Map()
    }
  
    insert(path,definition) {
      this.routers.set(path,definition)
    }


    default(definition) {
        this.routers.set('/error',definition)
    }
  
  }
  
  
  