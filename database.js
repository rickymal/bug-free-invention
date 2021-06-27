import pkg from "sequelize";
const { Sequelize, Model, DataTypes } = pkg;

export const sequelize_content = pkg;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

export class User extends Model {}
export class Book extends Model {}
export class Reservation extends Model {}


var dt = DataTypes;
User.init(
  {
    email: dt.STRING,
    password: dt.STRING,
  },
  { sequelize, modelName: "user" }
);

Book.init(
  {
    title: dt.STRING,
    description: dt.TEXT,
  },
  { sequelize, modelName: "book" }
);

Reservation.init({}, { sequelize, modelName: "reservation" });

User.hasMany(Book);
Book.belongsTo(User, {
  foreignKey: {
    allowNull: true,
  },
  constraints: true,
});

User.hasMany(Reservation, {
  onDelete: "CASCADE",
});
Reservation.belongsTo(User);

Book.hasOne(Reservation, {
  onDelete: "CASCADE",
});
Reservation.belongsTo(Book);

async function initializeSequelize() {
  await sequelize.sync({ force: true });
}

await initializeSequelize();

const henrique = await User.create({
  email: "henriquemauler@gmail.com",
  password: "123456789",
});

const pamela = await User.create({
  email: "anotheremail@tylok.com",
  password: "123456789",
});

const gustavo = await User.create({
  email: "gustavo@tylok.com",
  password: "123456789",
});

// criando os livros

const knowing_yourself = await Book.create({
  title: "Knowing yourself",
  description: "This is a book that make you know about yourself better",
});

const The_narina_Chronics = await Book.create({
  title: "The narnia Chronics",
  description: "This is a book that will teach you about a imaginary space",
});

const Homo_Sapiens = await Book.create({
  title: "The homo Sapiens story",
  description: "The history of homo sapiens is good",
});

const Homo_Deus = await Book.create({
  title: "Homo Deus",
  description: "The homo Deus content",
});

const Linux_discovering = await Book.create({
  title: "Discovering linux",
  description: "This is an book for discovering the linux",
});

knowing_yourself.setUser(henrique);
The_narina_Chronics.setUser(henrique); // alugado

Homo_Sapiens.setUser(pamela);
Homo_Deus.setUser(pamela);

Linux_discovering.setUser(gustavo); //alugado

// Reservation.create({
//   userId: henrique.id,
//   bookId: Linux_discovering.id,
// });

// Reservation.create({
//   userId: pamela.id,
//   bookId: The_narina_Chronics.id,
// });
