import pkg from 'sequelize';
import  {Book, User, Reservation } from '../database.js'
const { Op } = pkg
// //console
export async function search_owner_book_user(userId) {
    var response = await Book.findAll({ where: { userId,  } });
    var data_parsed = JSON.parse(JSON.stringify(response));
    return data_parsed
}

export async function search_reserved_book_user(userId) {
    // //console.log("!!!!!!!!!!!!!!!!!@@@!!!!!!!!!!!!!!!!!!!!!!!")
    // var reservations = await Reservation.findAll({ where : { userId : { [Op.not] : NaN }}})
    var reservations = await Reservation.findAll({ where : { userId }})

    // //console.log("reservation")
    // //console.log(typeof reservations)
    // //console.log(reservations)
    // //console.log("userid")
    // //console.log(userId)
    
    const bookId = reservations.map(e => e.bookId)
    const books = await Book.findAll({ where: { id: { [Op.in]: bookId } } })
    
    const content_parsed = JSON.parse(JSON.stringify(books))

    // //console.log("conten parsed")
    // //console.log(content_parsed)
    return content_parsed

    

}


  
// o usuário de id 'userId' seleciona o livro de id 'bookId'
export async function choose_book({ userId, bookId }) {
var c = await Reservation.findAll({ where: { userId } });
var hasReservation = c.length > 0;

if (!hasReservation) {
} else {
    // checar como eu deveria retornar o status code nesse caso !!
    return {
    userId,
    bookId,
    status: "The user only can choose one book per time",
    };
}
const reservation = new Reservation({
    userId,
    bookId,
});
reservation.save();

return {
    userId,
    bookId,
    status: "Added successful",
};
}