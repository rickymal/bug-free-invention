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

const scripts = {
    main : fs.readFileSync(join(pages_directory,"main.js"),{encoding : 'utf-8'}),
}





/* Database space */


const sequelize = new Sequelize({
    dialect : 'sqlite',
    storage : 'database.sqlite'
});

class User extends Model {
    
}


class Book extends Model {
    
}

class Reservation extends Model {

}


var dt = DataTypes
User.init({
    email : dt.STRING,
    password : dt.STRING,
},{sequelize, modelName : 'user'})

Book.init({
    title : dt.STRING,
    description : dt.TEXT,
}, {sequelize, modelName : 'book'})


Reservation.init({},{sequelize, modelName : "reservation"})

User.hasMany(Book)
Book.belongsTo(User, {
    foreignKey : {
        allowNull : true,
    },
    constraints : true,
});


User.hasMany(Reservation)
Reservation.belongsTo(User)


Book.hasOne(Reservation)
Reservation.belongsTo(Book)





async function initializeSequelize() {
    await sequelize.sync({force : true})
}

await initializeSequelize();

const rique_user = await User.create({
    email : "henriquemauler@gmail.com",
    password : "123456789",
})


const another_user = await User.create({
    email : "anotheremail@tylok.com",
    password : "123456789",
})


const book1 = await Book.create({
    title : "Knowing yourself",
    description : "This is a book that make you know about yourself better",
})

const book2 = await Book.create({
    title : "The narnia Chronics",
    description : "This is a book that will teach you about a imaginary space",
})



book1.setUser(rique_user)
book2.setUser(another_user)


// escolhendo um livro e criando uma reserva



var userId = 1;
var bookId = 1;

// checando se já tem alguma reserva do livro selecionado


/* Server configuration and routing */
const server = http.createServer(async (request,response) => {
    
    
    response.setHeader('Access-Control-Allow-Origin','*')
    response.setHeader('Access-Control-Allow-Methods','OPTIONS,POST,GET')
    console.log("Acessando URL: " + request.url)
    
    switch(request.url) {
        case "/":
            response.writeHead(200)
            response.end("Entrando na rota principal")
            break;

            case "/index" :
                console.log("TIPAGEM: " + typeof pages.index)
                response.setHeader("Content-Type","text/html")
                response.writeHead(200)
                response.end(pages.index)
                break;
            case "/dashboard":
                console.log("página do dashboard");
                response.setHeader("Content-type","text/html")
                response.writeHead(200)
                response.end(pages.dashboard)
                break;
            case "/registration":
                console.log("Página de registro")
                response.setHeader("Content-type","text/html")
                response.writeHead(200)
                response.end(pages.registration)
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

            case "/api/make_login":
                var body = "";
                console.log("Verificando a request: " + request.method)
                console.log("Verificando a request: " + request.httpVersion)
                
                request.on('data',chunk => {
                    console.log("Chamando uma chunk")
                    body += chunk
                })

                request.on('end',() => {
                    response.setHeader("Content-type","text/plain")
                    response.writeHead(200)
                    response.end("O conteúdo enviado é: " + body);
                    
                })

                request.on('error',err => console.log("Algo de errado no método POST não está certo: " + err))
                break;
                
            case "/main.js":
                response.setHeader("Content-type","text/javascript")
                response.writeHead(200)
                response.end(scripts.main)
                break;

            case "/api/books":
                console.log("Entrando em /api/books")
                console.log("Verificando a request: " + request.method)
                console.log("Verificando a request: " + request.httpVersion)
                response.setHeader("Content-type","application/json")
                response.writeHead(200)
                const json_stringified = JSON.stringify({result : "Ding din Ding din sou foda" })
                
                Book.findAll({where : {}})
                    .then(e => {
                        console.log(JSON.stringify(e))
                        response.end(JSON.stringify(e))
                    })

                break;


            case "/api/choose_book":
                var body_as_string = "";
                console.log("Verificando a request: " + request.method)
                console.log("Verificando a request: " + request.httpVersion)
                
                


                request.on('data',chunk => {
                    console.log("Chamando uma chunk")
                    body_as_string += chunk
                })

                request.on('end',() => {
                    
                    //Implementação do recurso
                    const json = JSON.parse(body_as_string)
                    console.log(json)

                    // await choose_book();

                    
                    
                    choose_book(json).then(e => {
                        return JSON.stringify(e)
                    }).then(f => {
                        
                        response.setHeader("Content-type","application/json")
                        response.writeHead(200)
                        response.end(f)

                        return 0;
                    })
                    

                    // Book.findOne({where : { id : json.id}})
                    //     .then(the_book_one => {
                    //         console.log(the_book_one)
                    //     })
                    
                    
                })

                request.on('error',err => console.log("Algo de errado no método POST não está certo: " + err))
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

async function choose_book({userId, bookId}) {
    var c = await Reservation.findAll({ where: { userId } });
    var hasReservation = c.length > 0;

    if (!hasReservation) {
        console.log("há uma reserva");
    } else {
        console.warn("Não deveria chegar aqui, não deveria existir um livro já reservado visível na dashboard");

        // checar como eu deveria retornar o status code nesse caso !!
        return {
            userId,bookId, status : "The user only can choose one book per time",
        }
        
        
    }
    const reservation = new Reservation({
        userId,
        bookId,
    });
    reservation.save();

    return {
        userId,bookId, status : "Added successful"
    }
}



const compile = (param) => JSON.stringify(content(JSON.parse(param)))

