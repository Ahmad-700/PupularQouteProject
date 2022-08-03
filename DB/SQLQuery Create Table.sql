create database PopularQuotes
use PopularQuotes;

CREATE TABLE Account(
ID int AUTO_INCREMENT NOT NULL,/*auto increment by one and start in one.*/
Username NVARCHAR(32) NOT NULL,/*nvarchar is unicode*/
Email VARCHAR(64) NOT NULL,/*varchar is ascii*/
CreateDate DATETIME(3) NOT NULL DEFAULT now(3) ,/*provide date and time with milliseconds. ex:2022-01-24 09:54:54.483*/
Password CHAR(44) NOT NULL,/*44 digits is sha-256 long(32 bytes) in base64.*/
Salt CHAR(64) NOT NULL,/*64 digits is salt long(44 bytes) in base64.*/
DoB DATE,
CONSTRAINT PK_Account_ID PRIMARY KEY (ID),
CONSTRAINT UQ_Account_Username UNIQUE(Username),
CONSTRAINT UQ_Account_Email UNIQUE(Email),
CONSTRAINT CH_Account_Password CHECK(character_length(password) = 44),
CONSTRAINT CH_Account_Salt CHECK(character_length(salt) = 64)
)
--DROP TABLE Account

CREATE TABLE Quote(
ID INT,/*server have to set this attribute randomly*/
WrittenBy INT NOT NULL,
WrittenDate DATETIME(3) NOT NULL DEFAULT now(3),
Text NVARCHAR(840) NOT NULL,/*for nonclustered index maximum length should be below 850 character(1700 bytes)*/
Author NVARCHAR(50) NOT NULL,
Date DATE,/*user enter date of a quote range(1000-1-1 to 9999-1-1)*/
/*NumOfLikes is obtain in QuoteView*/
isDeleted BOOLEAN DEFAULT (0) NOT NULL,
CONSTRAINT PK_Quote_ID PRIMARY KEY (ID),
CONSTRAINT FK_Quote_WrittenBy FOREIGN KEY(WrittenBy) REFERENCES Account(ID),
CONSTRAINT UQ_Quote_Text UNIQUE(Text)
)
--DROP TABLE Quote

CREATE TABLE Liked(
ID INT AUTO_INCREMENT,
LikedDate DATETIME(3) NOT NULL DEFAULT(now(3)),
AccountID INT not null,
QuoteID int not null,
CONSTRAINT PK_Liked_ID PRIMARY KEY (ID),
CONSTRAINT FK_Liked_AccountID FOREIGN KEY(AccountID) REFERENCES Account(ID),
CONSTRAINT FK_Liked_QuoteID FOREIGN KEY(QuoteID) REFERENCES Quote(ID),
CONSTRAINT UN_Liked_DuplicatedLike UNIQUE(AccountID, QuoteID)
)
--drop table Liked

CREATE VIEW QuoteView AS /*(ID, WrittenBy, Text, Author, Date)*/
SELECT ID, (select Username from Account where Account.ID = Quote.WrittenBy) as WrittenByUsername, WrittenDate, Text, Author, Date, (select count(Liked.AccountID) from Liked where liked.QuoteID = Quote.ID) as NumOfLikes
FROM Quote WHERE Quote.isDeleted = 0;
select * from QuoteView;
drop view QuoteView;
/*Add account
{"id":1,
"username":"Ahmad",
"email":"Ahmad.alkaf-11@gmail.com",
"password":"nbB84fl022Jf7jo0jTNT3vuEetvIHjplc2AFC60PQDg=",
"salt":"jnQSLWrP+4pcgFJr7oNoXE2T5+NY8bDthxN0q6z1E6lsfzyQ40vz9JRh8MHHuVEV",
"quotes":[684984,345234,675564],
"createdDate":1642750853798,
"likedQuotes":[49100016]}*/
INSERT INTO Account(Username,Email,Password,Salt)
VALUES('Ahmad'
,'Ahmad.alkaf-1@gmail.com'
,'nbB84fl022Jf7jo0jTNT3vuEetvIHjplc2AFC60PQDg='
,'jnQSLWrP+4pcgFJr7oNoXE2T5+NY8bDthxN0q6z1E6lsfzyQ40vz9JRh8MHHuVEV'
);
select * from Account;

/*Add Quote
{"id":16266839,
"writtenBy":"Ahmad",
"writtenDate":1642510062869,
"message":"first account with hash password make second quote",
"author":"Dr. First Hashed",
"date":946684800000,
"likes":0,
}*/
INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
VALUES (
16266839, /*quote id*/
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Ahmad'),/*username (Account.ID)*/
'First account with hashed password make second quote',/*message*/
'Dr. First Hashed',/*author*/
FROM_UNIXTIME(0.001 * 1643112714748)/*date in milliseconds*/
);
select * from Quote;

/*Delete Quote*/
UPDATE Quote set Quote.isDeleted = 1
where Quote.ID = 16266839; /* quote id */


/*Sumbit Like*/
INSERT INTO Liked(AccountId,QuoteId) VALUES(
(SELECT (Account.ID) FROM Account WHERE Account.Username = 'Ahmad'),/*username*/
16266838 /*quote id*/
);
select * from Liked;

/*Remove Like*/
DELETE FROM Liked
WHERE Liked.AccountID = (SELECT (ID) FROM Account WHERE Account.Username = 'Ahmad2')
	AND Liked.QuoteID = 16266838;


/*getUserQuotes(req.session.username, req.query.orderBy);*/
select ID,WrittenByUsername, Text, Author, Date, NumOfLikes 
from QuoteView where WrittenByUsername = 'Ahmad' order by WrittenDate desc; /*username*/

/*getUserLikedQuotes(req.session.username)*/
SELECT (Liked.QuoteID) FROM Liked
join Quote on Quote.ID = Liked.QuoteID
group by Liked.AccountID,Liked.QuoteID, Quote.isDeleted
having Liked.AccountID = (SELECT (Account.ID) FROM Account WHERE Account.Username = 'Ahmad')/*username*/
and (Quote.isDeleted = 0);

/**
 * @param {UserObj} user used attributes(username, password)
 * @returns true if user can login or false if invalid login
 -- isValidLoginAccount(user)
 So to implement this function we need from database to return (password, salt) base on (username)
 */
 select Username, Password, Salt from Account
 where Account.Username = 'aHmaD';/*Username*/
 

/*search with any orderBy*/
select * from quoteview
where Text like '%%'/*change in server base on searchText*/
order by writtenDate desc /*change in server base on orderBy */
limit 0,5 ;




select * from quoteview
order by writtenDate desc 
