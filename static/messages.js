console.log("Hello World");

$(()=>{
  console.log("Hello World");
});

const socket = io();
var active_users = [];
var user_name;

socket.on('connect', ()=>{
  console.log("connected")
});

socket.on("get_username", usersname => {
  user_name = usersname;
})

socket.on("user_connected", username =>{
  console.log(username);
  active_users.push(username);
  $("#users-list").html("");
  for (i = 0; i < active_users.length; i++) {
    let user_element = $("<li>");
    user_element.html(active_users[i]);
    $("#users-list").append(user_element);
  }
})

socket.on("user_disconnected", username => {
  console.log(username, "has logged off");
  active_users = active_users.filter(name => name != username);
  $("#users-list").html("");
  for (i = 0; i < active_users.length; i++) {
    let user_element = $("<li>");
    user_element.html(active_users[i]);
    $("#users-list").append(user_element);
  }
})

socket.on("full_user_list", users => {
  console.log(users);
  active_users = users;
  $("#users-list").html("");
  for (i = 0; i < active_users.length; i++) {
    let user_element = $("<li>");
    user_element.html(active_users[i]);
    $("#users-list").append(user_element);
  }
})

socket.on("all_user_message", (username, message) => {
  console.log(username, message); //puts message in console
  let message_element;
  if (username == user_name) {
    message_element = $("<li>", {'class':'yourname'});
    message_element.html(message);
  }
  else {
    message_element = $("<li>", {'class':'othername'})
    message_element.html(username + ": " + message);
  }
  console.log($("#messages-list"));
  $("#messages-list").append(message_element);
  $("#messages-list").scrollTop(function() { return this.scrollHeight });
});

$("#message-input-form").submit((e)=>{
  e.preventDefault(); //prevents default HTML submission of form
  let message=$("#message-text").val(); //create local variable with message input
  if (message.length > 0) { //if message not empty
    $("#message-text").val("");
    socket.emit("new_message", message); //sends to server
  }
});
