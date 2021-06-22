

export function composeJSON(request, format = "json") {
    return new Promise(function(resolve,reject){
      var body_parsed = ""
      request.on('data',chunk => {
          body_parsed += chunk
      })
  
      request.on('end',() => {
          if(format == 'json') {
            resolve(JSON.parse(body_parsed))
          } else if(format == 'query') {
            transpiled_object = {}
            body_parsed.split("&").forEach((content) => {
              var key_value_pair = content.split("=");
              transpiled_object[key_value_pair[0]] = key_value_pair[1];
            });
  
            resolve(transpiled_object)
          } else {
            reject(new Error("Format parameter don't recognized"))
          }
      })
  
      request.on('error',error => {
          reject(error)
      })
    })
  }