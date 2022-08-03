$(document).ready(() => {
	$("#form").submit((e) => {
		e.preventDefault();
		let username = $("#username").val();
		let password = $("#psw").val();
		if ($(".alert").css("display") == "block")
			$(".alert").fadeOut("fast", () => $("#loginLoader").css("display", "block"));
		else $("#loginLoader").css("display", "block");
		$.post("/api/login", { username: username, password: password }, (res, status) => {
			let success = res.success;
			$('#loginLoader').css('display','none')
			if (success) {
				location.href = '/myQuotes'
			} else {
				console.log(res);
				showErrorMessage(res.msg);
			}
		});
	});
});

function showErrorMessage(message) {
	if ($(".alert").length > 0)
		$(".alert").fadeOut("fast", () => {
			$(".alert").remove();
			$('#loginLoader').css('display','none')
			makeError(message);
		});
	else makeError(message);
}

function makeError(message) {
	let span = $("<span></span>");
	span.addClass("closebtn"); //.css('margin-top','auto').css('margin-bottom','auto');
	span.click((e) => {
		$(e.target).parent().fadeOut("fast");
	});
	span.html("&times;");
	// console.log(span)
	let error = $("<div></div>");
	error.addClass("alert timesNewRoman");
	error.html(span);
	error.append(message).fadeIn();
	// console.log(error)
	$("hr:last").before(error);
}
