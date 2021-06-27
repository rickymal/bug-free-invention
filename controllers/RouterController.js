import { User, Book, Reservation, sequelize_content } from "../database.js";
import {log} from '../services/Log.js'
import sequelize from 'sequelize'
const Op = sequelize.Op

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const pages_names = ["index.html", "dashboard.html", "login.html"];
const styles_names = ["dashboard.css", "main.css", "login.css","global.css"];
const scripts_names = ["main.js", "dashboard.js","fetcher.js","login.js"];
// páginas disponíveis para serem acessadas, devem ser configuradas na parte de routing também

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

import { composeJSON } from "../services/ComposeJSON.js";
// function responsible for make a conversion to the datagram received at front-end to JSON format

import {
  search_owner_book_user,
  search_reserved_book_user,
  choose_book,
} from "../controllers/UserController.js";
import { AuthService } from "../services/AuthService.js";
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
  AuthService.login(request,response)
    .then(([request, response]) => {
      const [bearer, session_id] = response.getHeader("Authorization").split(" ")
      if (bearer == "Bearer" && session_id != "null")
      {
        response.setHeader("Content-type","application/json")
        response.writeHead(200)
        response.end()
      }
      else
      {
        response.setHeader("Content-type","application/json")
        response.writeHead(404)
        response.end()
      }
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
  response.setHeader("Content-type", "application/json");
  response.writeHead(200);

  Reservation.findAll({ where: {} })
    .then((all_reservations_made) => {
      const dt = all_reservations_made
        .map((f) => {
          return f.bookId;
        })
        .filter((the_bookId) => the_bookId != null);

      return Book.findAll({ where: { id: { [Op.notIn]: dt } } });
    })
    .then((lof_books_not_reserved) => {
      var json_content = JSON.parse(JSON.stringify(lof_books_not_reserved));

      response.end(JSON.stringify(lof_books_not_reserved));
    });
}

function api_delete_owner_book(request, response) {
  composeJSON(request).then(async ({ bookId, userId }) => {
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

function api_devolve_reserved_book(request, response) {
  composeJSON(request).then(async ({ bookId, userId }) => {
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
  composeJSON(request)
    .then((result) => {
      return Number(result.userId);
    })
    .then((userId) => {
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);
      return search_owner_book_user(userId);
    })
    .then((book_found) => {
      response.end(JSON.stringify(book_found));
    });
}

function api_request_reserved_books(request, response) {
  composeJSON(request)
    .then((result) => {
      return Number(result.userId);
    })
    .then((userId) => {
      response.setHeader("Content-type", "application/json");
      response.writeHead(200);

      return search_reserved_book_user(userId);
    })
    .then((book_found) => {
      response.end(JSON.stringify(book_found));
    });
}

function api_choose_book(request, response) {
  composeJSON(request)
    .then(({ bookId, userId }) => {
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

  composeJSON(request, "json")
    .then(({ title, description, userId }) => {
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
  api_books,
  styles_global,
  scripts_fetcher,
  scripts_login,
};
