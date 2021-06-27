function send_request(url = '',method = '',headers = new Headers(), body = {}) {
    var mode = 'no-cors'
    var cache = 'default'
    var options = {method, mode, cache, body, headers }
    var userToken = localStorage.getItem('token')
    headers.append("Authorization", "Bearer " + userToken)
    console.log("[SENDING REQUEST] with method " + method + " and with body " + JSON.stringify(body))
    var requestOptions = new Request(url,options)
    return new Promise(function (resolve,reject) {
        if(userToken){
            fetch(requestOptions)
            .then(e => resolve(e))
            .catch(e => reject(e))
        } else {
            reject(new Error("Token not found"))
        }
    })
}
    
