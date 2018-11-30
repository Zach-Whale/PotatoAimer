

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
    `<div id="${channelObject.display_name.toLowerCase()}" class="streamerCard">
    <div class="streamer_name"><b>${channelObject.display_name}</b></div>
    <div class="streamer_logo"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
    <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewers}</img></div>
    <div class="streamer_game">${streamObject.game}</div>
    <div class="streamer_title">${channelObject.status}.</div>
    <div class="streamer_description">${userBio}</div>
    <div class="streamer_embed"><div id="${channelObject.display_name}embedID"></div>
    </div>`
    //<a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
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
    `<div id="${channelObject.display_name.toLowerCase()}" class="streamerCardOffline">
    <div class="streamer_name_offline"><b>${channelObject.display_name}</b></div>
    <div class="streamer_logo_offline"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
    <div class="streamer_description_offline">${userBio}</div>
    <div class="streamer_offline_message">${channelObject.display_name} is Offline!</div>
    </div>`
  );
}

function searchBarUpdate()
{
    if($("offlineStreamerSearch").val != "")
    {
      $(".streamerCardOffline").show();
      $(".streamerCardoffline").not('[id*=' + $('#offlineStreamerSearch').val().toLowerCase() + ']').hide();
      $('.streamerCardOffline [id*=' + $('#offlineStreamerSearch').val().toLowerCase() + ']').show();

    }

  }

  function openPanel()
  {
    $("#navWindow").css("width", "25%");
    $(".overlay-content").show();

  }

  function closePanel()
  {
    $(".overlay-content").hide();
    $("#navWindow").css("width", "0px");
  }

  function refresh()
  {
    if($("#refreshToggle").is(":checked"))
    {
      window.location.reload(true);
    }

  }

  function cookieSwap()
  {
      Cookies.remove("refreshCookie");
      var checkedResult = false;
      if($("#refreshToggle").is(":checked"))
      {
        checkedResult = true;
      }
      Cookies("refreshCookie", checkedResult);

  }

  function cookieLoad()
  {
    var refreshCookieValue = false;
    if(Cookies.get("refreshCookie") == "true")
    {
      refreshCookieValue = true;
    }
    $("#refreshToggle").prop("checked", refreshCookieValue);


  }


$(document).ready(loopStreamers);

$(document).ajaxStop(function()
{
  offlineStreamer.sort(function(a, b)
  {
    if(a.channelData.display_name < b.channelData.display_name)
    {
      return -1;
    }
    if(a.channelData.display_name > b.channelData.display_name)
    {
      return 1;
    }
    return 0;
  });

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

if(onlineStreamer.length == 0)
{
  $("#onlineStreamerHeader").append("<b>No Streamers Online</b>");
}else{
    $("#onlineStreamerHeader").append("<b>Hot Potatoes</b>");
  for(i in onlineStreamer)
  {
    printDataUserOnline(onlineStreamer[i]);

    var options = {
      channel: onlineStreamer[i].channelData.display_name,
      width: 400,
      height: 300,
      autoplay: false
    };
    var player = new Twitch.Player(onlineStreamer[i].channelData.display_name+"embedID", options);
    player.pause();
    player.setVolume(0);
    //console.log(onlineStreamer[i].streamData.viewers)
  }
}
if(offlineStreamerHeader.length == 0)
{
  $("#offlineStreamerHeader").append("<b>No Spudz around here<b>")
}else{
    $("#offlineStreamerHeader").append("<b>Spudz<b>")
    for(i in offlineStreamer)
    {
      printDataUserOffline(offlineStreamer[i]);
    }
}

});

$(document).ready(function() {



  cookieLoad()

  $("#refreshToggle").change(cookieSwap);

  $("#offlineStreamerSearch").on("input", searchBarUpdate);
  $("#optionsButton").click(openPanel);
  $("#closeOverlayButton").click(closePanel);
  setInterval(function() {
    refresh()
  }, 600000);


});



