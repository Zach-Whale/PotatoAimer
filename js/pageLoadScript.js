

  var onlineStreamer = new Array();
  var offlineStreamer = new Array();

  function loopStreamers()
  {
    $.ajax({
      type: "GET",
      url: "pages/streamers.txt",
      success: getStreamerChannel,
      error: function(jqXHR, textStatus, error){
        console.log(error);
      }
    });
  }

  function getStreamerChannel(incomingData)
  {
    var streamerNames = new Array();

    streamerNames = incomingData.split("\n");


    streamerNames.map(streamerNames => {
      const twitchChannel =  'https://api.twitch.tv/kraken/channels/' + streamerNames,
      twitchStreams =  'https://api.twitch.tv/kraken/streams/' + streamerNames,
      twitchUsers = 'https://api.twitch.tv/kraken/users/' + streamerNames;

      $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk"}});

      $.ajax({
        type: "GET",
        url: twitchChannel,
        success: function(data) {
          getStreamerStreams(data, streamerNames, twitchStreams, twitchUsers);
        },
        error: function(jqXHR, textStatus, error){console.log(error);}

    });


  });
}

function getStreamerStreams(data, namesData, tsl, tul)
{
  var streamerNames = namesData;
  var channelData = data;
  var twitchStreamLink = tsl;
  var twitchUserLink = tul;

  $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk"}});

  $.ajax({
    type: "GET",
    url: twitchStreamLink,
    success: function(data)
    {
      getStreamerUser(data, streamerNames, channelData, twitchUserLink);
      //drawOnlineStreamers();
      //drawOfflineStreamers();

    },
    error: function(jqXHR, textStatus, error){console.log(error);}

});
}

function getStreamerUser(incomingData, namesData, cd, tul)
{
      var streamerNames = namesData;
      var channelData = cd;
      var twitchUserLink = tul;
      var streamData = incomingData;

      $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk"}});

      $.ajax({
        type: "GET",
        url: twitchUserLink,
        success: function(data)
        {
          //console.log(data);

          //drawOnlineStreamers();
          //drawOfflineStreamers();

          if(!streamData.stream)
          {

            pushOfflineStreamer(data, streamerNames, channelData);
          }else {
            pushOnlineStreamer(data, streamData, streamerNames, channelData);
          }

        },
        error: function(jqXHR, textStatus, error){console.log(error);}

    });


}

function pushOnlineStreamer(data, sD, sN, cD)
{

  var streamerNames = sN;
  var channelData = cD;
  var streamData = sD;
  var userData = data;


  var activeStreamer = {
  channelData: channelData,
  streamData: streamData.stream,
  userData: userData
  };
  onlineStreamer.push(activeStreamer);
}

function pushOfflineStreamer(data, sN, cD)
{
  var streamerNames = sN;
  var channelData = cD;
  var userData = data;

    var nonActiveStreamer = {
      channelData: channelData,
      userData: userData
      };
    offlineStreamer.push(nonActiveStreamer);
    //printDataUserOffline(nonActiveStreamer);

}


function printDataUserOnline(activeStreamer)
{
  var channelObject = activeStreamer.channelData;
  //console.log(channelObject);
  var streamObject = activeStreamer.streamData;
  //console.log(streamObject);
  var userObject = activeStreamer.userData;
  var userBio = "";

  if(userObject.bio === null)
  {
    userBio = channelObject.display_name + " has no bio. Check out their stream to find out more!";
  }else{
    userBio = userObject.bio;
  }

  $('#streamerOnline').append(
    `<div class="streamer">
    <div class="streamer_name"><b>${channelObject.display_name}</b></div>
    <div class="streamer_logo"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
    <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewers}</img></div>
    <div class="streamer_game">${streamObject.game}</div>
    <div class="streamer_title">${channelObject.status}.</div>
    <div class="streamer_description">${userBio}</div>
    <div class="streamer_embed"><a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
    </div>`
  );

}

function printDataUserOffline(nonActiveStreamer)
{
  var channelObject = nonActiveStreamer.channelData;
  var userObject = nonActiveStreamer.userData;

  var userBio = "";

  if(userObject.bio === null)
  {
    userBio = channelObject.display_name + " has no bio. Check out their stream to find out more!";
  }else{
    userBio = userObject.bio;
  }

  $('#streamerOffline').append(
    `<div class="streamer_offline">
    <div class="streamer_name_offline">${channelObject.display_name}</div>
    <div class="streamer_logo_offline"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
    <div class="streamer_description_offline">${userBio}</div>
    <div class="streamer_offline_message">${channelObject.display_name} is Offline!</div>
    </div>`
  );
}

  $(document).ready(loopStreamers);
  $(document).ajaxStop(function()
{

  onlineStreamer.sort(function(a, b)
{
  if(a.streamData.viewers < b.streamData.viewers)
  {
    return 1;
  }
  if(a.streamData.viewers > b.streamData.viewers)
  {
    return -1;
  }
  return 0;
});

  for(i in onlineStreamer)
  {
    printDataUserOnline(onlineStreamer[i]);
    //console.log(onlineStreamer[i].streamData.viewers)
  }

  for(i in offlineStreamer)
  {
    printDataUserOffline(offlineStreamer[i]);
  }

})