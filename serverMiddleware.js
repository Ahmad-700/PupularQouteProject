const { redirect } = require("express/lib/response");
const { isPageNotFarAway, quotes, isOrderByValid } = require("./serverFunctions");

// function checkApiRequest(req, res, next) {
	// let search = req.query.search;
	// let sortBy = req.query.orderBy;
	// if (!sortBy || !isOrderByValid(sortBy))
	// 	res.json({ success: false, msg: "Request should have an orderBy att!" });
	// let pageNum = req.query.pageNum;
	// if (!pageNum)
	// 		res.json({ success: false, msg: `requested page is far away!` });
	// if (req.url.indexOf("/api/search") != -1) {
	// 	if (!pageNum) {
	// 		req.query.pageNum = 1;
	// 		pageNum = 1;
	// 	}
	// 	if (!search) {
	// 		console.log(`/api/search?search=${search} -> /api/pageNum/${pageNum}`);
	// 		res.redirect("/api/pageNum/" + pageNum + "?orderBy=" + sortBy);
	// 		return;
	// 	}
	// 	next();
	// 	//===============================================================
	// } else if (req.url.indexOf(`/api/pageNum/`) != -1) {
	// 	var page = Number(req.params.num);
	// 	if (!page)
	// 		res.json({ success: false, msg: "page number is not recognized! pageNum:" + req.params.num });
	// 	else if (!isPageNotFarAway(page, quotes.length))
	// 		res.json({ success: false, msg: `requested page is far away!` });
	// 	else next();
	// 	//===============================================================
	// } else {
	// 	console.log(`request couldn't pass checkApiRequest. request:${JSON.stringify(req.query)}`);
	// 	res.json({
	// 		success: false,
	// 		msg:
	// 			"checkApiRequest stopped this request because an error in your request:" +
	// 			JSON.stringify(req.query),
	// 	});
	// }
// }

function consoleRequest(req, res, next) {
	console.log("Request:",req.method, req.url);
	next();
}

function forward(req, res, next) {
	switch (req.url.toLowerCase()) {
		case "/":
			res.redirect("/home");
			break;
		case "/home.html":
			console.log("from '" + req.url + "' redirected to '/home'");
			res.redirect("/home");
			break;

		case "/myquotes.html":
			res.redirect("/myQuotes");
			break;
		case "/myqoutes.html":
			res.redirect("/myQuotes");
			break;
			case "/html/myqoutes.html":
				res.redirect("/myQuotes");
				break;
		case "/myqoutes":
			res.redirect("/myQuotes");
			break;

		case "/login.html":
			console.log("from '" + req.url + "' redirected to '/account/login'");
			res.redirect("/login");
			break;
		
		case "/register.html":
			res.redirect("/register");
			break;
		// case "/account/register.html":
		// 	res.redirect("/register");
		// 	break;

		case "/about.html":
			res.redirect("/about");
			break;

		default:
			next();
	}
}

module.exports = { /*checkApiRequest,*/ forward, consoleRequest };
