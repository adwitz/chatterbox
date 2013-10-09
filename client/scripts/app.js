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
    this.friends = {};
    this.currentRoom = currentRoom || "";
  }

  User.prototype.createRoom = function(name){
    this.currentRoom = name;
  }

  var user = new User(currentRoom);

  var fetchAndDisplayWrapper = function(){
    $.get('https://api.parse.com/1/classes/chatterbox?order=-createdAt', function(data){
      var roomMsgs = fetch(data);
      display(roomMsgs);
      showRooms(data);
    })
  };

  fetchAndDisplayWrapper();
  setInterval(fetchAndDisplayWrapper
  , 1000);

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
    return roomMsgs;
  };

  var display = function(msgs){
    $(".messages").empty();
    var messageHTML = '';
    var name = '';
    var isFriend = false;
    for (var i=msgs.length-1; i >= 0; i--){
      name = htmlEscape(msgs[i].username);
      isFriend = (user.friends[name]) ?  true : false; 
      messageHTML = '<li>' + (isFriend ? "<b>" : "") + "<span class = 'clickableUser'>" + name + '</span>: ' + htmlEscape(msgs[i].text) + (isFriend ? "</b>" : "") +'</li>';
      $(".messages").prepend(messageHTML);
    }
    
  };

  $('.messages').on('click', '.clickableUser', function(){
    var name = this.innerHTML;

    if (user.friends[name] === undefined){
      user.friends[name] =  true;
      console.log("yo, we just added a friend!");
    } else {
      user.friends[name] = undefined;
    }
    //add friend
       //check if already present
    
  });


  var showRooms = function(data){
    var rooms = {};
    var name;
    var counter = 0;
    $(".rooms").empty();

    for(var i=0; i < data.results.length; i++){
      name = htmlEscape(data.results[i]['roomname']);
      if(rooms[name] === undefined){
        rooms[name] = true;
      }
    }

    for(var room in rooms){
      var $button= $('<input/>').attr({ type: 'button', id:'btn_'+counter, class: 'joinRooms', value:'Join'});
      var $room = $("<li class='chatRoom'>" + room + "</li>");
      $('.rooms').append($room)
      $($room).append($button);
       // $(".rooms").append("<li class='chatRoom'>" + room + "</li>").append(
       //   '<button/>', 
       //   {
       //   text: "Join", //set text 1 to 10
       //   id: 'btn_'+counter,
       //   click: function () { alert('btn_' + counter); }
       //   }

       //);
       //console.log('here');
       counter++;
      //$(".rooms").append("<li class='chatRoom'>" + room + "</li><button class='button'> Join </button><br>");
    }
  };

  $('.rooms').on('click', '.joinRooms', function(){
    user.currentRoom = $(this).parent().text();
  });

});



