// localStorage.setItem('userId',1) // deve ser setado posteriormente


function get_data() {
    console.log("Buscando os livros do usuário")
    var method = "POST"
    var mode = "no-cors"
    var cache = "default"
    var headers = new Headers()

    var userId = localStorage.getItem('userId')
    if (!userId) {
        // throw new Error("Variável UserId não foi definida em localStorage")
        userId = 1; //para fins de teste
    } 

    var body = JSON.stringify({ userId })
    console.log("Conteudo no userId: " + body)
    console.log("Tipo:" + typeof(JSON.parse(body).userId))

    headers.append("Content-type","application/json")


    var options = { method, mode, cache, body, headers}

    console.log(options)

    // tinha esquecido da passar o options
    var requestOptions = new Request('/api/request_books', options )
    console.log("fetching")
    fetch(requestOptions)
        .then(response => {
            console.log(response)
            var content_response = response.json()
            if (!content_response[0]) {
                return content_response[0]
            } else{
                return content_response //um erro que faz com que a informações retorne
            }

            return content_response[0]
        })
        .then(response_parsed => {
            console.log("resposta do usuário")
            console.log(response_parsed)
            
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