const app = {};

app.init = function() {
  $('.username').click(this.handleUsernameClick);
  $('#send .submit').submit(this.handleSubmit);
  $('#roomSelect').change(this.roomSelect);
  let params = {
    order: '-createdAt',
    limit: 100,
    where: {
      // roomname: '4chan',
    },
  };
  app.fetch(params, app.render);
};

// app.server = 'http://parse.sfm6.hackreactor.com/';
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.render = function(data) {
  console.log('fetch data', data);
  for (let message of data.results) {
    app.renderMessage(message);
    app.renderRoom(message.roomname);
  }
};

app.handleUsernameClick = function() {
  console.log('hello world');
};

app.handleSubmit = function(event) {
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
      console.log('data', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(params, cb) {
  this.clearMessages();
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages?order=createdat',
    type: 'GET',
    data: params,
    success: (data) => {
      cb(data);
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
  if (message.text !== undefined) {
    message.text = message.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    $('#chats').append(
      `<div class='feed'>
        <a href="#" class="username">${message.username}</a>
        <br>
        ${message.text}
      </div>`);
  }
};

var roomNamesObject = {};

app.renderRoom = function(roomName) {
  if (!(roomName in roomNamesObject)) {
    roomNamesObject[roomName] = roomName;
    $('#roomSelect').append(`<option value=${roomName}>${roomName}</option>`);
  }
};

app.roomSelect = function() {
  app.clearMessages();
  let params = {
    order: '-createdAt',
    limit: 100,
    where: {
      roomname: this.value,
    },
  };
  app.fetch(params, app.render);
};


$( document ).ready(function() {
  app.init();
});