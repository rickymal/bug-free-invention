import { Book, Reservation } from "../database.js";
import {log, space} from '../services/Log.js'
import sequelize from 'sequelize'
const Op = sequelize.Op

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const pages_names = ["index.html", "dashboard.html", "login.html","registration.html"];
const styles_names = ["dashboard.css", "main.css", "login.css","global.css","registration.css"];
const scripts_names = ["main.js", "dashboard.js","fetcher.js","login.js","registration.js"];
// pages disposable to be acesses. U need to put the name of file to work

// lof = "List of"; nof = "Number of"

const __dirname = join(dirname(fileURLToPath(import.meta.url)), "..");

const pages = new Object();
const styles = new Object();
const scripts = new Object();

pages_names.forEach((e) => {
  const pages_directory = join(__dirname, "view", "pages");
  pages[e.split(".")[0]] = fs.readFileSync(join(pages_directory, e), {
    encoding: "utf-8",
  });
});

styles_names.forEach((e) => {
  const pages_directory = join(__dirname, "view", "styles");
  styles[e.split(".")[0]] = fs.readFileSync(join(pages_directory, e), {
    encoding: "utf-8",
  });
});

scripts_names.forEach((e) => {
  const pages_directory = join(__dirname, "view", "scripts");
  scripts[e.split(".")[0]] = fs.readFileSync(join(pages_directory, e), {
    encoding: "utf-8",
  });
});

import { convert_request_body_to_JSON } from "../services/Converter.js";
// function responsible for make a conversion to the datagram received at front-end to JSON format




import {
  search_owner_book_user,
  search_reserved_book_user,
  choose_book,
} from "../controllers/UserController.js";
import { Authentication_service } from "../services/Authentication_service.js";
//Controllers

function index(request, response) {
  response.setHeader("Content-Type", "text/html");
  response.writeHead(200);
  response.end(pages.index);
}

function dashboard(request, response) {
  response.setHeader("Content-type", "text/html");
  response.writeHead(200);

  response.end(pages.dashboard);
}

function registration(request, response) {
  response.setHeader("Content-type", "text/html");
  response.writeHead(200);
  response.end(pages.registration);
}

function login(request, response) {
  response.setHeader("Content-type", "text/html");
  response.writeHead(200);
  response.end(pages.login);
}


function api_make_login(request, response) {
  log("api make login","entering at api make login")
  Authentication_service.login(request,response)
    .then(([request, response]) => {
        response.setHeader("Content-type","application/json")
        response.writeHead(200)
        response.end()
    })
}

function api_make_registration(request, response) {
  log("api make login","entering at api make login")
  console.log("Compadre, estas aqui")
  convert_request_body_to_JSON(request).then(e => {
    console.log("Compadre o valor é")
    console.log(e)
  })
  
  Authentication_service.register(request,response)
    .then(([request, response]) => {
      console.log("???????????????????????????????!!!!!!!!!!!!!!!!!!!!!!!!")
        response.setHeader("Content-type","application/json")
        response.writeHead(200)
        response.end()
    })
}

function styles_main(request, response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.main);
}

function styles_dashboard(request, response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.dashboard);
}

function styles_registration(request, response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.registration);
}
function styles_global(request, response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.global);
}

function styles_login(request, response) {
  response.setHeader("Content-Type", "text/css");
  response.writeHead(200);
  response.end(styles.login);
}

function api_books(request, response) {
  const userId = response.getHeader("userId")
  
  const token_header = response.getHeader("authorization")
  log("api for fetching books","the content of authorization is: " + token_header)
  log("api for fetching books","the content of userId is: " + userId)
  
  if (userId == 'null') {
    response.setHeader("Content-type","text/plain")
    response.writeHead(500)
    response.end("User don't logged")
    return
  }
  response.setHeader("Content-type", "application/json");
  response.writeHead(200);
  
  Reservation.findAll({ where: {} })
    .then((all_reservations_made) => {
      const dt = all_reservations_made
        .map((f) => {
          return f.bookId;
        })
        .filter((the_bookId_one) => the_bookId_one != null);
      
      return Book.findAll({ where: { id: { [Op.notIn]: dt }, userId : { [Op.not] : userId} } });
    })
    .then((lof_books_not_reserved) => {
      var json_content = JSON.parse(JSON.stringify(lof_books_not_reserved));

      response.end(JSON.stringify(lof_books_not_reserved));
    });
}

function api_delete_owner_book(request, response) {
  convert_request_body_to_JSON(request).then(async ({ bookId }) => {
    const userId = response.getHeader('userId')
    response.setHeader("Content-type", "application/json");
    const the_book_to_be_destroyed = await Book.findOne({
      where: { id: bookId },
    });

    var isOwner = the_book_to_be_destroyed.userId == userId;

    if (isOwner) {
      response.writeHead(200);
      the_book_to_be_destroyed.destroy();
      response.end(
        JSON.stringify({
          bookId,
          userId,
          status: "worked",
        })
      );
    } else {
      response.writeHead(481);
      response.end(
        JSON.stringify({
          bookId,
          userId,
          status: "not worked",
        })
      );
    }
  });
}

function api_edit_owner_book(request, response) {
  convert_request_body_to_JSON(request).then(async ({ bookId, title, description }) => {
    const userId = response.getHeader('userId')
    response.setHeader("Content-type", "application/json");
    const the_book_to_be_updated = await Book.findOne({
      where: { id: bookId },
    });

    var isOwner = the_book_to_be_updated.userId == userId;
    console.log("MAno isso tá sendo atualizado !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    if (isOwner) {
      response.writeHead(200);
      the_book_to_be_updated.set({
        title, description
      })
      the_book_to_be_updated.save()
      response.end(
        JSON.stringify({
          bookId,
          userId,
          status: "worked",
        })
      );
    } else {
      // response.writeHead(481);
      response.writeHead(418); // Esse é melhor
      response.end(
        JSON.stringify({
          bookId,
          userId,
          status: "not worked",
        })
      );
    }
  });
}

function api_devolve_reserved_book(request, response) {
  convert_request_body_to_JSON(request).then(async ({ bookId }) => {
    const userId = response.getHeader('userId')
    response.setHeader("Content-type", "application/json");
    const the_book_to_be_destroyed = await Book.findOne({
      where: { id: bookId },
    });

    var is_not_the_Owner = the_book_to_be_destroyed.userId != userId;

    if (is_not_the_Owner) {
      const reservation = await Reservation.findOne({ where: { bookId } });
      if (reservation === null) {
        log(
          "server info",
          "can't devolve an book that has already been devolved"
        );
        response.writeHead(481);
        response.end();
        return;
      } else {
        reservation.destroy();

        response.writeHead(200);
        response.end(
          JSON.stringify({
            bookId,
            userId,
            status: "worked",
          })
        );
      }
    } else {
      response.writeHead(481);
      response.end(
        JSON.stringify({
          bookId,
          userId,
          status: "not worked",
        })
      );
    }
  });
}

function api_request_owner_books(request, response) {
  const userId = response.getHeader('userId')
  response.setHeader('Content-type','application/json')
  search_owner_book_user(userId)
  .then((book_found) => {
      response.writeHead(200)
      response.end(JSON.stringify(book_found));
    });
}

function api_request_reserved_books(request, response) {
  const userId = response.getHeader('userId')
  response.setHeader("Content-type","application/json")
  response.writeHead(200)
  search_reserved_book_user(userId)
    .then((book_found) => {
      response.end(JSON.stringify(book_found));
    });
}

function api_choose_book(request, response) {
  convert_request_body_to_JSON(request)
    .then(({ bookId }) => {
      const userId = response.getHeader('userId')
      log("choose book", "entrando na rota");
      return choose_book({ bookId, userId });
    })
    .then((book_choice) => {
      return JSON.stringify(book_choice);
    })
    .then((book_choice) => {
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);
      response.end(book_choice);
    })
    .catch((error) => {
      response.write(418);
      response.end({ error });
    });
}

function api_add_title(request, response) {
  response.setHeader("Content-type", "application/json");
  convert_request_body_to_JSON(request, "json")
    .then(({ title, description }) => {
      const userId = response.getHeader('userId')
      return Book.create({ title, description, userId });
    })
    .then((book_created) => {
      response.writeHead(200);
      response.end(JSON.stringify(book_created.toJSON()));
    })
    .catch((error) => {
      response.writeHead(500);
      response.end({ error });
    });
}

function scripts_main(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.main);
}

function scripts_fetcher(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.fetcher);
}


function scripts_dashboard(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.dashboard);
}

function scripts_login(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.login);
}

function scripts_registration(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end(scripts.registration);
}

function default_(request, response) {
  response.writeHead(404);
  response.end(
    "Algo de errado não está certo, a página não foi encontrada",
    "utf-8"
  );
}
function favicon(request, response) {
  response.setHeader("Content-type", "text/javascript");
  response.writeHead(200);
  response.end();
}

// I should only set the modifier "export" at all functions. But I forgor that i could do this. But this manner works good too.
export default {
  index,
  dashboard,
  registration,
  login,
  styles_dashboard,
  styles_main,
  styles_login,
  styles_registration,
  favicon,
  default_,
  scripts_dashboard,
  scripts_main,
  api_add_title,
  api_choose_book,
  api_request_reserved_books,
  api_request_owner_books,
  api_devolve_reserved_book,
  api_delete_owner_book,
  api_make_login,
  api_make_registration,
  api_books,
  api_edit_owner_book,
  styles_global,
  scripts_fetcher,
  scripts_login,
  scripts_registration,
};
