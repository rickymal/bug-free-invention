import http from "http";
import fs from "fs";
const port = 3000;
const host = "localhost";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pkg from "sequelize";
const { Sequelize, Model, DataTypes } = pkg;


import {User, Book, Reservation} from './database'
/*
The user represent the User '-'
The book represent the Book
Reservation Represents the reservations of a book by an user 
*/



/* Global variables */
const __dirname = dirname(fileURLToPath(import.meta.url));

const pages_directory = join(__dirname, "pages");

const pages = {
  index: fs.readFileSync(join(pages_directory, "index.html"), {
    encoding: "utf-8",
  }),
  dashboard: fs.readFileSync(join(pages_directory, "dashboard.html"), {
    encoding: "utf-8",
  }),
  registration: fs.readFileSync(join(pages_directory, "registration.html"), {
    encoding: "utf-8",
  }),
};


const styles = {
  dashboard : fs.readFileSync(join(pages_directory, "dashboard.css"), {
    encoding: "utf-8" 
  }),
  main : fs.readFileSync(join(pages_directory, "main.css"), { encoding: "utf-8" }),
  registration : fs.readFileSync(join(pages_directory, "registration.css"), {
    encoding: "utf-8",
  }),
}

const scripts = {
  main: fs.readFileSync(join(pages_directory, "main.js"), {
    encoding: "utf-8",
  }),
  dashboard: fs.readFileSync(join(pages_directory, "dashboard.js"), {
    encoding: "utf-8",
  }),
};

class Route {
  constructor() {
    this.routers = Map()
  }

  insert(path,definition) {
    this.routers.set(path,definition)
  }


  getRequest(request,response) {

  }
}


const route = new Route()

route.insert('/', (request,response) => {
    response.writeHead(200)
    response.end("Entrando na rota principal")

})
/* Server configuration and routing */
const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");

  route.getRequest(request,response)

  

  switch (request.url) {
    case "/":
      response.writeHead(200);
      response.end("Entrando na rota principal");
      break;

    case "/index":
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(pages.index);
      break;
    case "/dashboard":
      response.setHeader("Content-type", "text/html");
      response.writeHead(200);
      response.end(pages.dashboard);
      break;
    case "/registration":
      response.setHeader("Content-type", "text/html");
      response.writeHead(200);
      response.end(pages.registration);
      break;

    case "/main.css":
      response.setHeader("Content-Type", "text/css");

      response.writeHead(200);
      response.end(styles.main);

      break;
    case "/dashboard.css":
      response.setHeader("Content-Type", "text/css");
      response.writeHead(200);
      response.end(styles.dashboard);

      break;
    case "/registration.css":
      response.setHeader("Content-Type", "text/css");
      response.writeHead(200);
      response.end(styles.registration);
      break;

    case "/api/make_login":
      
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
      break;

    case "/scripts/main.js":
      response.setHeader("Content-type", "text/javascript");
      response.writeHead(200);
      response.end(scripts.main);
      break;

    case "/api/books":
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);
      const json_stringified = JSON.stringify({
        result: "ok",
      });

      Book.findAll({ where: {} }).then((e) => {
        response.end(JSON.stringify(e));
      });

      break;

    case "/api/choose_book":

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


      break;

    case "/api/request_books":
      
      
      composeJSON(request)
        .then(result => {
           return Number(result.userId)
        })
        .then(userId => {
          response.setHeader("Content-type", "application/json");
          response.writeHead(200);
          response.end(JSON.stringify(await search_book_user(userId)));
        })

      break;

    case "/api/add_title":
      
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


      // request.on("data", (chunk) => {
      //   body_as_string += chunk;
      // });

      // request.on("end", async () => {
      //   // converter o conteúdo para um formato de json

      //   var object_received = {};
      //   body_as_string.split("&").forEach((content) => {
      //     var v = content.split("=");
      //     object_received[v[0]] = v[1];
      //   });

      //   try {
      //     const new_book = await Book.create({
      //       title: object_received.title,
      //       description: object_received.description,
      //       userId: object_received.userId,
      //     });

      //     var content = JSON.stringify(new_book.toJSON());

      //     response.writeHead(200);
      //     response.end(content);
      //   } catch (error) {
      //     response.writeHead(500);
      //     response.end(JSON.stringify({ error }));
      //   }
      // });

      // request.on("error", (error) => {
      //   response.setHeader;
      //   response.writeHead(500);
      //   response.end("Algo de errado não está certo");
      // });

      break;

    case "/scripts/dashboard.js":
      response.setHeader("Content-type", "text/javascript");
      response.writeHead(200);
      var content = scripts.dashboard;
      response.end(content);
      break;
    default:
      response.writeHead(404);
      response.end(
        "Algo de errado não está certo, a página não foi encontrada",
        "utf-8"
      );
      break;
  }
});

// server.listen(port, host, () => {});

async function search_book_user(userId) {
  var response = await Book.findAll({ where: { userId } });
  var data_parsed = JSON.parse(JSON.stringify(response));

  return {
    ...data_parsed,
    withUser: userId,
  };
}


// o usuário de id 'userId' seleciona o livro de id 'bookId'
async function choose_book({ userId, bookId }) {
  var c = await Reservation.findAll({ where: { userId } });
  var hasReservation = c.length > 0;

  if (!hasReservation) {
  } else {
    // checar como eu deveria retornar o status code nesse caso !!
    return {
      userId,
      bookId,
      status: "The user only can choose one book per time",
    };
  }
  const reservation = new Reservation({
    userId,
    bookId,
  });
  reservation.save();

  return {
    userId,
    bookId,
    status: "Added successful",
  };
}

const compile = (param) => JSON.stringify(content(JSON.parse(param)));



function composeJSON(request, format = "json") {
  return new Promise(function(resolve,reject){
    var body_parsed = ""
    request.on('data',chunk => {
        body_parsed += chunk
    })

    request.on('end',() => {
        if(format == 'json') {
          resolve(JSON.parse(body_parsed))
        } else if(format == 'query') {
          transpiled_object = {}
          body_parsed.split("&").forEach((content) => {
            var key_value_pair = content.split("=");
            transpiled_object[key_value_pair[0]] = key_value_pair[1];
          });

          resolve(transpiled_object)
        } else {
          reject(new Error("Format parameter don't recognized"))
        }
    })

    request.on('error',error => {
        reject(error)
    })
  })
}