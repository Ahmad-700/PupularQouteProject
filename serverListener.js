//const { send } = require('process');
const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const { /*checkApiRequest,*/ forward, consoleRequest } = require("./serverMiddleware");
const {
	quotes,
	getQuotesBaseOn,
	isValidLoginAccount,
	isValidRegisterAccount,
	addNewAccount,
	getUserQuotes,
	Add$RemoveLike,
	getUserLikedQuotes,
	getRandQuoteId,
	addNewQuote,
	deleteQuote,
	isThereSameQuote,
	isOwnQuote,
} = require("./serverFunctions");
// const { redirect } = require("express/lib/response");

app.use(express.static("./public"));
app.use(forward);
app.use(consoleRequest);
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
app.use(
	session({
		secret: "z.,Cxnv234slkjfowrie^*^%(ufdhisfy&^&^DT&*^DtSfAHK",
		resave: true,
		saveUninitialized: true,
	})
);
// todo
// app.use('/api', (req, res, next) => {
// 	console.log('url contain /api ?')
// 	next();
// })

app.get("/home", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, "./HTML/Home.html"));
});

app.get("/about", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, "./HTML/About.html"));
});

app.get("/myQuotes", (req, res) => {
	console.log(req.session);
	if (req.session.loggedin) res.sendFile(path.resolve(__dirname, "./HTML/MyQoutes.html"));
	else res.sendFile(path.resolve(__dirname, "./HTML/AlertLoginFirst.html"));
});

app.get("/register", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, "./HTML/Register.html"));
});

app.get("/login", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, "./HTML/Login.html"));
});

app.post("/api/login", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	try {
		let valid$msg = await isValidLoginAccount(username, password);
		console.log("valid$msg:", valid$msg);
		if (valid$msg == true) {
			// console.log("loggedin:", valid$msg);
			req.session.loggedin = true;
			req.session.username = username;
			res.status(200).json({ success: true });
		} else res.status(200).json({ success: false, msg: valid$msg });
	} catch (e) {
		console.log("error :", e);
		res.status(200).json({ success: false, error: e.toString(), msg: "Something Went Wrong!" });
	}
});

app.post("/api/register", (req, res) => {
	if (req.session.loggedin == true) {
		req.session.loggedin = false;
		req.session.username = undefined;
	}
	let userInfo = {
		username: req.body.username.toString().trim(),
		email: req.body.email.toString().trim(),
		password: req.body.password,
	};

	addNewAccount(userInfo)
		.then(() => {
			console.log("added new User; ", userInfo);
			req.session.loggedin = true;
			req.session.username = userInfo.username;
			res.json({ success: true });
		})
		.catch((e) => {
			console.log("e is : ", e);
			if (e.msg) {
				res.json({ success: false, msg: e.msg, error: e });
			} else
				res.status(500, { error: e }).json({
					success: false,
					msg: `Something Went Wrong! When Creating The Account`,
					error: e,
				});
		});
});

app.post("/api/myQuotes/delete", (req, res) => {
	if (req.session.loggedin) {
		let id = Number(req.body.id);

		deleteQuote(req.session.username, id)
			.then(() => res.json({ success: true }))
			.catch((e) => {
				if (e.msg) res.json({ success: false, msg: e.msg, error: e });
				else
					res.json({
						success: false,
						msg: `Something Went Wrong! When Deleting The Quote. Try <span onclick='location.reload()'>Reload</span>`,
						error: e,
					});
			});
	} else res.json({ success: false, msg: `You Can't Delete a Quote When You Are Not Login!` });
});

app.get("/api/myQuotes", (req, res) => {
	//get user quotes and likedQuotes
	if (req.session.loggedin) {
		let username = req.session.username;
		//we want data from two promises. So, we used [{(< Promise.all >])} function to do that in array fashion.
		Promise.all([getUserQuotes(username, req.query.orderBy), getUserLikedQuotes(username)])
			.then((arr) => {
				// console.log("arr: ", arr);
				res.json({ success: true, quotes: arr[0], likedQuotes: arr[1] });
			})
			.catch((e) =>
				res.status(500, { error: e }).json({
					success: false,
					msg: "Something Went Wrong! When Retrieving Your Data. Try Reload The Page",
					error: e,
				})
			);
	} else res.json({ success: false, msg: "You Have To Login..." });
});

app.post("/api/like", (req, res) => {
	//user submit/remove like
	if (req.session.loggedin) {
		console.log("req.body:", req.body);
		let quoteLikedId = Number(req.body.quoteId);
		let state = req.body.state;
		Add$RemoveLike(quoteLikedId, state, req.session.username)
			.then((feedback) => res.json({ success: true }))
			.catch((e) =>
				res.status(500, { error: e }).json({
					success: false,
					msg: `Something Went Wrong! When Submit/Remove Like...`,
					error: e,
				})
			);

		// let suc$msg = Add$RemoveLike(quoteLikedId, state, req.session.username);
		// if (suc$msg == true) res.json({ success: true });
		// else res.json({ success: false, msg: suc$msg });
	} else res.json({ success: false, msg: "user not logged in." });
});

app.get("/api/like", (req, res) => {
	//get user likedQuotes. used in /home html
	if (req.session.loggedin) {
		getUserLikedQuotes(req.session.username)
			.then((userLikedQuotes) => res.json({ success: true, likedQuotes: userLikedQuotes }))
			.catch((e) =>
				res
					.status(500, { error: e })
					.json({ success: false, msg: "Something Went Wrong! When Retrieving Your Liked Quotes" })
			);
	} else res.json({ success: false, msg: "user not loggedin" });
});

app.post("/api/myQuotes/newQuote", (req, res) => {
	if (req.session.loggedin) {
		let newQuote = {
			writtenBy: req.session.username,
			message: req.body.message.toString().trim(),
			author: req.body.author.toString().trim(),
			id: getRandQuoteId(),
		};
		if (req.body.date) newQuote.date = new Date(req.body.date);
		addNewQuote(newQuote)
			.then((n) => res.json({ success: true, newQuote: n }))
			.catch((e) => {
				if (e.msg) {
					console.log("error: ", e.msg);
					res.json({ success: false, msg: e.msg, error: e });
				} else
					res.json({
						success: false,
						msg: `Something Went Wrong! When Adding New Quote...`,
						error: e,
					});
			});
	} else res.json({ success: false, msg: `You are not logged in!` });
});

app.get("/test", (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, "./HTML/test.html"));
});

app.get("/api/pageNum/:num", (req, res) => {
	var page = req.params.num;
	var sortBy = req.query.orderBy;
	console.log("page", page, " orderBy", sortBy);
	getQuotesBaseOn(sortBy, page)
		.then((result) => res.json({ success: true, data: result }))
		.catch((e) => {
			console.log("server catch an error! ", e);
			res
				.status(500, { error: e })
				.json({ success: false, msg: `Something Went Wrong! When Retrieving Data...` });
		});
});

app.get("/api/search", (req, res) => {
	let search = req.query.search;
	let sortBy = req.query.orderBy;
	let pageNum = req.query.pageNum;
	console.log("search:", search, " SortBy:", sortBy, " PageNum:", pageNum);

	getQuotesBaseOn(sortBy, pageNum, search)
		.then((result) => res.json({ success: true, data: result }))
		.catch((e) => {
			console.log("this is a catch error:", e);
			res
				.status(500, { error: e })
				.json({ success: false, error: e, msg: "Something Went Wrong! When Retrieving Data..." });
		});
	// if (respond) res.json({ success: true, data: respond });
	// else res.json({ success: false, msg: "quotesArr for some reason is undefined!" });
});

app.post("/logout", (req, res) => {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		// res.redirect('/login');//can't forward when posting...
		res.json({ success: true });
	} else res.json({ success: false, msg: `You already logged out!` });
});

app.get("/api/isLoggedin", (req, res) => {
	res.json({ success: true, isLoggedin: req.session.loggedin });
});

app.all("*", (req, res) => res.status(404).send(`No such "${req.url}" Page or Resource!`));
//if (checkData())

app.listen(55555,'192.168.1.134', () => {
	console.log("Listening...");
});
