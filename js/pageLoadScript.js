

var onlineStreamer = new Array();
var offlineStreamer = new Array();
var onlineStreamerTwitchEmbed = new Array();
var onlineStreamerCheckbox = new Array();
var multiStreamLink = "https://multistre.am/";
var multiLinkArray = new Array();


function speacialCard()
{
  $.ajax({
    type: "GET",
    url: "pages/special.txt",
    success: displaySpecialCard,
    accept: 'application/vnd.twitchtv.v5+json',
    error: function(jqXHR, textStatus, error)
    {
      console.log(error);
    }
  })
}

function displaySpecialCard(incomingData)
{
  var data = JSON.parse(incomingData);
  if(data.length == 0)
  {
    loopStreamers();
  }else{
    if(data.length == 1)
    {
      $("#specialAnnouncementHeader").append("Special Announcement")
    } else
    {
      $("#specialAnnouncementHeader").append("Special Announcements");
    }
    for(i in data)
    {
      if(data[i].link == "")
      {
        if(data[i].img == "")
        {
          $("#specialAnnouncementCenter").append(`
            <div class="speacialCard_noLink" id="${data[i].username}">
            <div class="specialDescription">${data[i].description}</div>
            </div>`);
          }else{
            $("#specialAnnouncementCenter").append(`
              <div class="speacialCard_noLink" id="${data[i].username}">
              <div class="specialDescription">${data[i].description}</div>
              <div class="specialImage"><img src="../content/${data[i].img}"></div>
              </div>`);
            }
          }else{
            if(data[i].img == "")
            {
              $("#specialAnnouncementCenter").append(`
                <div class="speacialCard" id="${data[i].username}">
                <div class="specialDescription">${data[i].description}</div>
                <div class="specialLinkName">
                <a href="${data[i].link}">${data[i].link_description}</a>
                </div>
                </div>`
              );
            }else{
              $("#specialAnnouncementCenter").append(`
                <div class="speacialCard" id="${data[i].username}">
                <div class="specialDescription">${data[i].description}</div>
                <div class="specialLinkName">
                <a href="${data[i].link}">${data[i].link_description}</a>
                </div>
                <div class="specialImage"><img src="../content/${data[i].img}"></div>
                </div>`
              );
            }


          }

        }
        loopStreamers();
      }
    }

    function loopStreamers()
    {
      $.ajax({
        type: "GET",
        url: "pages/streamers.txt",
        accept: 'application/vnd.twitchtv.v5+json',
        success: getID,
        error: function(jqXHR, textStatus, error){
          console.log(error);
        }
      });
    }

    function getID(incomingData)
    {
      var streamers = new Array();


      streamers = incomingData.split("\n");
      $('#potatoCount').append(`${streamers.length}`);

      for(i = 0; i < streamers.length; i++)
      {

        incomingStreamers = streamers[i]
        streamsURL = "https://api.twitch.tv/helix/users?login=" + incomingStreamers

        //console.log(channelURL)

        $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk", "Accept": "application/vnd.twitchtv.v5+json"}});

        $.ajax({
          type: "GET",
          url: streamsURL,
          success: function(data){

            //console.log(data)
            if (data.data.length != 0)
            {
              var desiredOutput = (data.data[0].id)

              console.log(desiredOutput)
              getStream(desiredOutput)
            }

          },
          error: function(jqXHR, textStatus, error){console.log(error); console.log("Error")}
        });

      }
    }

    function getStream(incomingData)
    {

      twitchStreams = "https://api.twitch.tv/kraken/streams/"
      twitchChannels = "https://api.twitch.tv/kraken/channels/"

      //console.log(channelURL)

      $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk", "Accept": "application/vnd.twitchtv.v5+json"}});

      $.ajax({
        type: "GET",
        url: twitchStreams + incomingData,
        success: function(data){
          console.log(data)
          if (data.stream != null)
          {
            pushOnlineStreamer(data.stream, data.stream.channel);
          }else{
            channelURL = twitchChannels + incomingData
            getTwitchChannels(channelURL)
          }

        },
        error: function(jqXHR, textStatus, error){console.log(error); console.log("Error")}
      });




      /*$.ajax({
      type: "GET",
      url: twitchChannel,
      accept: 'application/vnd.twitchtv.v5+json',
      success: function(data) {
      getStreamerStreams(data, streamerNames, twitchStreams, twitchUsers);

    },
    error: function(jqXHR, textStatus, error){console.log(error);}

  });*/


  //  }
  //);
}

function getTwitchChannels(channel)
{
  //var streamerNames = namesData;
  //ar channelData = data;
  //var twitchStreamLink = tsl;
  //var twitchUserLink = tul;
  //console.log(channel)
  $.ajaxSetup({headers:{"Client-ID": "eu8zhc3k49ubec2brcpc824bhetvrk", "Accept": "application/vnd.twitchtv.v5+json"}});

  $.ajax({
    type: "GET",
    url: channel,
    success: function(data)
    {
      //console.log(data);
      if(data != null)
      {
        //console.log(channel)
        pushOfflineStreamer(data)
      }

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
    accept: 'application/vnd.twitchtv.v5+json',
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

function pushOnlineStreamer(sD, cD)
{

  var channelData = cD;
  var streamData = sD;


  var activeStreamer = {
    channelData: channelData,
    streamData: streamData
  };
  onlineStreamer.push(activeStreamer);
}

function pushOfflineStreamer(cD)
{
  var channelData = cD;
  //console.log(cD)

  var nonActiveStreamer = {
    channelData: channelData,
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

  if(channelObject.description == "")
  {
    userBio = channelObject.display_name + " has no bio. Check out their stream to find out more!";
  }else{
    userBio = channelObject.description;
  }

  if(channelObject.display_name == "Kellummaul" ||
  channelObject.display_name == "Beldarean1" ||
  channelObject.display_name == "DaddyCroon" ||
  channelObject.display_name == "Drac346")
  {

    $('#streamerOnline').append(
      `<div id="${channelObject.display_name.toLowerCase()}" class="streamerCard">
      <div class="streamer_name_founder"><b>${channelObject.display_name}</b></div>
      <div class="streamer_logo"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
      <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewers}</img></div>
      <div class="streamer_game">${streamObject.game}</div>
      <div class="streamer_title">${channelObject.status}.</div>
      <div class="streamer_description">${userBio}</div>
      <div class="streamer_embed"><div id="${channelObject.display_name}embedID"></div>
      </div>`
      //<a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
    );
  }else {
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




}

function printDataUserOffline(nonActiveStreamer)
{
  var channelObject = nonActiveStreamer.channelData;

  var userBio = "";

  if(channelObject.description == "")
  {
    userBio = channelObject.display_name + " has no bio. Check out their stream to find out more!";
  }else{
    userBio = channelObject.description;
  }
  if(channelObject.display_name == "Kellummaul" ||
  channelObject.display_name == "Beldarean1" ||
  channelObject.display_name == "DaddyCroon" ||
  channelObject.display_name == "Drac346")
  {
    $('#streamerOffline').append(
      `<div id="${channelObject.display_name.toLowerCase()}" class="streamerCardOffline">
      <div class="streamer_name_offline_founder"><b>${channelObject.display_name}</b></div>
      <div class="streamer_logo_offline"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
      <div class="streamer_description_offline">${userBio}</div>
      <div class="streamer_offline_message">${channelObject.display_name} is Offline!</div>
      </div>`
    );
  }else {
    $('#streamerOffline').append(
      `<div id="${channelObject.display_name.toLowerCase()}" class="streamerCardOffline">
      <div class="streamer_name_offline"><b>${channelObject.display_name}</b></div>
      <div class="streamer_logo_offline"><a href=${channelObject.url} target="_blank"><img class="user_image" src=${channelObject.logo}></img></a></div>
      <div class="streamer_description_offline">${userBio}</div>
      <div class="streamer_offline_message">${channelObject.display_name} is Offline!</div>
      </div>`
    );
  }
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
  var twitchStreamPlaying = false;

  for(i in onlineStreamerTwitchEmbed)
  {
    if(!onlineStreamerTwitchEmbed[i].isPaused())
    {
      twitchStreamPlaying = true;
    }
  }

  if($("#refreshToggle").is(":checked") && twitchStreamPlaying == false)
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

function updateMultiLink()
{
  multiStreamLink = "https://multistre.am/";

  for( i in multiLinkArray)
  {
    multiStreamLink += multiLinkArray[i] + "/";
  }

  $("#multiStreamLinkURL").attr("href", multiStreamLink);

}




$(document).ajaxStop(function()
{
  offlineStreamer.sort(function(a, b)
  {
    if(a.channelData.display_name.toLowerCase() < b.channelData.display_name.toLowerCase())
    {
      return -1;
    }
    if(a.channelData.display_name.toLowerCase() > b.channelData.display_name.toLowerCase())
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
      onlineStreamerTwitchEmbed.push(player);
      //console.log(onlineStreamer[i].streamData.viewers)

      $("#multiLinkOptions").append(
        `<div class="optionMenuTitle" stream='${onlineStreamer[i].channelData.display_name}' id='multiLink-${onlineStreamer[i].channelData.display_name}'><b>${onlineStreamer[i].channelData.display_name}</b> <br> ${onlineStreamer[i].streamData.game}</div>`
        //<div class="optionMenuSetting" id="multiLinkCheckboxDiv-${onlineStreamer[i].channelData.display_name}"><input type="checkbox" class="multiLinkCheckBoxClass" id="multiLinkCheckbox-${onlineStreamer[i].channelData.display_name}"></div>`
      );

    }


    $("#multiStreamLinkURL").attr("href", multiStreamLink);
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
  $.ajaxSetup({ cache: false });
  $("#multiStreamLinkURL").fadeOut();
  speacialCard();

  cookieLoad()

  $("#refreshToggle").change(cookieSwap);



  $("#offlineStreamerSearch").on("input", searchBarUpdate);
  $("#optionsButton").click(openPanel);
  $("#closeOverlayButton").click(closePanel);
  setInterval(function() {
    refresh()
  }, 600000);


  $(document).on("click", ".optionMenuTitle", function()
  {
    if(multiLinkArray.indexOf($(this).attr("stream")) == -1)
    {
      if($(this).attr("id") != "refreshOptionTitle")
      {
        if(multiLinkArray.length == 0)
        {
          $("#multiStreamLinkURL").fadeIn();
        }
        multiLinkArray.push($(this).attr("stream"));
        $(this).css("border-color","white");
      }
    }else {
      if($(this).attr("id") != "refreshOptionTitle")
      {
        targetToRemove = $(this).attr("stream");
        multiLinkArray.splice($.inArray(targetToRemove, multiLinkArray), 1);
        $(this).css("border-color","black");
        if(multiLinkArray.length == 0)
        {
          $("#multiStreamLinkURL").fadeOut();
        }
      }
    }

    updateMultiLink();
  });

  $("#testing").append(`"<img src="content/potato.png">"`);

});

