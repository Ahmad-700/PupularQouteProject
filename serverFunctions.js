const { query } = require("express");
const {
	quotes,
	accounts,
	isPageNotFarAway,
	isOrderByValid,
	saveQuotes,
	saveAccounts,
	getUserObjByName,
	getRandQuoteId,
	getRandAccountId,
	getRandSalt,
	hash,
	getQuoteObjById,
	deleteLikedFromAllUsers,
	db,
	getLoginData,
	SQLingOrderBy,
} = require("./serverFunctions2.js");

/**
 * @promise
 * @param {string} sortBy one of predefine sortBys string.
 * @param {number} pageNum number of the page to return sub of all array and page long is constant number.
 * @param {string} searchText is the text in search textBox in client side.
 * @returns {quote[]} sorted quotes that found base on previous attrs. Or error text if page is far away.
 */
function getQuotesBaseOn(sortBy, pageNum, searchText) {
	return new Promise((resolve, reject) => {
		if (!sortBy) sortBy = "orderByWrittenDate";
		if (!isOrderByValid(sortBy)) {
			console.log("sortBy", sortBy);
			reject("Invalid OrderBy: " + sortBy);
			return;
		}
		if (!pageNum) {
			reject("Undefined PageNum!", pageNum);
			return;
		} else {
			try {
				pageNum = Number(pageNum);
				if (pageNum < 1) {
					reject(`Invalid PageNum! ${pageNum}`);
					return;
				}
			} catch (e) {
				reject(`Invalid PageNum! ${pageNum}`);
				return;
			}
		}
		if (!searchText) searchText = "";
		sortBy = SQLingOrderBy(sortBy); //convert ex:'orderByAlphaAZ' to ex:' ORDER BY text ASC '
		let sql = `SELECT ID as id,WrittenByUsername as writtenBy, Text as message, Author as author, Date as date, NumOfLikes as likes
		FROM QuoteView
		WHERE Text LIKE ${db.escape("%" + searchText + "%")} 
		${sortBy}
		LIMIT ${(pageNum - 1) * 5},5 ;`;
		// console.log('sql command:', sql);
		db.query(sql, (err, result) => (err ? reject(err) : resolve(result)));
	});
}

/**
 * @async
 * @param {String} username
 * @param {String} password
 * @returns true if user can login or error msg if invalid login
 */
async function isValidLoginAccount(username, password) {
	if (!username) return `Please Enter Your Username`;
	if (!password) return `Please Enter Your Password`;
	try {
		let [result] = await getLoginData(username);
		console.log("result", result);
		console.log("username", username);
		if (typeof result == "object") {
			if (result.Password === hash(password + result.Salt)) return true;
			else return `Password Mismatch!`;
		} else return `No Such Username! You Can <a href='/register'>Register Now.</a>`;
	} catch (e) {
		console.log("error:", e);
		return "Something Went Wrong! When getting user data to validate login info";
	}
}

/**
 * @param {UserObj} user object that client sended with poor attributes(username, email, password)
 * @returns {UserObj} user with rich attributes and have been crypt the password
 */
function addNewAccount(userInfo) {
	return new Promise((resolve, reject) => {
		let username = userInfo.username,
			email = userInfo.email,
			password = userInfo.password;
		console.log("addNewAccount username", username, " email:", email, " password", password);
		if (!username || !password || !email) {
			reject({ msg: `Username, password or email is Undefined!` });
			return;
		}
		if (username.length < 3) {
			reject({ msg: `Username Should Have at Least 3 Characters!` });
			return;
		}
		if (email.indexOf("@") == -1 || email.indexOf(" ") != -1) {
			reject({ msg: `Invalid Email!` });
			return;
		}
		if (password.length < 3) {
			reject({ msg: `Password is Very Short!` });
			return;
		}

		let salt = getRandSalt();
		let sql = `INSERT INTO Account(Username,Email,Password,Salt)
		VALUES(?
		,?
		,?
		,?
		);`;
		db.query(sql, [username, email, hash(password + salt), salt], (err, result) => {
			if (err)
				if (err.sqlMessage.indexOf("account.UQ_Account_Username") != -1) {
					err.msg = `There is an Account With Same Username. You can <a href='/login'>Login Now.</a>`;
					reject(err);
				} else if (err.sqlMessage.indexOf("account.UQ_Account_Email") != -1) {
					err.msg = `There is an Account With Same Email!`;
					reject(err);
				} else {
					console.log("err is :", err);
					reject(err);
				}
			else resolve();
		});
	});
}

/**
 * @promise
 * @param {String} username
 * @param {String} sortBy there are predefined set of sort methods
 * @todo use sortBy to show quotes for user in sorted way.
 * @returns {quotes[]} array of quotes object.
 */
function getUserQuotes(username, sortBy) {
	return new Promise((resolve, reject) => {
		if (!username) {
			reject(`Undefined Username!`);
			return;
		}
		if (!sortBy)
			//we don't need a variable for orderBy in myQuotes but maybe we'll use it in future :\
			sortBy = "orderByWrittenDate";
		let sql = `SELECT ID as id,WrittenByUsername as writtenBy, Text as message, Author as author, Date as date, NumOfLikes as likes
		FROM QuoteView where WrittenByUsername = ${db.escape(username)} 
		${SQLingOrderBy(sortBy)};`;
		// console.log("SQL command", sql);
		db.query(sql, (err, result) => (err ? reject(err) : resolve(result)));
	});
	let quotesId;
	for (let a of accounts)
		if (a.username == username) {
			quotesId = a.quotes;
		}
	if (!quotesId) {
		console.log(
			"Error: getUserQuotes(",
			username,
			")return null : no user with such a name:",
			username
		);
		return null;
	}
	let userQuotes = []; //to put new quote in begging
	for (let q of quotes) for (let id of quotesId) if (id == q.id) userQuotes.push(q);
	for (let i = 0; i < userQuotes.length; i++)
		for (let j = i; j < userQuotes.length; j++)
			if (userQuotes[j].writtenBy) {
				let temp = userQuotes[i];
				userQuotes[i] = userQuotes[j];
				userQuotes[j] = temp;
			}
	return userQuotes; //, likedQuotes };
}

/**
 * @promise
 * @param {String} username
 * @returns {Number[]} Array of user's liked Quotes' id
 */
function getUserLikedQuotes(username) {
	return new Promise((resolve, reject) => {
		if (!username) {
			reject(`Undefined Username!`);
			return;
		}
		let sql = `SELECT (Liked.QuoteID) FROM Liked
		join Quote on Quote.ID = Liked.QuoteID
		group by Liked.AccountID,Liked.QuoteID, Quote.isDeleted
		having Liked.AccountID = (SELECT (Account.ID) FROM Account WHERE Account.Username =?)
		and (Quote.isDeleted = 0);`;
		db.query(sql, [username], (err, result) =>
			err ? reject(err) : resolve(result.map((obj) => obj.QuoteID))
		);
	});
}

/**
 * @promise
 * @param {Number} id of the quote that liked or remove like from.
 * @param {String} state is wither 'add' or 'remove' like of a quote. Used to specify the functionality
 * @param {String} username is name of the user to add or remove like from his/her list.
 * @returns true if successfully liked added or removed. Or error message if something went wrong
 */
function Add$RemoveLike(id, state, username) {
	return new Promise((resolve, reject) => {
		if (!id) {
			reject(`Quote ID is Undefined!`);
			return;
		}
		if (!state || !(state === "add" || state === "remove")) {
			reject(`State of add$remove is NOT 'add' Either 'remove'! It's ${state}`);
			return;
		}
		if (!username) {
			reject(`Username is Undefined!`);
			return;
		}

		if (state.toLowerCase() === "add") {
			let sql = `INSERT INTO Liked(AccountId,QuoteId) VALUES(
				(SELECT (Account.ID) FROM Account WHERE Account.Username = ${db.escape(username)}),
				${db.escape(id)});`;
			db.query(sql, (err, result) => (err ? reject(err) : resolve(result)));
		} else if (state.toLowerCase() === "remove") {
			let sql = `DELETE FROM Liked
			WHERE Liked.AccountID = (SELECT (ID) FROM Account WHERE Account.Username = ?)
				AND Liked.QuoteID = ?;`;
			db.query(sql, [username, id], (err, result) => (err ? reject(err) : resolve(result)));
		} else reject("Unhandled error :(  How the hell is that escaped!");
	});
}

/**
 * Take an object and validate its attribute then add more attribute then save it in the DB
 * @promise
 * @param {Quote} newQuote is quote object with limited attribute comes from client-side
 * @return in then() function a para quote object that have all its data
 */
function addNewQuote(n) {
	return new Promise((resolve, reject) => {
		if (!n.writtenBy) {
			reject({ msg: `Username is Undefined!` });
			return;
		}
		if (!n.message) {
			reject({ msg: `Text is Undefined!` });
			return;
		}
		if (!n.author) {
			reject({ msg: `Author is Undefined!` });
			return;
		}
		if (!n.id || typeof n.id != "number" || n.id > 2147483647 || n.id < -2147483647) {
			reject({ msg: `Invalid ID For The New Quote; ${n.id}` });
			return;
		}
		n.likes = 0;
		if (n.date) {
			n.date = new Date(n.date);
			n.date =
				n.date.getFullYear() + "-" + (1 + Number(n.date.getMonth())) + "-" + n.date.getDate();
		}

		// db.query(`select count(*) from Quote where text =?;`, [n.message], (err, result) => {
		// if (err) throw err;
		// console.log("isThereSameQuote count()==", result[0]["count(*)"]);
		// if (result[0]["count(*)"] == 0) {
		let sql = `INSERT INTO Quote(ID,WrittenBy,Text,Author ${n.date ? ",Date" : ""})
							VALUES (
							?,
							(SELECT (Account.ID) FROM Account WHERE Account.Username = ?),
							?,? ${n.date ? "," + db.escape(n.date) : ""});`;
		console.log("command: ", sql);
		db.query(sql, [n.id, n.writtenBy, n.message, n.author], (err, result) => {
			if (err)
				if (err.sqlMessage)
					if (err.sqlMessage.indexOf("quote.UQ_Quote_Text") != -1) {
						err.msg = `There is a Quote With Same Text! Please Write New Quote`;
						reject(err);
					} else if (err.sqlMessage.indexOf("Column 'WrittenBy' cannot be null")!=-1) {
						err.msg = `We Can't Find an Account With Username: ${n.writtenBy}! Please Try Reload The Page`;
						err.myMsg = `account is not found in the database. username is getting by a session when logged in`
						reject(err);
					} else if (err.sqlMessage.indexOf("quote.PRIMARY")!=-1) {
						err.msg = `Something Went Wrong! Please Try Again`
						err.myMsg = `There is a quote with same random ID!!`
						reject(err);
					} else reject(err);
				else reject(err);
			else {
				console.log("Quote Was Added Successfully!");
				resolve(n);
			}
		});
		// } else resolve(`There is a Quote With Same Text! Please Write New Quote`); //resolve because we want to send this text to the client
		// });
	});
}

/**
 * quote will deleted iff username own the quote otherwise an error will trigger
 * @promise
 * @param {String} username is who own the quote
 * @param {Number} id is quote id to delete it
 */
function deleteQuote(username, id) {
	return new Promise((resolve, reject) => {
		id = Number(id);
		if (!id || !username) {
			reject({ msg: `Username, password or email is Undefined!` });
			return;
		}

		db.query(
			`UPDATE Quote SET Quote.isDeleted = 1 WHERE Quote.ID =(SELECT ID FROM QuoteView
		WHERE WrittenByUsername = ?
		and id = ?);`,
			[username, id],
			(err, result) => {
				if (err)
					if (err.sqlMessage.indexOf("0 row(s)") != -1) {
						err.msg = `Something Went Wrong! No Quote Was Affected`;
						reject(err);
					} else {
						console.log("err is :", err);
						reject(err);
					}
				else resolve(`Quote Deleted Successfully!`);
			}
		);
	});
}

module.exports = {
	quotes,
	getQuotesBaseOn,
	isValidLoginAccount,
	addNewAccount,
	getUserQuotes,
	Add$RemoveLike,
	getUserLikedQuotes,
	getRandQuoteId,
	addNewQuote,
	deleteQuote,

	//Middleware
	isPageNotFarAway,
	isOrderByValid,
};
