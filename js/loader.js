

function documentReady()
{
  var url = 'https://api.twitch.tv/helix/users?login=iluvatar_402&login=kellummaul';
  var userNames = new Array();
  var userIDs = new Array();
  var userBios = new Array();
  var userGameId = new Array();
  var userGames = new Array();
  var streamTitle = new Array();


  var xhr = new XMLHttpRequest();
  var xhr2 = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Client-ID","eu8zhc3k49ubec2brcpc824bhetvrk");
  xhr.send(null);


  xhr.onload = function()
  {
    if(this.status == 200)
    {
      var parsedResponse = JSON.parse(this.responseText);

      for(i in parsedResponse.data)
      {

        userIDs.push(parsedResponse.data[i].id);
        userNames.push(parsedResponse.data[i].display_name)
        console.log(userNames[i] + ": " + userIDs[i]);
      }

    }

    for(i in userIDs)
    {
      var url2 = 'https://api.twitch.tv/helix/streams?user_id=' + userIDs[i];
      //console.log(url2);
      xhr2.open("GET", url2, true);
      xhr2.setRequestHeader("Client-ID","eu8zhc3k49ubec2brcpc824bhetvrk");
      xhr2.send(null);
    }
  };



  xhr2.onload = function()
  {
    if(this.status == 200)
    {
      var parsedResponse2 = JSON.parse(xhr2.responseText);
      alert("Here");
      userGameId.push(parsedResponse2.data[0].game_id);

      for(i in userIDs)
      {

      console.log("game ID: " + userGameId[i]);
}
    }
  };

};
