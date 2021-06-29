function send_request(url = '',method = '',headers = new Headers(), body = {}) {
    var mode = 'cors'
    var cache = 'default'
    var session_id = localStorage.getItem('session_id')
    headers.append("authorization", "Bearer " + session_id)
    var credentials = 'include' // não é necessário, o mais importante é ter o mode no 'cors' em vez de 'no-cors'
   
    if (method == "GET") {
        var options = {method, mode, cache, headers, credentials}
        
    } else{
        var options = {method, mode, cache, body, headers,credentials}
    }
    console.log("[SENDING REQUEST] with method " + method + " and with body " + JSON.stringify(body))
    var request_options = new Request(url,options)
    return new Promise(function (resolve,reject) {
        if(session_id){
            console.log("[SESSION ID] Founded")
            
        } else {
            console.warn("[SESSION ID] Not Founded, defining as null...")
        }
        fetch(request_options)
        .then(e => resolve(e))
        .catch(e => reject(e))
    })
}
    
