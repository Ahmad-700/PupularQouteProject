/**
 * home.html     (*Home*, About, Register, Login) not loggedin
 * about.html    (Home, *About*, Register, Login) not loggedin
 * register.html (Home, About, *Register*, Login) not loggedin
 * login.html    (Home, About, Register, *Login*) not loggedin
 *
 * home.html     (*Home*, My Quotes, About, Logout) loggedin
 * myQuotes.html (Home, *My Quotes*, About, Logout) loggedin
 * About.html    (Home, My Quotes, *About*, Logout) loggedin
 */
var isLoggedin = false;
class Header extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// console.log("this from Header class", this);
		// console.log("location.href from Header class", location.href);
		let This = this;
		$.getJSON("/api/isLoggedin", (res) => {
			if (res.success) {
				isLoggedin = res.isLoggedin || false;
				this.setHeader(This, isLoggedin, window.location.href.toString());
			}
		});
		this.setHeader(This, false, "");
	}

	/**
	 * this function will set the header.
	 *
	 * @param {boolean} isLoggedin
	 * @param {string} url  is location.href
	 */
	setHeader(This, isLoggedin, url) {
		This.innerHTML = `
      <div
      id="header"
      class="w3-bar w3-coffee w3-wide w3-card-4"
      style="z-index: 3;display:block !important; "
  >
      <a
          title="Home"
          href="/home"
          class="w3-hide-small w3-bar-item w3-padding-16 w3-button w3-hover-none timesNewRoman"
          ><b>Popular</b> Quotes</a
      >
      
      <div id="mySidenav" class="sidenav">
  <a class="closebtn" onclick="closeNav()">&times;</a>
  <a style="${url.indexOf("home")!=-1?"box-shadow:0px 0px 5px var(--sand),0px 0px 5px var(--sand);":""}" href="/home">Home</a>
  <a style="display:${isLoggedin ? "block" : "none"};white-space: nowrap;${url.indexOf("myQuotes")!=-1?"box-shadow:0px 0px 5px var(--sand),0px 0px 5px var(--sand);":""}"  href="/myQuotes">My Quotes</a>
  <a style="${url.indexOf("about")!=-1?"box-shadow:0px 0px 5px var(--sand),0px 0px 5px var(--sand);":""}" href="/about">About</a>
  <a style="display:${!isLoggedin ? "block" : "none"};${url.indexOf("register")!=-1?"box-shadow:0px 0px 5px var(--sand),0px 0px 5px var(--sand);":""}" href="/register">Register</a>
  <a style="display:${!isLoggedin ? "block" : "none"};${url.indexOf("login")!=-1?"box-shadow:0px 0px 5px var(--sand),0px 0px 5px var(--sand);":""}" href="/login">Login</a>
  <a style="display:${isLoggedin ? "block" : "none"}; cursor:pointer;"onclick='loggingOut()' >Logout</a>
</div>

<!-- element to open the sidenav -->
<div style="display:none;" class="w3-show-tiny w3-padding-small" >
<div style="display:flex">
<div style='cursor:pointer;' onclick="openNav()">
<div class="menu-bars"></div>
<div class="menu-bars"></div>
<div class="menu-bars"></div>
</div>
<span
          title="Home"
          style="margin:auto 10px;"
          class=" w3-right w3-xlarge w3-hover-none timesNewRoman"
          >${This.getPageName(url)}</span>
    </div>
    </div>
      <!-- ^^^^^^^^^^ -->
      <!-- Float links to the right. Hide them on small screens -->
      <div id="headerTabs"  class=" w3-right">
          <a
              title="Home"
              href="/home"
              style="transition:0.4s;"
              class="w3-bar-item w3-hide-tiny w3-padding-16 w3-margin-right w3-button w3-hover-coffee w3-bottombar ${
								url.indexOf("home") != -1 ? "w3-border-sand" : "w3-border-coffee"
							}  w3-hover-border-sand timesNewRoman"
              >Home</a
          >
          <a style="transition:0.4s;display:${isLoggedin ? "block" : "none"};white-space: nowrap;"
				title="My Quote / Add Quote"
				href="/myQuotes"
				class="w3-bar-item w3-hide-tiny  ${
					url.indexOf("myQuotes") != -1 ? "w3-border-sand" : "w3-border-coffee"
				} w3-margin-right w3-padding-16 w3-button w3-hover-coffee w3-bottombar w3-hover-border-sand timesNewRoman"
			>
				My Quotes</a
			>
          <a
              title="About Us"
              href="/about"
              style="transition:0.4s;"

              class="w3-bar-item w3-hide-tiny  w3-margin-right w3-padding-16 w3-button  w3-hover-coffee w3-bottombar ${
								url.indexOf("about") != -1 ? "w3-border-sand" : "w3-border-coffee"
							} w3-hover-border-sand timesNewRoman"
              >About</a
          >
          <a style="transition:0.4s;display:${!isLoggedin ? "block" : "none"};"
              title="Register"
              href="/register"
              class="w3-bar-item w3-hide-tiny  w3-margin-right w3-padding-16 w3-button w3-hover-coffee w3-bottombar ${
								url.indexOf("register") != -1 ? "w3-border-sand" : "w3-border-coffee"
							} w3-hover-border-sand timesNewRoman"
          >
              Register</a
          >
          <a style="transition:0.4s;display:${!isLoggedin ? "block" : "none"};"
              title="Login"
              href="/login"
              class="w3-bar-item w3-hide-tiny  w3-padding-16 w3-button w3-hover-coffee w3-bottombar w3-hover-border-sand ${
								url.indexOf("login") != -1 ? "w3-border-sand" : "w3-border-coffee"
							} timesNewRoman"
          >
              Login</a
          >
          <a style="transition:0.4s;display:${isLoggedin ? "block" : "none"};"
          title='Logout' onclick='loggingOut()'
class='w3-hide-tiny  w3-bar-item w3-padding-16 w3-border-coffee w3-button w3-hover-coffee w3-bottombar w3-hover-border-sand  timesNewRoman'>
Logout</a>
      </div>
  </div>
      `;
    }

	/**
	 * return (Home, My Quotes, Login, Register or About).
	 * if nothing found return empty string
	 * @param {string} url
	 */
	getPageName(url) {
		url = url.toString().toLowerCase();
		if (url.indexOf("home") != -1) return "Home";
		else if (url.indexOf("myquotes") != -1) return "My Quotes";
		else if (url.indexOf("about") != -1) return "About";
		else if (url.indexOf("login") != -1) return "Login";
		else if (url.indexOf("register") != -1) return "Register";
		else return "";
	}
}


customElements.define("my-header", Header);
