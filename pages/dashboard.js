// localStorage.setItem('userId',1) // deve ser setado posteriormente


function get_data() {
    console.log("Buscando os livros do usuário")
    var method = "POST"
    var mode = "no-cors"
    var cache = "default"
    var headers = new Headers()
    var body = JSON.stringify({ userId })

    

    var userId = localStorage.getItem('userId')

    if (!userId) {
        // throw new Error("Variável UserId não foi definida em localStorage")
        userId = 1; //para fins de teste
    }


    headers.append("Content-type","application/json")


    var requestOptions = new Request('/api/request_books', { method, mode, cache, body, headers})
    console.log("fetching")
    fetch(requestOptions)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.error("algo de errado n está certo: " + error)
        })



    
}

function onLoad() {
    console.log("dashboard loaded")
    console.log("dashboard loaded")
    

    var content = get_data()
}





// declarar os eventos
window.onload = onLoad