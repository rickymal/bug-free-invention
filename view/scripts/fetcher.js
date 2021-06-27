function send_request(url = '',method = '',headers = new Headers(), body = {}) {
    var mode = 'no-cors'
    var cache = 'default'
    var options = {method, mode, cache, body, headers }
    var session_id = localStorage.getItem('session_id')
    headers.append("Authorization", "Bearer " + session_id)
    console.log("[SENDING REQUEST] with method " + method + " and with body " + JSON.stringify(body))
    var request_options = new Request(url,options)
    return new Promise(function (resolve,reject) {
        if(session_id){
            fetch(request_options)
            .then(e => resolve(e))
            .catch(e => reject(e))
        } else {
            reject(new Error("Token not found"))
        }
    })
}
    
