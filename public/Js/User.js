$(document).ready(() => {
	// When the user clicks anywhere outside of any modal, close it. modal is ...google it
	window.onclick = function (event) {
		let modal = $("#modalDiv");
		if (event.target == modal[0]) modal.fadeOut("fast");
	};

	//when header in small screen hide it if user click outside the sideNav
	$(window).click((event) => {
		if (!event.target.matches(".sidenav"))
			if ($("#mySidenav").css("width") != "0px")
				document.getElementById("mySidenav").style.width = "0";
	});

	//to display any snackbar call
	$("body").append(`<div id="snackbar"></div>`);

	//auto align text right-to-left or vice versa
	// var rtlChar = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/gm;
	// // $(document).ready(function(){
	// $(".checkRTL").ready(function () {
	// 	console.log("checkRTL called");
	// 	var isRTL = this.value.match(rtlChar);
	// 	if (isRTL !== null) {
	// 		this.style.direction = "rtl";
	// 	} else {
	// 		this.style.direction = "ltr";
	// 	}
	// 	// });
	// });
});

/**
 * text is mandatory, else parameter are optionally.
 * @param {html|string} text
 * @param {Number} duration As time it set on the screen. default is 3000ms
 * @param {Color} background set background color. default is coffee
 * @param {Color} color As text color. default is black
 */
function showSnackBar(text, duration = 3000, background = "var(--coffee)", color = "black") {
	let $snack = $("#snackbar");
	$snack
		.fadeTo("normal", 0, () =>
			$snack.html(text).css("backgroundColor", background).css("color", color)
		)
		.fadeTo("normal", 0)
		.animate({ opacity: "0.7", bottom: "30px" }, 500)
		.animate({ opacity: background == "transparent" ? "1" : "0.7" }, duration)
		.animate({ opacity: "0", bottom: "0px" }, 500)
		.fadeTo("normal", 0);
}

/**
 * Called by html onclick attribute.
 * header tab use it.
 */
function loggingOut() {
	console.log(`Request: post("/logout")`);
	$.post("/logout", (res) => {
		if (res.success) window.location.href = "/login";
		else window.location.href = "/login";
	});
}

/**
 * @param {h} h is boolean if true don't subtract header
 * @param {s} s is boolean if true don't subtract searchContent
 * @param {hr} hr is boolean if true don't subtract <hr>} h
 * @returns height of the user window
 */
function getWindowHeight(h, s, hr) {
	let winHeight = $(window).height(); //get user height screen to make quotes get below
	if (!h) winHeight -= $("#header").height(); //quotes are below header. so subtract header height
	if (!s) winHeight -= $("#searchContent").height(); //subtract searchContent div height
	if (!hr) winHeight -= $("hr").outerHeight(true); //subtract <hr> (line below searchContent) with its margin height
	return winHeight;
}

/**
 * Add or Remove Like of user's liked list of quotes
 * @param {id} id is the id of the quote
 * @param {state} state is string wither 'add' or 'remove'
 */
function Add$RemoveLike(id, state) {
	if (state && (state === "add" || state === "remove")) {
		console.log(`Request: post("/api/like",{ quoteId:${id}, state:${state}})`);
		$.post("/api/like", { quoteId: id, state: state }, (res) => {
			if (res.success == true) console.log("modal: Like is submitted. for id:", id);
			else {
				console.log("modal: error occur when adding/removing like! msg:", res.msg);
				showSnackBar(`Something Went wrong, When Adding/Removing Like! Try Reload The Page`);
			}
		});
	} else console.log("error: specify the state; is it add or remove like?!");
}

/**Set the width of the side navigation to 210px */
function openNav() {
	document.getElementById("mySidenav").style.width = "210px";
}

/**  Set the width of the side navigation to 0 */
function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
}
