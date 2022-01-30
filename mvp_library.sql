CREATE TABLE BOOKS(
	 ID INT PRIMARY KEY IDENTITY,
	 title VARCHAR(30) NOT NULL,
	 descr VARCHAR(100) NOT NULL,
	 userId INT 
)
GO

CREATE TABLE RESERVATIONS(
	ID INT PRIMARY KEY IDENTITY,
	userId INT,
	bookId INT
)
GO

CREATE TABLE USERS(
	ID INT PRIMARY KEY IDENTITY,
	email VARCHAR(50) NOT NULL,
	pwd VARCHAR(50) NOT NULL,
)
GO

ALTER TABLE BOOKS ADD CONSTRAINT FK_USER_BOOK
FOREIGN KEY(userId) REFERENCES USERS(ID)
GO

ALTER TABLE RESERVATIONS ADD CONSTRAINT FK_USER_REVERSATION
FOREIGN KEY(userId) REFERENCES USERS(ID)
GO

ALTER TABLE RESERVATIONS ADD CONSTRAINT FK_BOOK_RESERVATION
FOREIGN KEY(bookId) REFERENCES BOOKS(ID)
GO

ALTER TABLE BOOKS
DROP CONSTRAINT FK_USER_BOOK;
GO

ALTER TABLE RESERVATIONS
DROP CONSTRAINT FK_USER_REVERSATION;
GO

ALTER TABLE RESERVATIONS
DROP CONSTRAINT FK_BOOK_RESERVATION;
GO


DROP TABLE BOOKS
DROP TABLE USERS
DROP TABLE RESERVATIONS

/* Criar um conjunto de tabelas para uso */

INSERT INTO USERS VALUES('henriquemauler@fakemail.com','123456789')
INSERT INTO USERS VALUES('pamela@fakemail.com','123456789')
INSERT INTO USERS VALUES('gustavo@fakemail.com','123456789')
GO

INSERT INTO BOOKS VALUES('Knowing yorself','This is a book that make you know about yourself better',1)
INSERT INTO BOOKS VALUES('The narnia Chronics','This is a book that will teach you about a imaginary space',1)
INSERT INTO BOOKS VALUES('The homo Sapiens story','The history of homo sapiens is good',2)
INSERT INTO BOOKS VALUES('Homo Deus','The homo Deus content',2)
INSERT INTO BOOKS VALUES('Discovering linux','This is an book for discovering the linux',3)
GO

/* Deletando o campo  api_delete_owner_book */
SELECT * FROM BOOKS
DELETE FROM BOOKS WHERE BOOKS.ID = 1
GO

 /* Editando o campo api_edit_owner_book */
 UPDATE BOOKS SET BOOKS.title = 'Modificado', BOOKS.descr = 'Alguma descrição provinda de uma modificação'
 WHERE BOOKS.ID = 2
GO

/* Devolvendo livros reservados choose_book */
/* Checando se o usuário já fez alguma reserva */
SELECT COUNT(*) FROM RESERVATIONS WHERE RESERVATIONS.userId = 1
GO

/* Não pode existir mais de uma reserva, um usuário só pode reservar um livro por vez, supondo que não tenha reserva */
INSERT INTO RESERVATIONS VALUES(1,2)
SELECT * FROM RESERVATIONS
GO

/* Procurar os livros reservados do usuário search_reserved_book_user */
SELECT * FROM BOOKS WHERE ID IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.userId = 1)

