import crypto from "crypto";
import { User } from "../database.js";
import { convert_request_body_to_JSON } from "./Converter.js";
import { log } from "./Log.js";

export class Authentication_service {
  static users = new Map();

  static authenticate(request, response) {
    // preciso colocar tanto o userId quanto]

    const headers = {};
    Object.entries(request.headers).forEach((e) => (headers[e[0]] = e[1]));

    // log("eita porra",JSON.stringify(headers))
    var authorization_header = headers["authorization"];
    log(
      "authentication service",
      "authorization founded:" + authorization_header
    );
    if (!authorization_header) {
      response.setHeader("userId", "null");
      return false;
    }
    var [bearer, hash] = authorization_header.split(" ");
    // var [bearer, hash] = response.headers["Authorization"].split(" ");
    if (bearer != "Bearer") {
      throw new Error("The format of token isn't correct");
    }
    log("info","the content of this.users: " + Object.fromEntries(this.users))
    var userId = this.users.get(hash);
    log("authentication service", "user with id founded:" + userId);
    if (userId != null) {
      response.setHeader("userId", userId);
      return true;
    } else {
      response.setHeader("userId", "null");
      return false;
    }
  }


  static async register(request, response) {
    console.log("Registration mi compadre!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    const {email, password} = await convert_request_body_to_JSON(request);
    console.log(email)
    console.log(password)
    var create_user = await User.create({
      email, password
    })

    


    return [request, response]
  }

  static async login(request, response) {
    const { email, password } = await convert_request_body_to_JSON(request);
    var user_founded = await User.findOne({
      where: {
        email,
        password,
      },
    });

    if (user_founded) {
      var random_bytes = crypto.randomBytes(20).toString("hex");
      // var hash = crypto.createHmac("sha256", random_bytes);
      var hash = random_bytes;
      this.users.set(hash, user_founded.id); //aqui eu acesso o banco e pego o userId correto
      // request.setHeader("Authorization", "Bearer " + hash);
      response.setHeader("Authorization", "Bearer " + hash);
    } else {
      response.setHeader("Authorization", "Bearer null");
    }

    log(
      "login",
      "successful, the Authorization header is: " +
        response.getHeader("Authorization")
    );

    return [request, response];
  }
}
