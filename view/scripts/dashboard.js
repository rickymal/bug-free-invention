
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

function update_book(self,bookId,last_title,last_description) {
  self.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(self.target));
  form_parsed.last_title = last_title,
  form_parsed.last_description = last_description
  form_parsed.bookId = bookId
  console.log(form_parsed)
  var headers = new Headers();
  var body = JSON.stringify(form_parsed);
  headers.append("Content-type", "application/json");

  console.log("Obtendo headers")

  send_request('/api/edit_title','POST',headers,body)
    .then((e) => {
      if (e.status == 200) {
        return e.json();
      }
    })
    .then((response_parsed) => {


      var title_content = document.getElementById("h1Id-" + bookId)
      var description_content = document.getElementById("textId-" + bookId)

      title_content.innerHTML = form_parsed.title
      description_content.innerHTML = form_parsed.description

      // document.getElementById("frm2").style.display = "none"
      document.getElementById("container-updater").style.display = "none"

    });
}


// mostra o campo e altera seu eventlistener
function edit_owner_book(bookId) {

  console.log("entrnado na funçaõ")

  var edit_container = document.getElementById("container-updater")
  console.log(edit_container.style.display)
  edit_container.style.display = "flex"
  console.log("O bookId: " + bookId)
  var title = document.getElementById("h1Id-" + bookId).textContent
  var description = document.getElementById("textId-" + bookId).textContent

  console.log(title)
  console.log(description)

  document.getElementById("title-updater").setAttribute('value',title)
  document.getElementById("description-updater").innerHTML = description
  console.log("Evento listener ativado !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  document.getElementById("frm2").addEventListener("submit", (e) => update_book(e,bookId,title,description))

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

      card_document.innerHTML = ""

      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML +=  `
        <div class="card" id = id-${response_parsed.id}>
            <div class="text-content">
              <h1 id = "h1Id-${response_parsed.id}">${response_parsed.title}</h1>
              <text id = "textId-${response_parsed.id}">${response_parsed.description}</text>
            </div>
            <div>
              <button id="btn" onclick = "delete_owner_book(${response_parsed.id},)">Excluir título</button>
              <button id="btn" onclick = "edit_owner_book(${response_parsed.id},)">Editar título</button>
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

document.getElementById("frm1").addEventListener("submit", function (e) {
// document.querySelector("form").addEventListener("submit", function (e) {
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
            <h1 id = "h1Id-${response_parsed.id}">${response_parsed.title}</h1>
            <text id = "textId-${response_parsed.id}">${response_parsed.description}</text>
          </div>
          <div>
            <button id="btn" onclick = "delete_owner_book(${response_parsed.id})">Excluir título</button>
            <button id="btn" onclick = "edit_owner_book(${response_parsed.id})">Editar título</button>
          </div>
      </div>
      `;

      console.log("component data content")
      console.log(component_as_string)

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
