const app = {};

app.init = function() {
  $('.username').click(this.handleUsernameClick);
  $('#send .submit').submit(this.handleSubmit);
};

app.server = 'http://parse.sfm6.hackreactor.com/';

app.handleUsernameClick = function() {
  console.log('hello world');
};

app.handleSubmit = function() {
  console.log('hello world');
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    success: function (data) {
      console.log('chatterbox: Messages recieved');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  $('#chats').append(
    `<div>
      <a href="#" class="username">${message.username}</a><br>
      ${message.text}
    </div>`);
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
};