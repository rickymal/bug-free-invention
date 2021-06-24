var userId = localStorage.getItem("userId");
if (!userId) {
  // throw new Error("Variável UserId não foi definida em localStorage") // habilitar esta opção no final
  userId = 1; //para fins de teste
}

function request_owner_title() {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();

  var body = JSON.stringify({ userId });

  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
  var requestOptions = new Request("/api/request_owner_books", options);
  fetch(requestOptions)
    .then(async (response) => {
      console.log("Content")
      console.log(response)

      return response.json();
    })
    .then(async (lof_response_parsed) => {
      console.log("Content parsed")
      console.log(lof_response_parsed)
      var card_document = document.getElementById("flex-row-content");

      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML += `
          <div class='card' id = id-${response_parsed.id}>
              <div class="text-content" style="background-color: aqua;">
                  <h1>${response_parsed.title}</h1>
                  <text>${response_parsed.description}</text>
              </div>
              <button>Excluir título</button>        
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
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
  var requestOptions = new Request("/api/request_reserved_books", options);
  
  fetch(requestOptions)
    .then(async (response) => {
      console.log("Content")
      console.log(response)

      return response.json();
    })
    .then(async (lof_response_parsed) => {
      console.log("Content parsed")
      console.log(lof_response_parsed)
      var card_document = document.getElementById("flex-row-content");

      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML += `
          <div class='card' id = id-${response_parsed.id}>
              <div class="text-content" style="background-color: aqua;">
                  <h1>${response_parsed.title}</h1>
                  <text>${response_parsed.description}</text>
              </div>
              <button>Excluir título</button>        
          </div>  
        
        `;
      });
    })
    .catch(async (error) => {});
}





function onLoad() {
  // adicionar o userId do usuário
  var form_doc = document.getElementById("hidden-input-user-id");
  form_doc.setAttribute("value", userId.toString());

  request_reserved_title()
  request_owner_title()
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
        alert("Livro adicionado com sucesso!");
      }
    })
    .catch((err) => console.log("Error: " + err));
});

// var formData = new FormData(document.querySelector('form'))

// declarar os eventos
window.onload = onLoad;
