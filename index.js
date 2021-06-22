import http from "http";
import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Route } from './services/Route'
import pkg from "sequelize";
const { Sequelize, Model, DataTypes } = pkg;

import {User, Book, Reservation} from './database'
/*
The user represent the User
The book represent the Book
Reservation Represents the reservations of a book by an user 
*/

import { composeJSON } from './services/composeJSON'
// function responsible for make a conversion to the datagram received at front-end to JSON format 


import {search_book_user, choose_book} from './controllers/UserController'
//Controllers 




/* Global variables */

const port = 3000;
const host = "localhost";
// ambient configuration


pages_names = ["index.html", "dashboard.html","registration.html"]
styles_names = ["dashboard.css","main.css","registration.css"]
scripts_names = ["main.js","dashboard.js"]


const __dirname = dirname(fileURLToPath(import.meta.url));
const pages_directory = join(__dirname, "pages");

const pages = new Object()
const styles = new Object()
const scripts = new Object()

pages_name.forEach(e => {
  pages[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

styles_names.forEach(e => {
  styles[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

scripts_names.forEach(e => {
  pages[e.split('.')[0]] = fs.readFileSync(join(pages_directory, e), {encoding : 'utf-8'})  
})

// const pages = {
//   index: fs.readFileSync(join(pages_directory, "index.html"), {
//     encoding: "utf-8",
//   }),
//   dashboard: fs.readFileSync(join(pages_directory, "dashboard.html"), {
//     encoding: "utf-8",
//   }),
//   registration: fs.readFileSync(join(pages_directory, "registration.html"), {
//     encoding: "utf-8",
//   }),
// };


// const styles = {
//   dashboard : fs.readFileSync(join(pages_directory, "dashboard.css"), {
//     encoding: "utf-8" 
//   }),
//   main : fs.readFileSync(join(pages_directory, "main.css"), { encoding: "utf-8" }),
//   registration : fs.readFileSync(join(pages_directory, "registration.css"), {
//     encoding: "utf-8",
//   }),
// }

// const scripts = {
//   main: fs.readFileSync(join(pages_directory, "main.js"), {
//     encoding: "utf-8",
//   }),
//   dashboard: fs.readFileSync(join(pages_directory, "dashboard.js"), {
//     encoding: "utf-8",
//   }),
// };




/* Definição das rotas */

// rota das páginas
const route = new Route()
route.insert('/', (request,response) => {
    response.writeHead(200)
    response.end("Entrando na rota principal")
})

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


route.insert('/api/books',function(request, response) {
  response.setHeader("Content-type", "application/json");
  response.writeHead(200);
  const json_stringified = JSON.stringify({
    result: "ok",
  });

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
      response.end(JSON.stringify(await search_book_user(userId)));
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
route.insert('/script/main.js',function(request, response) {
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

const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");

  
  route.routers.get(request.url)(request, response)
  

  

    
  
});




