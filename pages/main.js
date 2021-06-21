
localStorage.setItem('userId',1)


function onLoad() {
    console.log("A PÁGINA FOI CARREGADA");
    console.log("A PÁGINA FOI CARREGADA");
    console.log("A PÁGINA FOI CARREGADA");
    console.log("A PÁGINA FOI CARREGADA");
    console.log("A PÁGINA FOI CARREGADA");


    // document.getElementById('btn').addEventListener('click',onClick_button, false)
    getBooks()
}

function btnClick(bookId) {
    alert("O id do botão clicado é: " + bookId)
    var method = "POST"
    var mode =  "no-cors"
    var cache = "default"
    var headers = new Headers()

    var userId = localStorage.getItem('userId')
    var body = JSON.stringify({ id : bookId , userId : userId})
    

    var requestOptions = new Request("/api/choose_book", {method, headers, mode, cache, body} )
    headers.append("Content-type","application/json")

    
    fetch(requestOptions)
        .then(e => {
            return e.json()
                
        })
        .then(f => {
            console.log(f)
            if (f.status == "Added successful") {
                var div_to_delete = document.getElementById('div-' + bookId)
                div_to_delete.remove()
            }
            
        })
}

function getBooks () {
    
    console.log("clique no botão")
    var method = "GET"
    var mode =  "no-cors"
    var cache = "default"
    
    var headers = new Headers()
    var requestOptions = new Request('/api/books', {method, headers, mode, cache} )
    headers.append("Content-type","application/json")
    
    // var requestResult = await fetch(requestOptions)    
    // const doc = document.createElement('button')
    // doc.innerHTML += "dyn button"
    // document.body.appendChild(doc)
    const division = document.getElementById("flex-row-content")


    fetch(requestOptions)
        .then(data => {
            return data.json()
            
        })
        .then(e => {
            console.log("Content: " + JSON.stringify(e))
            e.forEach(content => {
                console.log("Content append: " + JSON.stringify(content ))
                division.innerHTML += `
                <div class='card' id = "div-${content.id}">
                    <div class="text-content" style="background-color: aqua;">
                        <h1>${content.title}</h1>
                        <text>${content.description}</text>
                    </div>
                    <div>
                        <button id = "btn-${content.id}" onclick = "btnClick(${content.id})">Reservar títulos</button>
                    </div>
                </div>
                `

                // document.getElementById(`btn-${content.id}`).addEventListener('click',(e) => {
                //     if (e.target && e.target.id == `btn-${content.id}`){
                //         alert("OI")
                //     }
                // })
    
            })
            // document.getElementById('btn').addEventListener('click',onClick_button, false)
         })
        .catch(err => console.warn("Algo do errado não está certo na request dos livros: " + err))
        

    // requestResult.json()
     
    // console.log(await r.json())
    // console.log(typeof await r.json())
    
}





window.onload = onLoad


