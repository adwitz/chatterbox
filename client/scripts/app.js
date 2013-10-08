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
  $.get('https://api.parse.com/1/classes/chatterbox?order=createdAt', function(data){
    fetch(data);
  });

  var fetch = function(data){
    var lastTen = [];
    for (var i=data.results.length-1; i>data.results.length-11; i--){
      lastTen.push(data.results[i]);
    }
    display(lastTen);
  };

  var display = function(msgs){
    var messageHTML;
    for (var i=0; i<msgs.length; i++){
      messageHTML = '<li>' + '<b>' + msgs[i].username + ': ' + '</b>' + msgs[i].text + '</li>';
      $(".messages").append(messageHTML);
    }
    
  };



});