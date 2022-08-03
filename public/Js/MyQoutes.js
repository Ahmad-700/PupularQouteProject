var coffee = "#caab7a"; //#caab7a   rgb(202, 168, 122)
var lightCoffee = "rgb(255, 228, 182)";
var sand = "rgb(253, 245, 230)";
var delQCache; //delete quote in cache is variable for confirmation delete btn know which quote to delete
var myQuotes;
var myLikedQuotes;
function setQuoteListener() {
	$(".svgD").mouseenter((e) => {
		$(e.currentTarget).children().css("fill", lightCoffee);
	});
	$(".svgD").mouseleave((e) => {
		$(e.currentTarget).children().css("fill", sand);
	});
	$(".svgD").click((e) => {
		$("#modalDiv").fadeIn("fast"); //show confirmation
		delQCache = Number($(e.currentTarget).parent().parent().parent().find("span.quoteId").text());
		//so if user confirm deleting then delete quote in delQCache
	});
	$(".svgD").mouse;
	for (let svg of document.getElementsByClassName("svg")) {
		//like button is <svg>
		svg.addEventListener("mouseover", svgHover);
		svg.addEventListener("mouseout", svgMouseOut);
		svg.addEventListener("click", svgClick);
	}
}

$(document).ready(pageLoaded);
function pageLoaded() {
	setInterval(() => {
		$.getJSON("/api/isLoggedin", (res) => {
			if (res.success) { 
				isLoggedin = res.isLoggedin || false; 
				if (!isLoggedin) showSnackBar(`Sorry, Server Logged You Out. Any Change Won't Save. Please Reload The Page or <a style="font-size:large;" href="/login">Login</a>`,7000);
			}
		});
	}, 5000);
	//get quotes------------
	console.log(`Request: getJSON("./api/myQuotes", {orderBy: "orderByWrittenDate"})`);
	$.getJSON("./api/myQuotes", { orderBy: "orderByWrittenDate" }, (res) => {
		if (res.success) {
			myQuotes = [...res.quotes];
			myLikedQuotes = [...res.likedQuotes];
			// console.log("myQuotes:", myQuotes);
			// console.log("myLikedQuotes", myLikedQuotes);
			setQuotes(myQuotes, "w3-animate-bottom");
			setQuoteListener();
		} else {
			console.log("error from the server:", res);
			// showSnackBar("Something Went Wrong When getting Your Quotes! Try Reload The Page.")
			if(res.msg)
			showSnackBar(res.msg)
		}
	});

	//stop <form> refreshing the page in click submit button.
	document.getElementById("addQouteForm").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	// document.getElementById("addQouteButton").addEventListener("click", addQuote);
}

function svgClick(x) {
	var svg;
	if (x.target.className.baseVal == "svgPath")
		//var svg will be <svg>
		svg = x.target.parentNode;
	else svg = x.target;
	for (let q of myQuotes)
		if (svgToId(svg) == q.id)
			if (isQuoteIn(q.id, myLikedQuotes)) {
				//already liked
				let like = $(svg).parent().find(".likeDiv").stop(false, false); //because increment like will take 125ms we need to stop processing if user click like when processing to prevent bugs like double like...
				like.animate({ top: "-30", opacity: "0.5" }, 125, () => {
					myLikedQuotes.splice(myLikedQuotes.indexOf(q.id), 1);
					let l = $(svg).parent().find(".numOfLikesP");
					l.text(Number(l.text()) - 1);
					Add$RemoveLike(q.id, "remove");
					svgMouseOut(x);
					like
						.css("opacity", "0")
						.css("top", "30px")
						.animate({ top: "-6", opacity: "0.9" }, 75, () => {
							like.animate({ top: "0", opacity: "1" }, 50);
						});
				});
				break;
			} else {
				//new like
				let like = $(svg).parent().find(".likeDiv").stop(false, false);
				like.animate({ top: "30", opacity: "0.5" }, 125, () => {
					myLikedQuotes.push(q.id);
					let l = $(svg).parent().find(".numOfLikesP");
					l.text(Number(l.text()) + 1);
					Add$RemoveLike(q.id, "add");
					svgMouseOut(x);
					like
						.css("opacity", "0")
						.css("top", "-30px")
						.animate({ top: "6", opacity: "0.9" }, 75, () => {
							like.animate({ top: "0", opacity: "1" }, 50);
						});
				});
				break;
			}
}

function svgMouseOut(x) {
	var path;
	if (x.target.className.baseVal == "svg")
		//var path will be svgPath
		path = x.target.lastChild;
	else path = x.target;
	if (isQuoteIn(svgToId(path.parentNode), myLikedQuotes)) {
		// In likes quotes
		path.style.fill = coffee;
	} else if (!isQuoteIn(svgToId(path.parentNode), myLikedQuotes)) {
		// Not in likes quotes
		path.style.fill = sand;
	}
}

function svgHover(x) {
	if (x.target.className.baseVal == "svg")
		//var path will be svgPath
		x.target.lastChild.style.fill = lightCoffee;
	else x.target.style.fill = lightCoffee;
}

function addQuote() {
	$("div#content form div.alert").fadeOut("fast");
	var quoteInput = document.getElementById("textAreaQoute");
	var authorInput = document.getElementById("inputAuthor");
	var dateInput = $("#my_date_picker")[0];

	if (quoteInput.value.length > 0 && authorInput.value.length > 0) {
		let d = dateInput.value
		var date;
		console.log('d: ','')
		if (d !== '') {
			date = new Date(dateInput.value.toString().trim());
			if (
				Number(date.getFullYear() + "" + date.getMonth() + "" + date.getDate()) >
				Number(new Date().getFullYear() + "" + new Date().getMonth() + "" + new Date().getDate())
			) {
				showErrorMessage(`Is this quote from the future? Date entered is incorrect.`);
				return;
			}
			if (date == NaN || date == "Invalid Date") {
				//verify date
				showErrorMessage(`Invalid Date!`);
				return;
			}
			if (d.substring(0, 2) == '00') {
				console.log(d.substring(0,2))
				//Date object convert date less than 0100 years so if user enter 0099 date object will return 1999! So
				showErrorMessage(`Invalid Date! Minimum Date is 100/1/1`);
				return;
			}
		}
		//make new quote
		let message = quoteInput.value
			.toString()
			.trim() //get rid of spaces at front and at end
			.replace(/ +(?= )/g, ""); //get rid of double spaces because of html can't accept double spaces. todo fix that. Note: to connect a quote with its object we use html <p> that hold message quote
		// if user add quotations by him self we need to remove them
		if (message[0] == '"' && message[message.length - 1] == '"')
			message = message.substring(1, message.length - 1);

		let author = authorInput.value.toString().trim();
		//if user add dash by him self we need to remove it
		if (author[0] == "-") author.splice(0, 1).trim();

		//new Quote(quoteInput.value, authorInput.value, date);
		var newQuote = {
			message: message,
			author: author,
			likes: 0,
		};
		if (d !== '')
			newQuote.date = date;
		
		console.log("new quote info:", newQuote);
		console.log('date before send to server: ',(new Date(newQuote.date).getFullYear() +
		"/" +
		(Number(new Date(newQuote.date).getMonth()) + 1) +
		"/" +
		new Date(newQuote.date).getDate()))
		$("#addQuoteLoader").fadeIn("slow"); 
		console.log(`Request: post("/api/myQuotes/newQuote",`,newQuote,')');
		$.post("/api/myQuotes/newQuote", newQuote, (res) => { 
			$("#addQuoteLoader").css('display','none');
			if (res.success) {
				// myQuotes.splice(0, 1, res.newQuote); //to set an id for last quote added
				console.log('new quote was process from server is ',res.newQuote)
				res.newQuote.date = newQuote.date;
				myQuotes.unshift(res.newQuote);//add in index[0] of the array
				console.log('date from server: ',(new Date(res.newQuote.date).getFullYear() +
				"/" +
				(Number(new Date(res.newQuote.date).getMonth()) + 1) +
				"/" +
				new Date(res.newQuote.date).getDate()))
				console.log("modal:quote were added.", myQuotes);
				setQuotes(myQuotes, "w3-animate-top"); //display
				setQuoteListener();
				quoteInput.value = " "; 
				authorInput.value = " "; 
				dateInput.value = "";
			} else { 
				console.log("modal:error in uploading new quote. Server msg:", res.msg);
				showErrorMessage(res.msg);
			}
		});
	}
}

function showErrorMessage(message) {
	let span = `<span onclick='$(this).parent().slideUp("slow");' class='closebtn'>&times;</span>`;
	let error = $("div#content form div.alert");
	error.html(message + span);
	if ($("div#content form div.alert").css("display") != "none") {
		//if there is error message already then fade it out and fade in new error
		error.fadeOut("fast");
		error.html(message + span);
		error.fadeIn("fast");
	} else {
		error.slideDown("fast");
	}
}

function deleteQuote() {
	//called when user confirm deleting a quote
	/**
	 * first animate deleted quote then in call back let below quotes animate to top
	 */
	let id = delQCache; //delQCache is quote id of the quote that its garbage button clicked
	console.log("id of deleted quote:", id);
	let animate = {
		//object tell setQuotes() function how to animate and which quote
		index: undefined,
		ani: [],
		id: id, //to delete it in the server
	};
	for (let i = 0; i < myQuotes.length; i++)
		if (myQuotes[i].id == id) {
			animate.ani.push(" animate-deleting ");
			animate.index = i;
		} else if (i > animate.index) animate.ani.push(" animate-deleting-bottom ");
		else animate.ani.push(" relative ");

		console.log(`Request: post("/api/myQuotes/delete", {id:${animate.id}})`);
		$.post("/api/myQuotes/delete", { id: animate.id }, (res) => {
			if (res.success) {
				console.log("modal: Deleted successfully.");
				setQuotes(myQuotes, animate);
			} else {
				showSnackBar(res.msg);
				console.log("error from server msg:", res);
			}
		});
}

function isQuoteIn(id, arr) {
	//id parameter is quote's id, and arr parameter is array of quotes's IDs
	return arr.indexOf(id) != -1;
}


function svgToId(svg) {
	return Number($(svg.parentNode.parentNode.parentNode).find('span.quoteId').text());
}



/**
	 * if animate type is object then there is attribute called index that will be the quote's index to animate below before closing bracket of the loop. other qoutes will be in attribute array called 'ani'
	 * if animate type is string then all qoutes will have this animation.
	 * animate = {
	 * 	index: 4,
	 * 	ani: ['animate-deleting', 'animate-deleting-bottom', 'relative', ...]
	 * }
	 */
function setQuotes(displayQuotes, animate) {
	
	var quotesDiv = $("div#qoutes");
	quotesDiv.html("");
	let height; //height will be used in animation for deleting a qoute, should be out the loop
	for (let i = 0; i < displayQuotes.length; i++) {
		let quoteD = $("<div></div>");
		quoteD.addClass(
			"w3-panel w3-card w3-round-large " + (typeof animate == "string" ? animate : "relative")
		);
		quoteD.css("padding", "0px");
		quoteD.html(
			"<div style='margin:0; ' class='w3-panel w3-sand w3-round-large'>" +
				" <div style='display:flex'>" +
				"<span style='font-size:80px;line-height:0.7em;opacity:0.8;color:rgb(202, 168, 122);'>&#10077;</span>" +
				"  <div class='qouteDate'>" +
				"  <p class='timesNewRoman'>" +
				(displayQuotes[i].date?(new Date(displayQuotes[i].date).getFullYear() +
					"/" +
					(Number(new Date(displayQuotes[i].date).getMonth()) + 1) +
					"/" +
					new Date(displayQuotes[i].date).getDate()):'') + //date in qoute object will be string because of JSON so we need to convert it to Date object to use Date functions				"     </p>" +
				"  </div>" +
				"<div class='qouteDelete'>" +
				"<svg class='svgD' viewBox='0 0 512 512'>" +
				"<title>Delete</title>" +
				"<path  d='M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320' fill='" +
				sand +
				"' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' />" +
				"<path stroke='currentColor' stroke-linecap='round' stroke-miterlimit='10' stroke-width='32' d='M80 112h352'/>" +
				"<path  d='M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224' fill='" +
				sand +
				"' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>" +
				"</svg>" +
				"</div>" +
				" </div>" +
				"<p dir='auto' class='w3-xlarge qouteMessage timesNewRoman' style='margin-top:-20px'> <i>" +
				//'"' +
				//displayQuotes[i].message +
				//'"' +
				"  </i></p>" +
				" <div style='display:flex'>" +
				"    <div>" +
				"     <p dir='auto' class='timesNewRoman author' style='opacity:0.6'>" +
				//"- " +
				//displayQuotes[i].author +
				"    </p>" +
				"  </div>" +
				"  <div class='qouteLike'>" +
				"    <div class='numOfLikesD'><div class='likeDiv'><p class='numOfLikesP timesNewRoman'>" +
				displayQuotes[i].likes +
				"</p></div> <svg class='svg' viewBox = '0 0 512 512' ><title>Submit Like</title><path class='svgPath' d='M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z'" +
				" fill='" +
				(isQuoteIn(displayQuotes[i].id, myLikedQuotes) ? coffee : "none") +
				"' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg > " +
				"        </div>" +
				"    </div>" +"<span class='quoteId'>"+displayQuotes[i].id+"</span>" +
				" </div>" +
				"</div>"
		);
		quoteD.find("p.qouteMessage i").text(`"${displayQuotes[i].message}"`);
		quoteD.find("p.author").text(`- ${displayQuotes[i].author}`);
		quotesDiv.append(quoteD);

		//to animate deleted qoute
		if (typeof animate == "object") {
			if (i == animate.index) {
				//if i is the deleted qoute, animation will be moving left and disappear
				quoteD.animate({ right: "300px", opacity: "0" }, 400);
				height = quoteD.height() + (quoteD.outerHeight(true) - quoteD.height()) / 2; //getHeight and half the margin

				//after animation we need to deal with qoute and div
				//we can do that after loop end, but we know there is one qoute will delete in this loop so no worries
				setTimeout(() => {
					myQuotes.splice(animate.index, 1);
					setQuotes(myQuotes, "relative"); //we set qoutes again without any animation to delete the div of the deleted qoute
					setQuoteListener();
					
				}, 750); //750 is 200 of below timeout and 400 of above timeout and 50 to make sure
				//750 millisecond to really delete the qoute so don't harry and leave the page
			} else if (i > animate.index)
				//if qoutes below the deleted qoute animation will be moving up
				setTimeout(() => quoteD.animate({ bottom: height + "px" }, 400), 200); //200ms to wait the deleted qoute to move left as it leaves
		}
	}

	if (quotesDiv.html() == "")
		//No qoute Found
		quotesDiv.html(
			"<div style='font-size: 25px; margin-top:100px;margin-bottom:200px;' class='timesNewRoman w3-center w3-animate-bottom w3-text-gray'>" +
				"No Qoute Found!" +
				"</div>"
		);
}