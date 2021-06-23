// localStorage.setItem('userId',1) // deve ser setado posteriormente
var userId = localStorage.getItem("userId");
if (!userId) {
  // throw new Error("Variável UserId não foi definida em localStorage")
  userId = 1; //para fins de teste
}

function get_data() {
  ////console.log("Buscando os livros do usuário");
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();

  var body = JSON.stringify({ userId });
  ////console.log("Conteúdo no userId: " + body);
  ////console.log("Tipo:" + typeof JSON.parse(body).userId);
  headers.append("Content-type", "application/json");
  var options = { method, mode, cache, body, headers };

  
  ////console.log(options);

  // tinha esquecido da passar o options
  var requestOptions = new Request("/api/request_books", options);
  
  fetch(requestOptions)
    .then(async response => {
      return response.json();

      //// console.log("response info")
      //// console.log(content_response)
      // if (content_response[0]) {
      //   return content_response[0]; //um erro que faz com que a informações retorne um corpo dentro de outro
      // } else {
      //   return content_response; 
      // }

      
    })
    .then(async (lof_response_parsed) => {
      ////console.log("resposta do usuário");
      ////console.log(response_parsed);

      var card_document = document.getElementById('flex-row-content')
      //console.log("content parsed")


      lof_response_parsed.map(response_parsed => {
        card_document.innerHTML +=
        `
          <div class='card' id = id-${response_parsed.id}>
              <div class="text-content" style="background-color: aqua;">
                  <h1>${response_parsed.title}</h1>
                  <text>${response_parsed.description}</text>
              </div>
              <button>Excluir título</button>        
          </div>  
        
        `

      })
    })
    .catch(async (error) => {
      ////console.error("algo de errado n está certo: " + error);
    });
}

function onLoad() {
  ////console.log("dashboard loaded");
  ////console.log("dashboard loaded");

  var content = get_data();

  // adicionar o userId do usuário
  var form_doc = document.getElementById('hidden-input-user-id')
  form_doc.setAttribute("value",userId.toString())

}   



// declarar os eventos
window.onload = onLoad;