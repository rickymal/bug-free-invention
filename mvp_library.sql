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




/* Fazendo a reserva do livros choose_book */
 
DROP PROCEDURE RESERVE_BOOK
GO
CREATE PROCEDURE RESERVE_BOOK @userId INT, @bookId INT
AS
DECLARE @VAR1 INT
 
	SELECT @VAR1 = COUNT(*) FROM RESERVATIONS WHERE RESERVATIONS.userId = @userId

	IF @VAR1 = 0
	BEGIN
		INSERT INTO RESERVATIONS VALUES(@userId,@bookId)
		SELECT * FROM RESERVATIONS
	END

	IF @VAR1 > 0
	BEGIN
		PRINT 'Uma reserva já foi feita?'
	END
GO


EXEC RESERVE_BOOK @userId = 1, @bookId = 2
GO


/* Procurar os livros reservados do usuário search_reserved_book_user */
SELECT * FROM BOOKS WHERE ID IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.userId = 1)

/* Procura todos os livros de um determinado usuário search_owner_book_user */
SELECT * FROM BOOKS WHERE ID = 2

/* Inserindo um novo usuário register */
INSERT INTO USERS VALUES('novo_usuario@fakemail.com','123456789')

/* Fazendo o login login */ 
SELECT * FROM USERS 
WHERE USERS.email = 'henriquemauler@fakemail.com' and USERS.pwd = '123456789'

/* Busca todas as reservas api_books*/ 
SELECT * FROM RESERVATIONS
SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.bookId is not null
SELECT * FROM BOOKS WHERE BOOKS.ID NOT IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.bookId is not null) AND BOOKS.userId != 2




DROP PROCEDURE DEVOLVE_BOOK
GO


/* Devolvendo livro reservado api_devolve_reserved_book */
CREATE PROCEDURE DEVOLVE_BOOK @bookId INT, @userId INT
AS
	DECLARE @userSource INT;
	
	SELECT @userSource = RESERVATIONS.userId FROM RESERVATIONS
	INNER JOIN BOOKS ON BOOKS.userId = RESERVATIONS.userId
	WHERE RESERVATIONS.bookId = @bookId


	IF @userSource != @userId
	BEGIN
		RAISERROR('O livro em questão não pertence ao usuário',-1,-1)
	END

	
	PRINT 'VALOR DO USER SOURCE 1'
		
	IF ISNULL(COUNT(@userSource),0) != 0
	BEGIN
		DELETE FROM RESERVATIONS WHERE RESERVATIONS.bookId = @bookId
	END

	PRINT 'VALOR DO USER SOURCE 2'

	IF ISNULL(COUNT(@userSource),0) = 0
	BEGIN
		RAISERROR('O livro em questão já foi devolvio, ou não existe',-1,-1)
	END

	PRINT 'VALOR DO USER SOURCE 3'
GO

EXEC DEVOLVE_BOOK @bookId = 2, @userId = 1
GO



/* api_request_reserved_books */
SELECT * FROM BOOKS WHERE ID NOT IN (SELECT bookId FROM RESERVATIONS WHERE RESERVATIONS.userId = 2)


/* Campo para adicionar um livro (título) api_add_title */
INSERT INTO BOOKS VALUES('Um título','Com alguma descrição nova',3)

