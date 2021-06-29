

export function convert_request_headers_to_JSON(request) {
  const headers = {};
  Object.entries(request.headers).forEach((e) => (headers[e[0]] = e[1]));
  return headers
}


export function convert_request_body_to_JSON(request, request_body_format = "json") {
  return new Promise(function (resolve, reject) {
    var body_parsed = "";
    request.on("data", (chunk) => {
      body_parsed += chunk;
    });

    request.on("end", () => {
      try {
        if (request_body_format == "json") {
          var content_parsed = null
          try {
            content_parsed = JSON.parse(body_parsed);
          } catch (err) {
            console.log("ERROR")
            console.log(body_parsed)
          }
          resolve(content_parsed);
        } else if (request_body_format == "query") {
          let transpiled_object = {};
          body_parsed.split("&").forEach((content) => {
            var key_value_pair = content.split("=");
            transpiled_object[key_value_pair[0]] = key_value_pair[1];
          });
          // transpiled_object['userId'] = response.getHeader('userId')

          resolve(transpiled_object);
        } else {
          reject(new Error("request_body_format parameter don't recognized"));
        }
      } catch (err) {
        reject(err);
      }
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}
