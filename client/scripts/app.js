// YOUR CODE HERE:
/*

doc ready func
get request- jquery get, ajax
setInterval 'refresh'
append messages <ul>

HTML
create in DOM- textbox, send button

*/

$(document).ready(function(){
  var serverData;
  var currentRoom = ""//"The HackPad";    //  ASK: OK to make this global? 

  var User = function(currentRoom){
    this.username = location.search.split("=")[1];
    this.friends = [];
    this.currentRoom = currentRoom || "";
  }

  User.prototype.createRoom = function(name){
    this.currentRoom = name;
  }

  var user = new User(currentRoom);

  var fetchAndDisplayWrapper = function(){
    $.get('https://api.parse.com/1/classes/chatterbox?order=-createdAt', function(data){
      fetch(data);
    })
  };

  fetchAndDisplayWrapper();
  setInterval(fetchAndDisplayWrapper
  , 5000);

  $('.send.message').on('click', function(){
    var text = $('#textbox').val();
    text = htmlEscape(text);
    sendMessage(text);
    $("#textbox").val("");
  });

  $('.send.room').on('click', function(){
    var name = $('#newRoom').val();
    name = htmlEscape(name);
    user.createRoom(name);
    $('#newRoom').val('');
  });

  

  var sendMessage = function(msg){
    var message = {
      'username': location.search.split("=")[1],
      'text': msg,
      'roomname': user.currentRoom
    };

    console.log(message);

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
      }
    });
  };

  var htmlEscape = function(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };
  
  var fetch = function(data){
    var roomMsgs = [];
    for (var i=0; i<data.results.length && roomMsgs.length < 10; i++){
      if(user.currentRoom === "" || data.results[i]["roomname"] === user.currentRoom){
        roomMsgs.push(data.results[i]);
      }
     
    }
    display(roomMsgs);
  };

  var display = function(msgs){
    $(".messages").empty();
    var messageHTML;
    for (var i=msgs.length-1; i >= 0; i--){
      messageHTML = '<li>' + '<b>' + htmlEscape(msgs[i].username) + ': ' + '</b>' + htmlEscape(msgs[i].text) + '</li>';
      $(".messages").prepend(messageHTML);
    }
    
  };


});



