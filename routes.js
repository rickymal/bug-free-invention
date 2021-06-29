import { RouteService } from "./services/RouteService.js";

/* Definição das rotas */

// rota das páginas
export const route = new RouteService();
route.insert("/", (request, response) => {
  response.writeHead(200);
  response.end("Entrando na rota principal");
  return 0;
});

import RouterController from "./controllers/RouterController.js";


route.insert("/index", RouterController.index);
route.insert("/dashboard", RouterController.dashboard);
route.insert("/registration", RouterController.registration);
route.insert("/login", RouterController.login);

// rota dos css's

route.insert("/styles/main.css", RouterController.styles_main);
route.insert("/styles/dashboard.css", RouterController.styles_dashboard);
route.insert("/styles/registration.css", RouterController.styles_registration);
route.insert("/styles/login.css", RouterController.styles_login);
route.insert("/styles/global.css", RouterController.styles_global);

// rotas da api

route.insert("/api/make_login", RouterController.api_make_login);
route.insert("/api/books", RouterController.api_books);
route.insert("/api/delete_owner_book", RouterController.api_delete_owner_book);

// função criada apenas para testes, deve ser apagada posteriormente.
route.insert("/api/test_login", function (request, response) {
  const headers = {}
  Object.entries(request.headers).forEach(e => headers[e[0]] = e[1])

  console.log("[TEST]: o conteúdo do cabeçalho: " + headers.length)
  console.log("[TEST]: o conteúdo do cabeçalho: " + JSON.stringify(headers))
  response.writeHead(200)
  response.end("tudo ok")
})

route.insert(
  "/api/devolve_reserved_book",
  RouterController.api_devolve_reserved_book
);

route.insert(
  "/api/request_owner_books",
  RouterController.api_request_owner_books
);

route.insert(
  "/api/request_reserved_books",
  RouterController.api_request_reserved_books
);

route.insert("/api/choose_book", RouterController.api_choose_book);
route.insert("/api/add_title", RouterController.api_add_title);

// rota dos scripts
route.insert("/scripts/main.js", RouterController.scripts_main);
route.insert("/scripts/dashboard.js", RouterController.scripts_dashboard);
route.insert("/scripts/login.js", RouterController.scripts_login);
route.insert("/scripts/fetcher.js", RouterController.scripts_fetcher);

// outros
route.insert("/favicon.ico", RouterController.favicon);
route.default(RouterController.default_);
