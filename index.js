import http from "http";

import { log, end } from "./services/Log.js";
// library create only for logs and debug purpose

const port = 3000;
const host = "localhost";
// ambient configuration

import { Authentication_service } from './services/Authentication_service.js'
import { route } from "./routes.js";
import { convert_request_headers_to_JSON } from './services/Converter.js'
// Authentication serve and routing. Responsible for the authentication and the endpoint respectively

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  // for CORS
  
  end();
  log("server", "Recebendo requisição do servidor");
  log("server", "método: " + request.method);
  log("server", "rota: " + request.url);
  
  // const headers = {};
  // Object.entries(request.headers).forEach((e) => (headers[e[0]] = e[1]));
  // var authorization_header = headers["authorization"];
  
  
  const headers = convert_request_headers_to_JSON(request)
  // Converting headers to object format (JSON) 
  var authorization_header = headers["authorization"];
  
  
  log("authentication module","the Authentication header is: " + authorization_header)
  const isAuthenticated = Authentication_service.authenticate(request, response);
  // acrescenta ao cabeçalho o userId definido no banco de dados associado ao Token
  
  log("authentication module","the userId founded: " + response.getHeader('userId'))
  
  var function_endpoint_from_routing = route.routers.get(request.url);
  if (typeof function_endpoint_from_routing == "function") {
    function_endpoint_from_routing(request, response);
  } else {
    response.writeHead(500);
    response.end("Something goes wrong");
    return
  }
});

server.listen(port, host, null, () => {
  console.log("Server is running")
});
