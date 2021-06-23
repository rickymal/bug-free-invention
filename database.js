import pkg from "sequelize";
const { Sequelize, Model, DataTypes, Op } = pkg;

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

User.hasMany(Reservation);
Reservation.belongsTo(User);

Book.hasOne(Reservation);
Reservation.belongsTo(Book);

async function initializeSequelize() {
  await sequelize.sync({ force: true });
}

await initializeSequelize();

const rique_user = await User.create({
  email: "henriquemauler@gmail.com",
  password: "123456789",
});

const another_user = await User.create({
  email: "anotheremail@tylok.com",
  password: "123456789",
});

const book1 = await Book.create({
  title: "Knowing yourself",
  description: "This is a book that make you know about yourself better",
});

const book2 = await Book.create({
  title: "The narnia Chronics",
  description: "This is a book that will teach you about a imaginary space",
});

book1.setUser(rique_user);
book2.setUser(another_user);

Reservation.create({
  userId: rique_user.id,
  bookId: book1.id,
});
