import crypto from 'crypto'
import {User} from '../database.js'
import { composeJSON } from './ComposeJSON.js';
import {log} from "../services/Log.js"


export class AuthService {
    static users = new Map()
    
    static authenticate(request, response) {
      // preciso colocar tanto o userId quanto]
      var authorization_header = response.getHeader("Authorization")
      if (!authorization_header) {
          response.setHeader("userId", "null");
          return false
      } 
      var [ bearer, hash] = authorization_header.split(" ")
      // var [bearer, hash] = response.headers["Authorization"].split(" ");
      if (bearer != "Bearer") {
        throw new Error("The format of token isn't correct");
      }
  
      var userId = this.users.get(hash);
      if (userId != null) {
        response.setHeader("userId", userId);
        return true;
      } else {
        response.setHeader("userId", "null");
        return false;
      }
    }
  
    static async login(request, response) {
    
      const {email, password} = await composeJSON(request);
      var user_founded = await User.findOne({where : {
        email, password
      }})


      if (user_founded) {
        var random_bytes = crypto.randomBytes(20).toString('hex');
        // var hash = crypto.createHmac("sha256", random_bytes);
        var hash = random_bytes
        this.users.set(hash, user_founded.id); //aqui eu acesso o banco e pego o userId correto
        // request.setHeader("Authorization", "Bearer " + hash);
        response.setHeader("Authorization", "Bearer " + hash);
      } else{
        response.setHeader("Authorization", "Bearer null")
      }

      log("login","successful, the Authorization header is: " + response.getHeader("Authorization"))
      
      
      return [request, response];
    }
  }