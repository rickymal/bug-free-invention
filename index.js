import http from 'http';
import fs from 'fs'
const port = 3000
const host = 'localhost'


import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'sequelize'

const {Sequelize, Model, DataTypes} = pkg



/* Global variables */
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("Carregando as páginas")
const pages_directory = join(__dirname,"pages")

const pages = {
    index : fs.readFileSync(join(pages_directory,"index.html"),{encoding : 'utf-8'}),
    dashboard : fs.readFileSync(join(pages_directory,"dashboard.html"),{encoding : 'utf-8'}),
    registration : fs.readFileSync(join(pages_directory,"registration.html"),{encoding : 'utf-8'}),
}

const styles = [
    fs.readFileSync(join(pages_directory,"dashboard.css"),{encoding : 'utf-8'}),
    fs.readFileSync(join(pages_directory,"mystyle.css"),{encoding : 'utf-8'}),
    fs.readFileSync(join(pages_directory,"registration.css"),{encoding : 'utf-8'}),
]





/* Database space */


const sequelize = new Sequelize("sqlite::memory:");

class User extends Model {
    
}


class Book extends Model {
    
}


var dt = DataTypes
User.init({
    email : dt.STRING,
    password : dt.STRING,
},{sequelize})

Book.init({
    title : dt.STRING,
    description : dt.TEXT,
}, {sequelize})


User.hasMany(Book)
Book.belongsTo(User);

async function initializeSequelize() {
    await sequelize.sync({force : true})
}

initializeSequelize();




/* Server configuration and routing */
const server = http.createServer((request,response) => {
    
    
    response.setHeader('Access-Control-Allow-Origin','*')
    response.setHeader('Access-Control-Allow-Methods','OPTIONS,POST,GET')
    console.log("Acessando URL: " + request.url)
    
    switch(request.url) {
        case "/":
            
            response.writeHead(200)
            response.end("Entrando na rota principal")
            break;

            case "/home" :
                console.log("TIPAGEM: " + typeof pages.index)
                response.setHeader("Content-Type","text/html")
                response.writeHead(200)
                response.end(pages.index + ".html")
                break;
                case "/dashboard":
                    console.log("página do dashboard");
                response.setHeader("Content-type","text/html")
                response.writeHead(200)
                response.end(pages.dashboard + ".html")
                break;

            case "/registration":
                console.log("Página de registro")
                response.setHeader("Content-type","text/html")
                response.writeHead(200)
                response.end(pages.registration + ".html")
                break;

            case '/mystyle.css':
                response.setHeader("Content-Type","text/css")
                
                response.writeHead(200)
                response.end(styles[1]);
                console.log("Pegando meu estilo");
                break;
            case '/dashboard.css':
                response.setHeader("Content-Type","text/css")
                
                response.writeHead(200)
                response.end(styles[0]);
                
                break;
            case '/registration.css':
                response.setHeader("Content-Type","text/css")
                response.writeHead(200)
                response.end(styles[2]);
                break;

            case "/api/send_notification":
                
                break;
                
            default:
                response.writeHead(404)
                response.end("Algo de errado não está certo, a página não foi encontrada","utf-8")
                break;
        }


})


server.listen(port,host, () => {
    console.log("Servidor está rodando na em http://" + host + ":" + port);
    console.log("Olá mundo " + pages_directory);
})

function onRequestedInformation(request, response) {

}




