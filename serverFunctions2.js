const fs = require("fs");
const crypto = require("crypto");
const mysql = require("mysql");
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",//321...
	port: 2048,
	database: "PopularQuotes",
});
// const quotes = orderBy("orderByDateNewest", JSON.parse(fs.readFileSync("dataQuotes.txt", "utf8")));
/* quote = {
	id:35687852,
	message:"the talk is not talk is just speak!",
	author:"Mickle",
	likes:1234,
	date:1642780700000,
	writtenBy:"أمير العشاق",
	writtenDate:1642780752466
}
*/
// const accounts = JSON.parse(fs.readFileSync("dataAccounts.txt", "utf8"));
/* account = {
	username:"Mohsen2toto",
	email:"mohsen1419@gmail.com",
	password:"lGZPlYRGVgOERwmyT0RpsNPIJ+c273ofR8ITt7SvChY=",
	id:87541242,
	createdDate:1642750853798,
	salt:"5i0DDCZmOyQIGgOumi0xP6yYatsD385xVjR7/sYhjFrfnCMGL86Dt+nj/nR8dYiD",
	
	quotes:[76365361,49087129,1889283,50141088],
	likedQuotes:[76365361,49087129]
}
*/
const quotesPerPage = 5;

// function sort(array, fun) {
// 	//fun is function that take two parameter and return boolean
// 	var arr = [...array];
// 	for (let i = 0; i < arr.length; i++)
// 		for (let j = i; j < arr.length; j++)
// 			if (fun(arr[i], arr[j])) {
// 				let temp = arr[i];
// 				arr[i] = arr[j];
// 				arr[j] = temp;
// 			}
// 	return arr;
// }

// function orderBy(orderBy, q) {
// 	switch (orderBy) {
// 		case "orderByLikes":
// 			return sort(q, (a, b) => a.likes < b.likes);
// 		case "orderByAlphaAZ":
// 			return sort(q, (a, b) => a.message.toLowerCase() > b.message.toLowerCase());
// 		case "orderByAlphaZA":
// 			return sort(q, (a, b) => a.message.toLowerCase() < b.message.toLowerCase());
// 		case "orderByDateNewest":
// 			return sort(q, (a, b) => new Date(a.date) < new Date(b.date));
// 		case "orderByDateOldest":
// 			return sort(q, (a, b) => new Date(a.date) > new Date(b.date));
// 		default:
// 			console.log("error orderBy input:", orderBy);
// 	}
// }

// function isPageNotFarAway(pageNum, quotesLength) {
// 	return pageNum <= 1 + quotesLength / quotesPerPage;
// }

function isOrderByValid(sortBy) {
	switch (sortBy) {
		case "orderByLikes":
		case "orderByAlphaAZ":
		case "orderByAlphaZA":
		case "orderByDateNewest":
		case "orderByDateOldest":
		case "orderByWrittenDate":
			return true;
		default:
			return false;
	}
}

function SQLingOrderBy(sortBy) {
	switch (sortBy) {
		case 'orderByLikes': return " order by numOfLikes desc ";
		case 'orderByAlphaAZ': return " order by text asc ";
		case 'orderByAlphaZA': return " order by text desc ";
		case 'orderByDateNewest': return " order by Date desc ";
		case 'orderByDateOldest': return " order by Date asc ";
		case 'orderByWrittenDate': return " order by WrittenDate desc ";
		default: 				   return " order by WrittenDate desc ";
	}
}

// function saveAccounts() {
// 	fs.writeFile("dataAccounts.txt", JSON.stringify(accounts), "utf8", (err, result) => {
// 		if (err) console.log("saveAccounts: error:", err);
// 		else console.log("saveAccounts: saved successfully.");
// 	});
// }

// function saveQuotes() {
// 	fs.writeFile("dataQuotes.txt", JSON.stringify(quotes), "utf8", (err, res) => {
// 		if (err) console.log("saveQuotes: error:", err);
// 		else console.log("saveQuotes: saved successfully.");
// 	});
// }

// function getUserObjByName(username) {
// 	for (let a of accounts) if (a.username.toLowerCase() == username.toLowerCase()) return a;
// 	console.log("no such account with name:", username);
// 	return null;
// }

// function getRandAccountId() {
// 	let correctId;
// 	let id;
// 	do {
// 		id = Math.floor(Math.random() * 100000000);
// 		correctId = true;
// 		for (let a of accounts) if (a.id == id) correctId = false;
// 	} while (!correctId);
// 	return id;
// }

function getRandQuoteId() {
	return Math.floor(Math.random() * 2147483640);
}
/**
 *
 * @returns string base64 with 44 length. Save in database as the password.
 * @param message is (ClientPassword + dynamicSalt) that will be hashed with static salt by sha256 function
 */
function hash(message) {
	let salt = "z.,Cxnv234slkjfowrie^*^%(ufdhisfy&^&^DT&*^DtSf";
	return crypto
		.createHash("sha256")
		.update(message + salt)
		.digest("base64")
		.toString();
}

/**
 *
 * @returns random 64 length number with base64.
 * base64 use 6-bits to represent one digit and there is 384-bits generated randomly.
 * Then the result is 384/6 digits length i.e 64 digits.
 */
function getRandSalt() {
	return crypto.pseudoRandomBytes(48).toString("base64");
}

// function getQuoteObjById(quoteId) {
// 	for (let q of quotes) if (q.id == quoteId) return q;
// }

/**
 * @summary Delete the quote from all users liked quote list.
 * @argument Why? When we want to delete a quote and there are users have been liked this quote then we need to delete the quote from users liked quote list first then we delete the quote
 * @param {Number} id of the quote
 */
function deleteLikedFromAllUsers(id) {
	for (let a of accounts)
		for (let i = 0; i < a.likedQuotes.length; i++)
			if (id == a.likedQuotes[i]) 
				a.likedQuotes.splice(i, 1);		
}

function getLoginData(username) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT Username, Password, Salt FROM Account WHERE Account.Username =?;`;
		db.query(sql, [username], (err, result) => {
			console.log("err", err);
			if (err) reject(err);
			else resolve(result);
		});
	});
}
module.exports = {
	// quotes,
	// accounts,
	quotesPerPage,
	// orderBy,
	// isPageNotFarAway,
	isOrderByValid,
	// saveAccounts,
	// saveQuotes,
	// getUserObjByName,
	// getRandAccountId,
	getRandQuoteId,
	// sort,
	hash,
	getRandSalt,
	// getQuoteObjById,
	deleteLikedFromAllUsers,
	db,
	getLoginData,
	SQLingOrderBy
};
