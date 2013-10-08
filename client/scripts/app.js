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

  var fetchAndDisplayWrapper = function(){
    $.get('https://api.parse.com/1/classes/chatterbox?order=-createdAt', function(data){
      fetch(data);

    // $.ajax({
    //   url: 'https://api.parse.com/1/classes/chatterbox',
    //   type: 'GET',
    //   data: '',
    //   contentType: 'application/json',
    //   order: 'createdAt'
    // };

    })
  };

  fetchAndDisplayWrapper();
  setInterval(fetchAndDisplayWrapper
    //function(){$.get('https://api.parse.com/1/classes/chatterbox?order=createdAt', 
    //function(data){
    //  fetch(data)})}
  , 5000);

  $('.send').on('click', function(){
    var text = $('#textbox').val();
    text = htmlEscape(text);
    sendMessage(text);
    console.log(text);
  });

  var sendMessage = function(str){
    var message = {
      'username': location.search.split("=")[1],
      'text': str,
      'roomname': currentRoom
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
    var lastTen = [];
    for (var i=0; i<10; i++){
      lastTen.push(data.results[i]);
    }

    // for (var i=data.results.length-1; i>data.results.length-11; i--){
    //   lastTen.push(data.results[i]);
    // }
    display(lastTen);
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