

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

function getStreamerUser(data, namesData, cd, tul)
{
      var streamerNames = namesData;
      var channelData = cd;
      var twitchUserLink = tul;

      if(!data.stream)
      {
        var newStreamerObjectOffline = channelData;
        offlineStreamer.push(newStreamerObjectOffline);
        printDataUserOffline(newStreamerObjectOffline);
        return;
      }
      var activeStreamer = {
      channelData: channelData,
      streamData: data.stream
      };
      onlineStreamer.push(activeStreamer);
      printDataUserOnline(activeStreamer);
}


function printDataUserOnline(activeStreamer)
{
  var channelObject = activeStreamer.channelData;
  //console.log(channelObject);
  var streamObject = activeStreamer.streamData;
  //console.log(streamObject);

  $('#streamerOnline').append(
    `<div class="streamer">
    <div class="streamer_name">${channelObject.display_name}</div>
    <div class="streamer_logo"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
    <div class="streamer_views">Viewers: ${streamObject.viewers}</div>
    <div class="streamer_game">${streamObject.game}</div>
    <div class="streamer_title">${channelObject.status}.</div>
    <div class="streamer_description">!Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut</div>
    <div class="streamer_embed"><a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
    </div>`
  );

}

function printDataUserOffline(co)
{

  $('#streamerOffline').append(
    `<div class="streamer_offline">
    <div class="streamer_name_offline">${co.display_name}</div>
    <div class="streamer_logo_offline"><a href=${co.url} target="_blank"><img class="user_image" src=${co.logo}></img></a></div>
    <div class="streamer_description_offline">!Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut</div>
    <div class="streamer_offline_message">${co.display_name} is Offline!</div>
    </div>`
  );
}

  $(document).ready(loopStreamers);
