var slider = document.querySelector("#myRange");
var eventList = {};
var messageList = [];
var editState = 0;
getMessages();
slider.oninput = function () {
	var comment = document.querySelector("#comments");
	comment.style.display = "block";
	var year = this.value % 11+ 1958;
	var heading = document.querySelector("#year-heading");
	var textArea = document.querySelector("#writing-area");
	textArea.style.display = "block";
	heading.innerHTML = year;
	textArea.innerHTML = eventList[year];
	var videoDiv = document.createElement('div');
	textArea.appendChild(videoDiv);
	getMessages(messageList);
	if (year >= 1958 && year <= 1963){
		console.log("merctest");
		videoDiv.innerHTML = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/RdEQycBo1Oo' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>";
	}
	else if (year >= 1964 && year <= 1967){
		console.log("gemtest");
		videoDiv.innerHTML = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/lkhIFNS-KVM' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>";
	}
	else{
		console.log("appolotest");
		videoDiv.innerHTML = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/P60oN47lTrc' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>";
	}

};
var commentButton = document.querySelector("#comment-button");
function getMessages(){
	fetch("https://s23-deploy-ngardner1-production.up.railway.app/messages", {credentials:"include"}).then(function (response) {
		response.json().then( function (messages) {
			if (response.ok){
				document.querySelector("#writing-area").style.display = "block";
				document.querySelector("#signUp").style.display = "none";
				document.querySelector("#signIn").style.display = "none";
			}
			var headingYear = document.querySelector("#year-heading").innerHTML;
			var messageArea = document.querySelector("#message_area");
			messageArea.innerHTML = "";
			console.log("Message List From server", messages, " Length of message:", messages.length);
			messageList = messages;
			for (d in messageList){
				if (messageList[d]["year"] == headingYear){
					console.log("Message id:", messageList[d]["id"])
					var mListItem = document.createElement("li");
					mListItem.innerHTML = messageList[d]["comment"];
					var dateDiv = document.createElement("div");
					var favAstro = document.createElement("div");
					var favYear = document.createElement("div");
					dateDiv.className = "dateClass";
					dateDiv.innerHTML = messageList[d]["date"];
					favAstro.className = "favAstro";
					favYear.className = "favYear";
					favAstro.innerHTML = messageList[d]["favorite_astronaught"];
					favYear.innerHTML = messageList[d]["favorite_year"];
					messageArea.appendChild(mListItem);
					mListItem.appendChild(dateDiv);
					mListItem.appendChild(favAstro);
					mListItem.appendChild(favYear);
					messageArea.appendChild(mListItem);
				
					var deleteButton = document.createElement("button");
					var buttonID = messageList[d]["id"];
					deleteMessages(mListItem, deleteButton, buttonID);
					deleteButton.innerHTML = "Delete Comment";
					deleteButton.classList.add("deleteButton")
					mListItem.appendChild(deleteButton);
					
					var editButton = document.createElement("button");
					editMessages(mListItem, editButton, buttonID, messageList[d]["comment"]);
					editButton.innerHTML = "Edit Comment";
					editButton.classList.add("editButton")
					mListItem.appendChild(editButton);

				};
			};
		});

	});
};

function editMessages(mListItem, editButton, id, comment){
	editButton.onclick = function(){
	var textBox = document.querySelector("#text-box");
	console.log("textBox input", textBox.value);
	var textSend = textBox.value;
	var currentDate = pgFormatDate();
	var section = document.querySelector("#year-heading").innerHTML;
	var favYear = document.querySelector("#favoriteYear").value;
	var favAstro = document.querySelector("#favoriteAstronaught").value;
	textBox.value = comment;
	if (editState == 0){
		editButton.innerHTML = "Confirm";
		editState =1;
	}
	else{
		editState = 0;
		textBox.value = "";
		var path = "https://s23-deploy-ngardner1-production.up.railway.app/messages/" + id;
		fetch(path, {method:"PUT", credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"message=" + textSend + "&section=" + section + "&date=" + currentDate + "&favyear=" + favYear + "&favastro=" + favAstro }).then(function (response){
			if(!response.ok){
				console.log("Could not delete item");
				getMessages();
			}else{
				console.log("Delete good");
				getMessages();
			}
		})
	    }
	}
}

function deleteMessages(mListItem, deleteButton, id){
	deleteButton.onclick = function(){
		if (confirm("Are you sure you want to delete this comment?")){
			var path = "https://s23-deploy-ngardner1-production.up.railway.app/messages/" + id;
			fetch(path, {method:"DELETE", credentials: "include"}).then(function (response){
				if(!response.ok){
					console.log("Could not delete item");
					getMessages();
				}else{
					console.log("Delete good");
					getMessages();
			
				}
			})
		}
		else{
			return;
		}
	}
}
commentButton.onclick = function sendComment(){
	var textBox = document.querySelector("#text-box");
	var favYear = document.querySelector("#favoriteYear").value;
	var favAstro = document.querySelector("#favoriteAstronaught").value;
	console.log("textBox input", textBox.value);
	var textSend = textBox.value;
	var currentDate = pgFormatDate();
	var section = document.querySelector("#year-heading").innerHTML;
	textBox.value = "";
	fetch("https://s23-deploy-ngardner1-production.up.railway.app/messages", {method:"POST",credentials:'include', headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"message=" + textSend + "&section=" + section + "&date=" + currentDate + "&favyear=" + favYear + "&favastro=" + favAstro}).then(function (response) {
		if(!response.ok){
			console.log("text error could not go through");
		}else{
			console.log("response good");
			getMessages(messageList);
		}
	})

}


loginButton = document.querySelector("#loginButton");
loginButton.onclick = function authenticate(){
	email = document.querySelector("#username").value;
	password = document.querySelector("#password").value;
	document.querySelector("#username").value = "";
	document.querySelector("#password").value = "";

	fetch("https://s23-deploy-ngardner1-production.up.railway.app/sessions", {method:"POST", credentials: "include",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"email=" + email + "&password=" + password}).then(function (response) {
		passfail = document.querySelector("#Title");
		if(response.status  == 422){
			console.log("User does not exist");
			passfail.innerHTML = "User does not exist, please register first.";
			passfail.style.color = "red";

		}
		else if (response.status == 401){
			console.log("Wrong Password");
			passfail.innerHTML = "Email or password incorrect, please check and sign in again.";
			passfail.style.color = "red";
		}
		else{
			console.log("Login Successful");
			document.querySelector("#writing-area").style.display = "block";
			document.querySelector("#signUp").style.display = "none";
			document.querySelector("#signIn").style.display = "none";
		}
	})
}
fetch("https://api.jsonbin.io/v3/b/63d1bf57ebd26539d067c3e0").then(function (response) {
	response.json().then( function (data) {
		console.log("data recieved from server", data);
		eventList = data["record"];

	});

});

signUpButton = document.querySelector("#signUpButton");
signUpButton.onclick = function register(){
	firstname = document.querySelector("#firstname").value;
	lastname = document.querySelector("#lastname").value;
	email = document.querySelector("#sEmail").value;
	password = document.querySelector("#sPassword").value;
	document.querySelector("#firstname").value = "";
	document.querySelector("#lastname").value = "";
	document.querySelector("#sEmail").value = "";
	document.querySelector("#sPassword").value = "";
	fetch("https://s23-deploy-ngardner1-production.up.railway.app/users", {method:"POST", credentials: "include",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"firstname=" + firstname + "&lastname=" + lastname + "&email=" + email + "&password=" + password}).then(function (response) {
		passfail = document.querySelector("#sTitle");
		if(!response.ok){
			console.log("Sign up Unsuccessful");
			passfail.innerHTML = "Email already in use, please sign in.";
			passfail.style.color = "red";
		}
		else{
			console.log("Sign up Successful");
			passfail.innerHTML = "You have successfully registered! Please sign in";
			passfail.style.color = "green";
		}
	})
}
fetch("https://api.jsonbin.io/v3/b/63d1bf57ebd26539d067c3e0").then(function (response) {
	response.json().then( function (data) {
		console.log("data recieved from server", data);
		eventList = data["record"];

	});

});
function pgFormatDate() {
	  function zeroPad(d) {
		      return ("0" + d).slice(-2)
		    }

	  var parsed = new Date()

	  return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate()), zeroPad(parsed.getHours()), zeroPad(parsed.getMinutes()), zeroPad(parsed.getSeconds())].join(" ");
}
//pyserver % pip3 install bcrypt passlib
//from passlib.hash import bcrypt
//!!create class for session store, put it in a new file!!
//
//import os, base64
//class SessionStore:
//def __init__(self):
//	a dictionary of dictionaries 1 per session
//	self.sessions = {}
//
//def createSession(self):
//	creates a new session dictionsary add to self.sessions
//	assign a new session id
//	sessionID = self.generateSessionID()
//	self.sessions[sessionID] = {}
//	return sessionID
//
//def generateSessionID(self):
//	rnum = os.urandom(32) 
//	rstr = base64.b64encode(rnum).decode("utf-8")
//	return rstr
//def getSessionData(self,sid):
//if sessionID in self.sessions:
//	return self.sessions[sessionID]
//	else:
//		return None
// !!now in the server!!
//
//initialize sessionstore as a global variable
//call load session for every do_??? request 
//send cookie should be called on every response
//best way is to override end_headers()
//def end_headers(self):
//	self.sendCookie()
//	super().end_headers()
//SESSION_STORE = SessionStore()
//
// def loadSession(self):
// 	self.loadCookie()
// 	check for existance of session id cookie
// 	if 'sessionId' in self.cookie:
// 		sessionId = self.cookie['sessionId'].value
// 	if the session id cookie exists:
// 		load the session datea for the session ID
// 		self.sessionData = SESSION_STORE.getSessionData(sessionId)
// 		if the session ID is not valid:
//	 		create a new session/ session ID
// 			save the new session ID into a cookie
// 			self.cookie['sessionId'] = sessionId
// 			load the session with the new session ID
// 			self.sessionData = SESSION_STORE.getSessionData(sessionId)
// 	else:
// 		create a new session/ session ID
// 		save the new session ID into a cookie
//		load the session with the new session ID
//!!temp code to test loading data!!
//
//print("current session data:", self.sessionData)
//if 'test' not in self.sessionData:
//	self.sessionData['test' = 1]
//	else:
//	self.sessionData['test'] += 1
//
//
//This identifier means they are logged in, use this when they are sucessfully logged in.
//	self.sessionData['user'] = user['id']
//
//
//!!Cors stuff!!
//
//Access-Control-Allow-Credentials: true
//
//Javascript needs to be explicit about sending credentials
//
//You can no longer use the * for allow-origin
//
//put access controls origin and credentials in end headers
//
//
//make set access-control-allow-origin to self.headers["Origin"]
//
//
//
//
//!!Now on the client code!!
//
//every fetch now needs 
//credentials: 'include',
//
//
//!!Authorization!!
//in the server for anything that needs to be protected add this
//
//if 'userId' in self.sessionData:
//	self.handle401()
//	return
//
//dont add this for registration
//
//Use the status codes to tell if you are logged in.
