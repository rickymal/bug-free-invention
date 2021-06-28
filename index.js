import http from "http";
import { log, end } from "./services/Log.js";
import { route } from "./routes.js";
import crypto from "crypto";
const port = 3000;
const host = "localhost";
// ambient configuration

/* Users authentication controller */

import { AuthService } from './services/AuthService.js'


/* Server configuration and routing */

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  end();
  log("server", "Recebendo requisição do servidor");
  log("server", "método: " + request.method);
  log("server", "rota: " + request.url);
  

  
  
  log("authentication module","the session id at header is: " + response.getHeader('session_id'))
  const isAuthenticated = AuthService.authenticate(request, response);
  log("authentication module","the Authentication header is: " + response.getHeader('Authorization'))
  // acrescenta ao cabeçalho o userId definido no banco de dados associado ao Token
  log('authentication module','status of authentication: ' + isAuthenticated)
  log("authentication module","the userIs founded: " + response.getHeader('userId'))
  
  var function_response_from_routing = route.routers.get(request.url);
  if (typeof function_response_from_routing == "function") {
    function_response_from_routing(request, response);
  } else {
    response.writeHead(500);
    response.end("Something goes wrong, the requested url isn't recognized");
  }
});

server.listen(port, host, null, () => {
  console.log("Server is running")

  
  


});
