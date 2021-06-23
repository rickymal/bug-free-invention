localStorage.setItem("userId", 1);

function onLoad() {
  fetch_list_of_books();
}

// função disparada quando o usuário clica no card para
function reserve_book(bookId) {
  var method = "POST";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var userId = Number(localStorage.getItem("userId"));
  var body = JSON.stringify({ id: bookId, userId: userId });
  var requestOptions = new Request("/api/choose_book", {
    method,
    headers,
    mode,
    cache,
    body,
  });

  headers.append("Content-type", "application/json");

  fetch(requestOptions)
    .then((e) => {
      return e.json();
    })
    .then((f) => {
      if (f.status == "Added successful") {
        var div_to_delete = document.getElementById("div-" + bookId);
        div_to_delete.remove();
      } else {
        alert("O usuário só pode escolher um livro por vez, 'devolva' o livro antes de obter mais um")
      }
    })
    .catch(err => console.log("Error: " + err))
}

function fetch_list_of_books() {
  var method = "GET";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var requestOptions = new Request("/api/books", {
    method,
    headers,
    mode,
    cache,
  });
  headers.append("Content-type", "application/json");
  const division = document.getElementById("flex-row-content");
  fetch(requestOptions)
    .then((data) => {
      return data.json();
    })
    .then((e) => {
      e.forEach((content) => {
        division.innerHTML += `
                <div class='card' id = "div-${content.id}">
                    <div class="text-content" style="background-color: aqua;">
                        <h1>${content.title}</h1>
                        <text>${content.description}</text>
                    </div>
                    <div>
                        <button id = "btn-${content.id}" onclick = "reserve_book(${content.id})">Reservar títulos</button>
                    </div>
                </div>
                `;
      });
    })
    .catch(
      (err) => "Algo do errado não está certo na request dos livros: " + err
    );
}

window.onload = onLoad;
