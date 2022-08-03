const fs = require("fs");
const crypto = require("crypto");
//[{"message":"he","auth":"au"},{"message":"mess","auth":"autg"}]

// const json = [
// 	{
// 		message: "hi from server",
// 		author: "Admin",
// 		date: new Date(),
// 		likes: 32,
// 		id: 32198543,
// 	},
// 	{
// 		message: "aaaaaaaaaaa",
// 		author: "test",
// 		date: new Date("1965-2-25"),
// 		likes: 2332,
// 		id: 1111587,
// 	},
// 	{
// 		message: "zzzzzzz",
// 		author: "test",
// 		date: new Date("1965-2-25"),
// 		likes: 1234,
// 		id: 18987,
// 	},
// 	{
// 		message: "likes",
// 		author: "test",
// 		date: new Date("1965-2-25"),
// 		likes: 999999,
// 		id: 16877674,
// 	},
// 	{
// 		message: "likes negative",
// 		author: "test",
// 		date: new Date("1965-2-25"),
// 		likes: -100,
// 		id: 113548720,
// 	},
// 	{
// 		message: "date old",
// 		author: "test",
// 		date: new Date("988-2-25"),
// 		likes: 1234,
// 		id: 35687852,
// 	},
// 	{
// 		message: "date in future",
// 		author: "test",
// 		date: new Date("2022-1-30"),
// 		likes: 1234,
// 		id: 99784541,
// 	},
// 	{
// 		message: "So many books, so little time.",
// 		author: "Frank Zappa",
// 		date: new Date("1912-9-13"),
// 		likes: 8952,
// 		id: 13543472,
// 	},
// 	{
// 		message: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
// 		author: "Mahatma Gandhi",
// 		date: new Date("1902-7-14"),
// 		likes: 9852,
// 		id: 675564,
// 	},
// 	{
// 		message: "Make it as simple as possible, but not simpler.",
// 		author: "Albert Einstein",
// 		date: new Date("1965-6-4"),
// 		likes: 15814,
// 		id: 345234,
// 	},
// 	{
// 		message:
// 			"Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
// 		author: "Albert Einstein",
// 		date: new Date("1968-4-20"),
// 		likes: 42000,
// 		id: 314143,
// 	},
// 	{
// 		message: "Be the change that you wish to see in the world.",
// 		author: "Mahatma Gandhi",
// 		date: new Date("1909-11-20"),
// 		likes: 6942,
// 		id: 234523,
// 	},
// 	{
// 		message: "If you tell the truth, you don't have to remember anything.",
// 		author: "Mark Twain",
// 		date: new Date("1985-8-2"),
// 		likes: 3240,
// 		id: 6484657,
// 	},
// 	{
// 		message:
// 			"I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
// 		author: "Maya Angelou",
// 		date: new Date("2005-1-29"),
// 		likes: 2157,
// 		id: 467465,
// 	},
// 	{
// 		message: "A friend is someone who knows all about you and still loves you.",
// 		author: "Elbert Hubbard",
// 		date: new Date("2012-5-11"),
// 		likes: 1057,
// 		id: 866457,
// 	},
// 	{
// 		message: "The way to get started is to quit talking and begin doing.",
// 		author: "Walt Disney",
// 		date: new Date("1996-6-24"),
// 		likes: 3625,
// 		id: 5198748,
// 	},
// 	{
// 		message:
// 			"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
// 		author: "Steve Jobs",
// 		date: new Date("1992-11-13"),
// 		likes: 9350,
// 		id: 6548884,
// 	},
// 	{
// 		message: "If life were predictable it would cease to be life, and be without flavor.",
// 		author: "Eleanor Roosevelt",
// 		date: new Date("1852-4-7"),
// 		likes: 22647,
// 		id: 4684215,
// 	},
// 	{
// 		message:
// 			"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
// 		author: "Oprah Winfrey",
// 		date: new Date("2002-6-26"),
// 		likes: 1526,
// 		id: 165489,
// 	},
// 	{
// 		message:
// 			"If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
// 		author: "James Cameron",
// 		date: new Date("2001-9-17"),
// 		likes: 11549,
// 		id: 684984,
// 	},
// 	{
// 		message: "Life is what happens when you're busy making other plans.",
// 		author: "John Lennon",
// 		date: new Date("1965-2-25"),
// 		likes: 1483,
// 		id: 6484655,
// 	},
// ];

//TABLE ACCOUNTS
//ID
//Username
//Password todo password never save as it.
//Email
//quotes		:arr of quotes ids
//likedQuotes   :arr of quotes ids

//TABLE QUOTES
//ID
//Text
//Author
//Date         :date when it said
//NumOfLikes   :derived from users submit likes
//WrittenBy    :username
//writtenDate  :date when user write it

// const users = [
// 	{
// 		id: 1,
// 		username: "Ahmad",
// 		email: "Ahmad.alkaf-11@gmail.com",
// 		password: "12345678",
// 		quotes: [684984, 345234, 675564],
// 		likedQuotes:[]
// 	},{
// 		id: 2,
// 		username: "a",
// 		email: "a@gmail.com",
// 		password: "a",
// 		quotes: [165489, 4684215, 6548884, 5198748, 6484657, 234523, 13543472],
// 		likedQuotes:[165489]
// 	},{
// 		id: 3,
// 		username: "b",
// 		email: "b@gmail.com",
// 		password: "b",
// 		quotes: [866457, 467465, 314143],
// 		likedQuotes:[]
// 	},{
// 		id: 4,
// 		username: "f",
// 		email: "f@gmail.com",
// 		password: "f",
// 		quotes: [],
// 		likedQuotes:[]
// 	},{
// 		id: 5,
// 		username: "s",
// 		email: "s@gmail.com",
// 		password: "s",
// 		quotes:[99784541,35687852,113548720,16877674,18987,1111587,32198543],  //this is quotes for testing
// 		likedQuotes:[]
// 	},{
// 		id: 6,
// 		username: "d",
// 		email: "d@gmail.com",
// 		password: "d",
// 		quotes: [6484655],
// 		likedQuotes:[]
// 	}
// ];
// console.log("length:", users.length);
// fs.writeFileSync("dataAccounts.txt", JSON.stringify(users), "utf8");

// const speedy = require("speedy");
// speedy.run({
//     sameCon: function () {

//     },
//     reCon: function () {

//     }
// });

// async function getUserQuotes(username) {
// 	return new Promise((resolve, reject) => {
// 		let myQuery = `SELECT * FROM QuoteView WHERE WrittenByUsername = ?`;
// 		connection.query(myQuery, [username], (err, result) => {
// 			if (err) reject(err);
// 			else resolve(result);
//         });
//         connection.end();
// 	});
// }
// async function getUserQuotes(username) { //work but unhandled by express because it is promise
//     let myQuery = `SELECT * FROM QuoteView WHERE WrittenByUsername = ?`;
//     let [rows] = await connection.promise().query(myQuery, [username]);
//     connection.end();
//     return rows;
// }

// app.get("/:username", (req, res) => {//working 100%
// 	const username = req.params.username;
//     console.log(username);
// 	let myQuery = `SELECT * FROM QuoteView WHERE WrittenByUsername = ?`;
// 	connection.query(myQuery, [username], (err, result) => {
// 		if (err) res.end(err);
//         else res.json(result);
//         console.log(result);
// 	});
// 	connection.end();

// });
// getUserQuotes(username)
// .then((r) => res.pipe(r))
// .catch((e) => res.end(e));

// app.get("/:username", (req, res) => {
//     const username = req.params.username;
//     start(res, username);
// });
const express = require("express");
const mysql = require("mysql2");
const { hash } = require("./serverFunctions2.js");
const app = express();

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "32185279",
	port: 2048,
	database: "PopularQuotes",
});
// let d = new Date();
// let id = Math.floor(Math.random()*2147483640)
// let sql = `INSERT INTO Quote(ID,WrittenBy,Text,Author,Date)
// VALUES (
// (FLOOR(RAND()*2147483640)),
// (SELECT (Account.ID) FROM Account WHERE Account.Username = 'a'),
// 'this is test4',
// 'Mr. AaA',
// ${db.escape(d.getFullYear()+'-'+(1+Number(d.getMonth())) + '-'+ d.getDate())}
// );`
// db.query(sql, (err, result) => {
// 	if (err) throw err;
// 	console.log('result:', result);
// 	console.log('id: ', result.insertId);
// 	console.log('resultSetHeader: ', result.ResultSetHeader);
// });

function submitLike(username, quoteId) {
	return new Promise((resolve, reject) => {
		if (!username) {
			reject("Invalid Username: "+username);
			return;
		}
		quoteId = Number(quoteId);
		if (!quoteId) {
			reject(`Invalid QuoteId: ${quoteId}`);
			return;
		}

		let sql = `INSERT INTO Liked(AccountId,QuoteId) VALUES((SELECT (Account.ID) FROM Account WHERE Account.Username = ?),?);`;
		db.query(sql, [username, quoteId], (err, result) => {
			// console.log("err:", err);
			if (err) reject(err);
			else resolve(`Submitted Successfully`);
		});
	});
}



	
app.get('/', (req, res) => {
	let username = req.query.username;
	let id = req.query.id;
	submitLike(username, id)
	.then((r) => res.json({success:true,msg:r}))
		.catch((e) => {
			console.log('error type is ', typeof e);
		if (e.code == "ER_DUP_ENTRY") res.json({success:false,error:e,msg:"You are already liked this quote!"});
		else if (e.sqlMessage == "Column 'AccountID' cannot be null") {
			res.json({ success: false, error: e, msg:`No Such Account With Username ${username}`});
		} else {
			res.json({ success:false,msg: "Something Went Wrong!", error: e });
		}
	});
});
	
app.listen(4444, () => console.log("listen on port: 4444"));
