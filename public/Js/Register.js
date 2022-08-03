$(document).ready(() => {
	$("#form").submit((e) => {
		e.preventDefault();
	});

	$("button.registerbtn").click(() => {
		// console.log(
		// 	"🚀 ~ file: Register.js ~ line 8 ~ $ ~ $('div.alert span.closebtn').css('display')",
		// 	$("div.alert span.closebtn").css("display")
		// );
		

		let username, email, password, password2;
		username = $("#username");
		email = $("#email");
		password = $("#psw");
		password2 = $("#psw-repeat");
		// in user.js already var accounts = JSON.parse(localStorage.getItem("accounts"));
		if (correctAccount(username, email, password, password2)) {
			let newUser = {
				username: username.val(),
				email: email.val(),
				password: password.val(),
			};
			console.log("newUser:", newUser);
			if ($("div.alert").css("display") == "block")
			$("div.alert").fadeOut("fast", () => //{
					$("#registerLoader").css("display", "block") )
		else $("#registerLoader").css("display", "block");
			$.post("/api/register", newUser, (res) => {
				$("#registerLoader").css("display", "none");
				if (res.success) {
					location.href = "/myQuotes";
				} else {
					console.log('server:', res);
					showErrorMessage(res.msg);
				}
			});
		}
	});
});

function correctAccount(username, email, password, password2) {
	if (username.val() == "" || email.val() == "" || password.val() == "" || password2.val() == ""){
		$("#registerLoader").css("display", "none");
		return false;
}
	if (password.val() !== password2.val()) {
		//check mismatch
		showErrorMessage("Password Mismatch!");
		return false;
	}


	return true;
}

function showErrorMessage(message) {
	//<div class="alert timesNewRoman">                                  $times; is 'X' symbol
	//<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
	//This is an alert box.
	//</div>
	var error = $("div.errorMessage"); //error div that contain text and close button of the error
	console.log("error", error);
	let span = `<span style='position:relative;white-space: nowrap;' onclick='$(this).parent().fadeOut("fast");' class='closebtn'>&times;</span>`;

	if (error.css('display')=='block') {
		error.fadeOut("fast", () => {
			$("#registerLoader").css("display", "none");
			error.html(message+span);
			console.log("true");
			error.fadeIn("fast");
		});
	} else {
		$("#registerLoader").css("display", "none");
		error.html(message + span);
		console.log("false");
		error.fadeIn("fast");
	}
}
