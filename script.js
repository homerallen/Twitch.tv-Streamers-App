var HandlebarsTemplateCache = {
  templates: {},
  get: function(selector) {
    var template = this.templates[selector];
    if (!template) {
      template = $(selector).html();
      template = Handlebars.compile(template);
      this.templates[selector] = template;
    }

    return template;
  }
}

$(document).ready(function() {
  var compiled = HandlebarsTemplateCache.get('#listings-template');
  var arrayOfUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "PartiallyRoyal", "FromTheWolfsMouth", "brunofin", "comster404"];
  var context;
  var currentGame;
  var currentStatus;
  var longStatus = false;
  var i = 0;

  callTwitch(arrayOfUsers, i);

  function callTwitch(arrayOfUsers, i) {
    $.ajax({
      async: false,
      url: "https://wind-bow.gomix.me/twitch-api/streams/" + arrayOfUsers[i] + "?callback=?",
      arrayOfUsers: arrayOfUsers,
      currentUser: arrayOfUsers[i],
      i: i,
      dataType: 'json',
      success: function(data) {
        console.log(this.currentUser + ": " + currentGame);
        if (data.stream === null) {
          currentStatus = "offline";
          currentGame = "";
        } else if (data.status === 404) {
          currentStatus = "User Not Found";
          currentGame = "";
        } else {
          currentGame = data.stream.game + ": ";
          if (data.stream.channel.status.length > 45) {
            longStatus = true;
          }
          currentStatus = data.stream.channel.status.substring(0, 45);
          if (longStatus === true) {
            currentStatus += "...";
            longStatus = false;
          }
        }

        context = {
          user: this.currentUser,
          game: currentGame,
          status: currentStatus
        };
        $("#content").append(compiled(context));

        if (this.i < this.arrayOfUsers.length - 1) {
          callTwitch(this.arrayOfUsers, this.i + 1);
        }
      }
    });
  }
});