export class RouteService {
  constructor() {
    this.routers = new Map();
  }

  insert(path, definition) {
    this.routers.set(path, definition);
  }

  default(definition) {
    this.routers.set(NaN, definition);
  }
}
