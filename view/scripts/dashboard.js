
send_request('/','POST',new Headers(), {})
  .then(e => e.text())
  .then(e => console.log("Content to new request:" + e))




function delete_owner_book(bookId) {
  
  var headers = new Headers();
  var body = JSON.stringify({ bookId });
  headers.append("Content-type", "application/json");

  send_request('/api/delete_owner_book','POST',headers, body)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}

function devolve_reserved_book(bookId) {
  var headers = new Headers();
  var body = JSON.stringify({  bookId });
  headers.append("Content-type", "application/json");
  
  console.log(body)
  
  send_request('/api/devolve_reserved_book','POST',headers,body)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}

function request_owner_title() {
  
  var headers = new Headers();
  headers.append("Content-type", "application/json");
  
  send_request('/api/request_owner_books','GET',headers,)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");
      console.log("Request owner book made with successful")
      console.log(lof_response_parsed)
      // var c =



      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML +=  `
        <div class="card" id = id-${response_parsed.id}>
            <div class="text-content">
              <h1>${response_parsed.title}</h1>
              <text>${response_parsed.description}</text>
            </div>
            <div>
              <button id="btn" onclick = "delete_owner_book(${response_parsed.id},)">Excluir título</button>
            </div>
        </div>
        `;
      });
    })
    .catch(async (error) => {console.log("error: "+ error)});
}

function request_reserved_title() {
  var headers = new Headers();
  headers.append("Content-type", "application/json");
  
  send_request('/api/request_reserved_books','GET',headers,)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");
      console.log("Request reserved book made with successful")
      console.log(lof_response_parsed)
      // const card_document.innerHTML =  
      lof_response_parsed.forEach((response_parsed) => {
        var component_as_string = `
        <div class="card" id = id-${response_parsed.id}>
            <div class="text-content">
              <h1>${response_parsed.title}</h1>
              <text>${response_parsed.description}</text>
            </div>
            <div>
              <button id="btn" onclick = "devolve_reserved_book(${response_parsed.id})">Desfazer reserva</button>
            </div>
        </div>
        `;

        var new_document = document.createElement("div");
        new_document.id = "to-unwrap"
        new_document.innerHTML = component_as_string;
        card_document.insertBefore(new_document, card_document.firstChild);
        new_document.outerHTML = new_document.innerHTML
      });
    })
    .catch(async (error) => {});
}

function onLoad() {
  // adicionar o userId do usuário
  // var form_doc = document.getElementById("hidden-input-user-id");
  // form_doc.setAttribute("value", userId.toString());

  request_reserved_title();
  request_owner_title();
}

// capturar os elementos

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(e.target));

  var headers = new Headers();
  var body = JSON.stringify(form_parsed);
  headers.append("Content-type", "application/json");



  send_request('/api/add_title','POST',headers,body)
    .then((e) => {
      if (e.status == 200) {
        return e.json();
      }
    })
    .then((response_parsed) => {
      var component_as_string = `
      <div class="card" id = id-${response_parsed.id}>
          <div class="text-content">
            <h1>${response_parsed.title}</h1>
            <text>${response_parsed.description}</text>
          </div>
          <div>
            <button id="btn" onclick = "delete_owner_book(${response_parsed.id})">Excluir título</button>
          </div>
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
