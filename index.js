import http from "http";
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Route } from './services/Route.js'
import { log, end } from './services/Log.js'



import {User, Book, Reservation, sequelize_content} from './database.js'
/*
The user represent the User
The book represent the Book
Reservation Represents the reservations of a book by an user 
*/

import { composeJSON } from './services/ComposeJSON.js'
// function responsible for make a conversion to the datagram received at front-end to JSON format 

import {search_book_user, choose_book} from './controllers/UserController.js'
//Controllers 


/* Global variables */

const port = 3000;
const host = "localhost";
// ambient configuration


const pages_names = ["index.html", "dashboard.html","login.html"]
const styles_names = ["dashboard.css","main.css","login.css"]
const scripts_names = ["main.js","dashboard.js"]
// páginas disponíveis para serem acessadas, devem ser configuradas na parte de routing também


const __dirname = dirname(fileURLToPath(import.meta.url));

const pages = new Object()
const styles = new Object()
const scripts = new Object()
pages_names.forEach(e => {
  const pages_directory = join(__dirname,"src","pages",);
  pages[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

styles_names.forEach(e => {
  const pages_directory = join(__dirname,"src","styles",);
  styles[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

scripts_names.forEach(e => {
  const pages_directory = join(__dirname,"src","scripts",);
  scripts[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

// as variáveis 'pages','styles,'scripts' são objetos contento as páginas, estilos, e scripts respectivamente
/* Definição das rotas */

// rota das páginas
const route = new Route()
route.insert('/', (request,response) => {
    response.writeHead(200)
    response.end("Entrando na rota principal")
    return 0;
})
// para a rota '/' será executado o comando passado no segundo parâmetro do método 'insert' do objeto route


route.insert('/index',function(request,response) {
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    response.end(pages.index);
})
route.insert('/dashboard',function(request,response) {
    
    response.setHeader("Content-type", "text/html");
    response.writeHead(200);
    
    response.end(pages.dashboard);
})
route.insert('/registration',function(request,response) {
    response.setHeader("Content-type", "text/html");
    response.writeHead(200);
    response.end(pages.registration);
})

route.insert("/login", function(request, response) {
  response.setHeader("Content-type","text/html")
  response.writeHead(200)
  response.end(pages.login)
})

// rota dos css's


route.insert('/styles/main.css',function(request,response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.main);
})
route.insert('/styles/dashboard.css',function(request,response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.dashboard);
})
route.insert('/styles/registration.css',function(request,response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.registration);
})
route.insert('/styles/login.css',function(request,response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.login);
})

// rotas da api

route.insert('/api/make_login',function(request, response) {
  composeJSON(request)
    .then(json_result => {
      response.setHeader("Content-type", "text/plain");
      response.writeHead(200);
      response.end("O conteúdo enviado é: " + body);
    })
    .catch(error => {
      response.setHeader("Content-type", "text/plain");
      response.writeHead(500)
    })
})

const Op = sequelize_content.Op
route.insert('/api/books',function(request, response) {
  response.setHeader("Content-type", "application/json");
  response.writeHead(200);
  const json_stringified = JSON.stringify({
    result: "ok",
  });

  Reservation.findAll({ where : {userId : {[Op.not] : NaN }}}).then(e => {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      console.log(e.toJSON())
  })

  Book.findAll({ where: {} }).then((e) => {



    response.end(JSON.stringify(e));
  });
})


route.insert('/api/request_books',function(request, response) {
  composeJSON(request)
    .then(result => {
        return Number(result.userId)
    })
    .then(userId => {
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);
      return search_book_user(userId)
    })
    .then(book_found => {
      response.end(JSON.stringify(book_found));
      
    })
})


route.insert('/api/choose_book',function(request, response) {
  composeJSON(request)
    .then(result => {
      return choose_book(result)
    })
    .then(book_choice => {
      return JSON.stringify(book_choice)
    })
    .then(book_choice => {
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);
      response.end(book_choice);         
    })
    .catch(error => {
      response.write(500)
      response.end({ error })
    })
})


route.insert('/api/add_title', function (request, response) {
  response.setHeader("Content-type", "application/json");

  composeJSON(request, format = "query")
    .then(({title, description, userId}) => {
      return Book.create({title, description, userId})
    })
    .then(book_created => {
      response.writeHead(200)
      response.end(JSON.stringify(book_created.toJSON()))
    })
    .catch(error => {
      response.writeHead(500)
      response.end({error})
    })
})

// rota dos scripts 
route.insert('/scripts/main.js',function(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.main);
  
  
})

route.insert('/scripts/dashboard.js', function (request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.dashboard);
   

})
route.default(function (request, response) {
  response.writeHead(404);
  response.end(
    "Algo de errado não está certo, a página não foi encontrada",
    "utf-8"
  ); 
});


/* Server configuration and routing */

// sleep(1000)

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  end()
  log("server","Recebendo requisição do servidor")
  log("server","método: " + request.method)
  log("server","rota: " + request.url)
  
  var function_response_from_routing = route.routers.get(request.url)
  if (typeof(function_response_from_routing) == 'function') {
    function_response_from_routing(request,response)
  } else {
    response.writeHead(500)
    response.end("Something goes wrong, the requested url isn't recognized")
  }
});

server.listen(port,host)
