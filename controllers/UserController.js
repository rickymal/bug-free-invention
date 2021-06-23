import  {Book, User, Reservation } from '../database.js'


export async function search_book_user(userId) {
    var response = await Book.findAll({ where: { userId,  } });
    var data_parsed = JSON.parse(JSON.stringify(response));
    console.log('search_book_user')
    console.log(data_parsed)
    return data_parsed
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