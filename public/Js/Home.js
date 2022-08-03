var coffee = "#caab7a"; //#caab7a   rgb(202, 168, 122)
var lightCoffee = "rgb(255, 228, 182)";
var sand = "rgb(253, 245, 230)";
var quotes = [];
const quotesPerPage = 5;
var page;
var myLikedQuotes;

//server methods
function GetPage(pageNum, orderBy, callback) {
	//callBack have one parameter for the array respond
	//orderBy is string typed as id of orderBy elements
	if (pageNum) {
		pageNum = Number(pageNum);
		if (pageNum) {
			console.log(`Request: getJSON("./api/pageNum/${pageNum}",{orderBy:${orderBy}})`);
			$.getJSON("./api/pageNum/" + pageNum, { orderBy: orderBy }, (res) => {
				if (res.success == true) {
					callback(res.data);
					if (res.data.length == quotesPerPage) $("#more").removeClass("removed").fadeIn(200);
					else $("#more").fadeOut(200);
				} else {
					console.log("error from the server msg:", res.msg);
					showSnackBar("Something Went Wrong!");
				}
			});
		} else console.log("error numbering pageNum:", pageNum);
	} else console.log("error pageNum:", pageNum);
}

function GetSearch(orderBy, searchText, pageNum, callingBack) {
	if (!pageNum) {
		pageNum = 1;
		page = 1;
	}
	console.log(
		`Request: getJSON("./api/search",{orderBy:${orderBy}, search:${searchText}, pageNum:${pageNum}})`
	);
	$.getJSON("./api/search", { orderBy: orderBy, search: searchText, pageNum: pageNum }, (res) => {
		if (res.success == true) {
			if (callingBack) {
				callingBack(res.data);
				if (res.data.length == quotesPerPage) $("#more").removeClass("removed").fadeIn(200);
				else $("#more").addClass("removed").fadeOut(200);
			} else {
				console.log(
					"error: GetSearch was successfully processed, but there is no callback! res:",
					res.data
				);
				showErrorMessage("Something Went Wrong!");
			}
		} else console.log("error from server msg:", res.msg);
	});
}
function downloadMore() {
	var $more = $("#more").addClass("removed");
	if ($more.hasClass("removed")) {
		$more.fadeOut(200, () => {
			$("#moreLoader").css("display", "block");
			$more.removeClass("removed");
			var search = $("#searchBox").val().trim();
			if (search == "") search = undefined;
			GetSearch(getSelectedOrderBy(), search, ++page, (arr) => {
				for (let a of arr) {
					quotes.push(a);
					a.animateClass = "page" + page;
				}
				$("#moreLoader").css("display", "none");
				setQuotes(
					quotes,
					($q) => $(".page" + page).animate({ top: getWindowHeight(false, true, true) }, 0),
					true,
					() => $(".page" + page).animate({ top: 0 }, 800)
				);

				if (arr.length == quotesPerPage) $more.removeClass("removed").fadeIn(200);
			});
		});
		// console.log("test fun: ", getSelectedOrderBy());
	} else return;
}
document.addEventListener("DOMContentLoaded", webLoaded);

function webLoaded() {
	page = 1;
	console.log(`Request: getJSON("./api/like")`);
	$.getJSON("/api/like", (res) => {
		if (res.success) {
			console.log("myLikedQuotes:", res.likedQuotes);
			myLikedQuotes = res.likedQuotes;
			// setLikesAfterQuotesLoaded();
		} else console.log(`can't fetch your likes quotes. because you are not login!`);
	});
	GetPage(page, "orderByWrittenDate", (arr) => {
		// console.log("GetPage worked:", arr);
		for (let a of arr) quotes.push(a);

		$("#qoutes").animate(
			{ top: getWindowHeight() },
			0, //zero because when page loaded we don't need to animate existing quotes to below just set quotes below immediately then animate it to {top:0}
			() => {
				$("#searchOrderbyLoader").css("display", "none");
				setQuotes(quotes, ($q) => $q.animate({ top: 0 }, 800));
			}
		);
	});

	document.getElementById("searchForm").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	// Close the dropdown menu of (Order by) if the user clicks outside
	$(window).click((event) => {
		if (!event.target.matches(".dropbtn")) {
			if ($("#myDropdown").css("display") == "block") $("#myDropdown").slideToggle("fast");
		}
	});

	//orderBy option selected
	$("a.orderBy").click((e) => {
		if ($(e.target).hasClass("orderBy"))
			setTimeout(
				() =>
					$("button.dropbtn")
						.text(e.target.innerText)
						.append('<span style="color: var(--coffee)">&nbsp;&#9660;</span>'),
				500
			); //change text in the orderby button after animation
		location.hash = "#";
		$("#qoutes")
			.stop(false, false) //when fast changing occur, stop() will stop any previous animation and will make the recent animation i.e focus in the last searched word
			.animate({ top: getWindowHeight() }, 600, () => {
				page = 1;
				$("#searchOrderbyLoader").css("display", "block");
				GetSearch(e.target.id, $("#searchBox").val().trim(), page, (arr) => {
					quotes = arr;
					$("#searchOrderbyLoader").css("display", "none");
					setQuotes(quotes, ($q) => $q.animate({ top: 0 }, 600));
				}); //todo if there searchBox and user change orderBy also if there is searchBox and user click More!!
			});
	});
	likeListeners();
}

function getSelectedOrderBy() {
	//take order by button and depend on the text there the result will be ids of orderBy
	sortBy = $("button.dropbtn").text();
	if (sortBy.indexOf("Likes") != -1) return "orderByLikes";
	else if (sortBy.indexOf("(A - Z)") != -1) return "orderByAlphaAZ";
	else if (sortBy.indexOf("(Z - A)") != -1) return "orderByAlphaZA";
	else if (sortBy.indexOf("(Newest)") != -1) return "orderByDateNewest";
	else if (sortBy.indexOf("(Oldest)") != -1) return "orderByDateOldest";
	else return "orderByWrittenDate"; //default
}

function likeListeners() {
	for (let svg of document.getElementsByClassName("svg")) {
		//like button is <svg> tag in HTML
		svg.addEventListener("mouseover", svgHover);
		svg.addEventListener("mouseout", svgMouseOut);
		svg.addEventListener("click", svgClick);
	}
}

function svgClick(x) {
	var svg;
	if (x.target.className.baseVal == "svgPath")
		//var svg will be <svg>
		svg = x.target.parentNode;
	else svg = x.target;
	for (let q of quotes)
		if (svgToId(svg) == q.id)
			if (!isLoggedin) {
				$("#modalDiv").fadeIn("fast"); //show (register to like) modal if user doesn't logged in
			} else if (isQuoteIn(q.id, myLikedQuotes)) {
				//already liked
				let like = $(svg).parent().find(".likeDiv").stop(false, false); //because increment like will take 125ms we need to stop processing if user click like when processing to prevent bugs like double like...
				like.animate({ top: "-30", opacity: "0.5" }, 125, () => {
					myLikedQuotes.splice(myLikedQuotes.indexOf(q.id), 1);
					let l = $(svg).parent().find(".numOfLikesP");
					l.text(Number(l.text()) - 1);
					Add$RemoveLike(q.id, "remove");
					q.likes--;
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
					q.likes++;
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

	//in short: if user hover in x(heart symbol) of a quote then color of the heart should be determine by (is user liked then coffee color else sand color)
	if (isQuoteIn(svgToId(path.parentNode), myLikedQuotes)) {
		// console.log('In likes qoutes')
		path.style.fill = coffee;
	} else if (!isQuoteIn(svgToId(path.parentNode), myLikedQuotes)) {
		// console.log('Not in likes qoutes')
		path.style.fill = sand;
	}
}

function svgHover(x) {
	if (x.target.className.baseVal == "svg")
		//var path will be svgPath
		x.target.lastChild.style.fill = lightCoffee;
	else x.target.style.fill = lightCoffee;
}

function isQuoteIn(id, arr) {
	//search in arr of qoutes for id
	//id is quote's id, and arr is array of quotes' IDs
	if (arr) {
		return arr.indexOf(id) != -1;
	} else {
		// user not logged in, then return false
		return false;
	}
}

function svgToId(svg) {
	return Number($(svg.parentNode.parentNode.parentNode).find('span.quoteId').text());
}


var searchCache = "";
function search() {
	window.location.hash = "#";
	var search = $("#searchBox").val().trim();
	if (searchCache == search) return;
	else searchCache = search;
	if (search == "") search = undefined;

	Promise.all([//we use promise all because we want to animate and search at same time. So, if all promises (i.e search and animate) finished then set new quotes; without corrupt animation 
		(() => {//retrieve data 
			return new Promise((resolve, reject) => {
				page = 1;
				GetSearch(getSelectedOrderBy(), search, page, (arr) => {
					quotes = arr;
					resolve();
				});
			});
		})(),
		(() => {//animate
			return new Promise((resolve, reject) => {
				$("#qoutes")
					.stop(false, false)
					.animate({ top: getWindowHeight() }, 500, () => {
						$("#searchOrderbyLoader").css("display", "block");
						resolve();
					});
			});
		})(),
	])
		.then(() => {
			$("#searchOrderbyLoader").css("display", "none");
			setQuotes(quotes, ($quotes) => $quotes.animate({ top: 0 }, 500));
		})
		.catch((e) => {
			console.log("error catch: ", e);
			showSnackBar(
				`Something Went Wrong! Please Try <a href='#' onclick='location.reload()'>Reload The Page</a>`
			);
		});
}

/**
 * Called when:
 * 1-set quotes when reload the page.
 * 2-set quotes when order change.
 * 3-set quotes when search.
 * 4-set quotes when More button clicked the new quotes will added and then set quotes will call.
 * Ex: setQuotes(q, ($quotes) => { $quotes.stop(false, false).animate({ top: "0" }, 400) }, 'page3',()=>$('.page3').animate...);
 * @param {quote[]} displayQuotes is array of quotes object
 * @param {function} animateEnd is how to animate quotes after it changed.
 * @param {string} useClass is used to add class in each quote that have class attribute called animateClass; for quotes that will added when click More to animate them when settingQuotes
 * @param {function} callback
 */
function setQuotes(displayQuotes, animateEnd, useClass, callback) {
	var qoutesDiv = $("div#qoutes");
	qoutesDiv.html("");
	for (let i = 0; i < displayQuotes.length; i++) {
		let quoteD = $("<div></div>");
		quoteD.addClass("w3-panel w3-card w3-round-large quote relative"); //w3-animate-bottom
		if (useClass) quoteD.addClass(displayQuotes[i].animateClass);
		quoteD.css("padding", "0");
		quoteD.html(
			"<div style='margin:0; top=100px' class='w3-panel w3-sand w3-round-large'>" +
				" <div style='display:flex'>" +
				"<span class='unselectable' style='font-size:80px;line-height:0.7em;opacity:0.8;color:rgb(202, 168, 122);'>&#10077;</span>" +
				"  <div class='qouteDate'>" +
				"  <p class='timesNewRoman'>" +
				(displayQuotes[i].date
					? new Date(displayQuotes[i].date).getFullYear() +
					  "/" +
					  (Number(new Date(displayQuotes[i].date).getMonth()) + 1) +
					  "/" +
					  new Date(displayQuotes[i].date).getDate()
					: "") + //date in quote object will be string because of JSON so we need to convert it to Date object to use Date functions
				"     </p>" +
				"  </div>" +
				" </div>" +
				"<p class='w3-xlarge qouteMessage timesNewRoman' dir='auto' style='margin-top:-20px;'> <i>" +
				//	'"' +
				//	displayQuotes[i].message +
				//	'"' +
				"  </i></p>" +
				" <div style='display:flex'>" +
				"    <div>" +
				"     <p dir='auto' class='timesNewRoman author' style='opacity:0.6'>" +
				//"- " +
				//displayQuotes[i].author +
				"    </p>" +
				"  </div>" +
				"  <div class='qouteLike'>" +
				"    <div class='numOfLikesD unselectable'><div class='likeDiv'><p class='numOfLikesP timesNewRoman'>" +
				displayQuotes[i].likes +
				"</p></div> <svg class='svg' viewBox = '0 0 512 512' ><title>Submit Like</title><path class='svgPath' d='M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z'" +
				" fill='" +
				(isQuoteIn(displayQuotes[i].id, myLikedQuotes) ? coffee : "none") +
				"' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg > " +
				"        </div>" +
				"    </div>" + "<span class='quoteId'>"+displayQuotes[i].id+"</span>" +
				" </div>" +
				"</div>"
		);
		quoteD.find(".w3-xlarge.qouteMessage i").text(`"${displayQuotes[i].message}"`);
		quoteD.find("div div p.author").text(`- ${displayQuotes[i].author}`);
		qoutesDiv.append(quoteD);
	}
	likeListeners();
	//if No qoute Found
	if (qoutesDiv.html() == "")
		qoutesDiv.html(
			"<div style='font-size: 25px; margin-top:100px;margin-bottom:200px;' class='timesNewRoman w3-center w3-animate-bottom w3-text-gray'>" +
				"No Qoute Found!" +
				"</div>"
		);
	if (animateEnd) animateEnd($("#qoutes"));

	if (callback) callback();
}
