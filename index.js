import http from "http";
import { log, end } from "./services/Log.js";
import { route } from "./routes.js";
import crypto from 'crypto'
const port = 3000;
const host = "localhost";
// ambient configuration

/* Users authentication controller */

class AuthService {
  constructor() {
    this.users = new Map();
  }

  static authenticate(request, response) {
    // preciso colocar tanto o userId quanto 
    var [bearer, hash] = request.headers()['Authorization'].split(" ")

    
    if (bearer != "Bearer") {
      throw new Error("The format of token isn't correct")
    }


    var userId = this.users.get(hash)
    
    if (userId != null) {
      response.setHeader("userId",userId)
      return true;
    } else{
      response.setHeader("userId","null")
      return false;
    }
  }

  static login(request, response) {
    try {
      var random_bytes = crypto.randomBytes(10)
      var hash = crypto.createHmac('sha256',random_bytes)
      this.users.set(hash, 1)
      response.setHeader("Authorization","Bearer " + hash)
      return true
    } catch {
      response.setHeader("Authorization","null")
      return false
    }
  }
}

/* Server configuration and routing */

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  end();
  log("server", "Recebendo requisição do servidor");
  log("server", "método: " + request.method);
  log("server", "rota: " + request.url);
  log("auth", "passando pela autenticação");


  const logged = AuthService.login("henriquemauler@gmail.com","123456789")
  log('login status',login)
  const isAuthenticated = AuthService.authenticate(request, response);
  // acrescenta ao cabeçalho o userId definido no banco de dados associado ao Token

  log("auth", "autenticação realizada com sucesso");
  var function_response_from_routing = route.routers.get(request.url);
  if (typeof function_response_from_routing == "function") {
    function_response_from_routing(request, response);
  } else {
    response.writeHead(500);
    response.end("Something goes wrong, the requested url isn't recognized");
  }
});

server.listen(port, host);
