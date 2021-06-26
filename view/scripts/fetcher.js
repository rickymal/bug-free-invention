

function sendRequest(url,method,headers, body) {
    var mode = 'no-cors'
    var cache = 'default'
    var options = {method, mode, cache, body, headers }

    var userToken = localStorage.getItem('token')
    
    var requestOptions = new Request(url,options)
    return new Promise(function (resolve,reject) {
        fetch(requestOptions)
            .then(e => resolve(e))
            .catch(e => reject(e))
    })
}