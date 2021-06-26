var userId = localStorage.getItem("userId");
if (!userId) {
  // throw new Error("Variável UserId não foi definida em localStorage") // habilitar esta opção no final
  userId = 1; //para fins de teste
}

function delete_owner_book(bookId, userId) {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var body = JSON.stringify({ userId, bookId });
  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };

  var requestOptions = new Request("/api/delete_owner_book", options);

  fetch(requestOptions)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}

function devolve_reserved_book(bookId, userId) {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var body = JSON.stringify({ userId, bookId });
  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };
  console.log(body)
  var requestOptions = new Request("/api/devolve_reserved_book", options);

  fetch(requestOptions)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}

function request_owner_title() {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();

  var body = JSON.stringify({ userId });

  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };

  var requestOptions = new Request("/api/request_owner_books", options);
  fetch(requestOptions)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");

      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML += `
          <div class='card' id = id-${response_parsed.id}>
              <div class="text-content" style="background-color: aqua;">
                  <h1>${response_parsed.title}</h1>
                  <text>${response_parsed.description}</text>
              </div>
              <button onclick = "delete_owner_book(${response_parsed.id},${userId})">Excluir título</button>        
          </div>  
        `;
      });
    })
    .catch(async (error) => {});
}

function request_reserved_title() {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();

  var body = JSON.stringify({ userId });

  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };

  var requestOptions = new Request("/api/request_reserved_books", options);

  fetch(requestOptions)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");

      lof_response_parsed.forEach((response_parsed) => {
        var component_as_string = `
          <div class='card reserved' id = id-${response_parsed.id}>
            <div class="text-content" style="background-color: red;">
              <h1>${response_parsed.title}</h1>
              <text>${response_parsed.description}</text>
            </div>
          <button onclick = "devolve_reserved_book(${response_parsed.id},${userId})">Desfazer reserva</button>        
          </div>  
          
        `;

        var new_document = document.createElement("div");
        new_document.innerHTML = component_as_string;
        card_document.insertBefore(new_document, card_document.firstChild);
      });
    })
    .catch(async (error) => {});
}

function onLoad() {
  // adicionar o userId do usuário
  var form_doc = document.getElementById("hidden-input-user-id");
  form_doc.setAttribute("value", userId.toString());

  request_reserved_title();
  request_owner_title();
}

// capturar os elementos

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(e.target));

  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var body = JSON.stringify(form_parsed);
  headers.append("Content-type", "application/json");

  var options = { method, mode, cache, body, headers };
  var requestOptions = new Request("/api/add_title", options);

  fetch(requestOptions)
    .then((e) => {
      if (e.status == 200) {
        return e.json();
      }
    })
    .then((response_parsed) => {
      var component_as_string = `
      <div class='card' id = id-${response_parsed.id}>
        <div class="text-content" style="background-color: aqua;">
          <h1>${response_parsed.title}</h1>
          <text>${response_parsed.description}</text>
        </div>
      <button onclick = "delete_owner_book(${response_parsed.id}, ${userId})">Excluir título</button>        
      </div>  
      
    `;
      var card_document = document.getElementById("flex-row-content");
      var new_document = document.createElement("div");
      new_document.innerHTML = component_as_string;
      // card_document.insertBefore(new_document, card_document.firstChild);

      card_document.appendChild(new_document);
    });
});

// var formData = new FormData(document.querySelector('form'))

// declarar os eventos
window.onload = onLoad;
