const app = {};

// submit button
// text box
// auto-refresh

app.init = function() {
  $('#send').click(app.handleSubmit);
  $('.room-selector').click(app.roomSelect);
  $('#refresh').click(() => app.fetch(app.params, app.render));
  $(document).on('click','.username', app.handleUsernameClick);
  app.fetch(app.params, app.render);
};

// app.server = 'http://parse.sfm6.hackreactor.com/';
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.render = function(data) {
  for (let message of data.results) {
    app.renderMessage(message);
    app.renderRoom(message.roomname);
  }
};

app.friends = {};

app.handleUsernameClick = function(event) {
  var username = event.target.innerHTML;
  if (!(username in app.friends)){
    app.friends[username] = username;
  // <li class="list-group-item">Cras justo odio</li>
    $("#friends-list").append(`<h6 class="list-group-item text-left border-0">${username}</h6>`)
    console.log("friendslist", app.friends)
  }
  // console.log('hello world');
};

app.handleSubmit = function(event) {
  let message = {
    username: app.username,
    text: $('#message-text').val(),
    roomname: $('#roomname-text').val(),
  };
  app.send(message);
  app.fetch(app.params, app.render);
};

app.params = {
  order: '-createdAt',
  limit: 100,
  // where: { roomname: '4chan' },
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
  app.clearMessages();
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    data: params,
    success: (data) => {
      console.log(app.params)
      console.log(data);
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
    $('#chats').hide().append(
      `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start px-5">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 username">${message.username}</h5>
          <small>${moment(message.createdAt).fromNow()}</small>
        </div>
        <p class="mb-1">${message.text}</p>
        <small>${message.roomname}</small>
      </a>`
    ).fadeIn();
  }
};

var roomNamesObject = {};

app.renderRoom = function(roomName) {
  if (!(roomName in roomNamesObject)) {
    roomNamesObject[roomName] = roomName;
    $('#roomSelect').append(`<a class="dropdown-item room-selector" href="#" onclick='app.roomSelect("${roomName}")'>${roomName}</a>`);
  }
};

app.roomSelect = function(roomName) {
  app.params.where = { roomname: roomName };
  app.fetch(app.params, app.render);
};

app.username = '';

$( document ).ready(function() {
  app.username = window.location.search.replace('?username=', '').replace('%20', ' ');
  app.init();
});