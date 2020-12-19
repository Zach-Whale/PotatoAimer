

var onlineStreamer = new Array();
var offlineStreamer = new Array();
var onlineStreamerTwitchEmbed = new Array();
var onlineStreamerCheckbox = new Array();
var multiStreamLink = "https://multistre.am/";
var multiLinkArray = new Array();

var auth = new Array();


function listSplice(array)
{
  var index = 0;
  var arrayLength = array.length;
  var tempArray = [];

  for(index = 0; index < arrayLength; index += 100)
  {
    myChunk = array.slice(index, index+100)
    tempArray.push(myChunk);
  }

  //console.log("Here");
  //console.log(tempArray);
  return tempArray

}


function getTokens()
{
  $.get("Secure/secrets.txt", function(data)
  {
    auth=data.split("\n");
  })
}


function genericAjax(streamsURL)
{



return  $.ajax({
    type: "GET",
    headers:
    {
      "client-id": `${auth[0]}`,
      "Authorization": `Bearer ${auth[1]}`
     },
    url: streamsURL,

    error: function(jqXHR, textStatus ,error){console.log(error); console.log("Error")}
  });


}


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
      var streamers_url_list = new Array();

      streamers = incomingData.split("\n");
      $('#potatoCount').append(`${streamers.length - 1}`);

      split_array = listSplice(streamers);
      split_array.forEach(function(index) {
        sub_array=index;
        streamerStringURL=""


        sub_array.forEach(function(sub_index){

          //console.log(sub_index);
          if(sub_index != "")
          {
            streamerStringURL+="login="+sub_index+"&";
          }


        })
        streamers_url_list.push("https://api.twitch.tv/helix/users?" + streamerStringURL);
        streamers_url_list.forEach(function(index){

        });

        //console.log(streamsURL);
      });

      $.when(genericAjax(streamers_url_list[0]), genericAjax(streamers_url_list[1])).done(function(a1, a2)
      {
        userArray = a1[0].data.concat(a2[0].data)
        //console.log(userArray);
        getStream(userArray)
      });

    }









    function getStream(streamerData)
    {
      streamers_url_list = new Array();
      //console.log(streamerData);
      split_array = listSplice(streamerData);
      split_array.forEach(function(index) {
        sub_array=index;
        streamerStringURL=""

        sub_array.forEach(function(sub_index){

          if(sub_index != "")
          {
            streamerStringURL+="user_id="+sub_index["id"]+"&";
          }


        });

        streamers_url_list.push("https://api.twitch.tv/helix/streams?" + streamerStringURL);
        //console.log(streamerStringURL);
      });

      $.when(genericAjax(streamers_url_list[0]), genericAjax(streamers_url_list[1])).done(function(a1, a2)
      {
        userArray = a1[0].data.concat(a2[0].data)
        //console.log(userArray);
        toRemove = new Array();
        //getStream(userArray)
        streamerData.forEach(function(index2, item2){
          userArray.forEach(function(index, item){
            if(index !== undefined)
            {
              if(index["user_id"] == index2["id"])
              {
                pushOnlineStreamer(index, index2)
                streamerData.splice(item2, 1);
                toRemove.push(item2)
              }
            }


          });


        });

        offset = 0;
        toRemove.forEach(function(index) {
          //console.log(streamerData[index])
          //  streamerData.splice(index, 1)
        });


        streamerData.forEach(function(index){
          pushOfflineStreamer(index);
        });


      });

    }



    function pushOnlineStreamer(sD, uD)
    {

      var userData = uD;
      var streamData = sD;


      var activeStreamer = {
        userData: userData,
        streamData: streamData
      };
      onlineStreamer.push(activeStreamer);
    }

    function pushOfflineStreamer(ud)
    {
      var userData = ud;
      //console.log(cD)

      var nonActiveStreamer = {
        userData: userData,
      };
      offlineStreamer.push(nonActiveStreamer);
      //printDataUserOffline(nonActiveStreamer);

    }


    function printDataUserOnline(activeStreamer)
    {
      //var channelObject = activeStreamer.channelData;
      //console.log(channelObject);
      var streamObject = activeStreamer.streamData;
      //console.log(streamObject);
      var userObject = activeStreamer.userData;
      var userBio = "";

      if(userObject.description == "")
      {
        userBio = userObject.display_name + " has no bio. Check out their stream to find out more!";
      }else{
        userBio = userObject.description;
      }

      if(userObject.display_name == "Kellummaul" ||
      userObject.display_name == "Beldarean1" ||
      userObject.display_name == "DaddyCroon" ||
      userObject.display_name == "Drac346")
      {

        $('#streamerOnline').append(
          `<div id="${userObject.display_name.toLowerCase()}" class="streamerCard">
          <div class="streamer_name_founder"><b>${userObject.display_name}</b></div>
          <div class="streamer_logo"><a href="https://www.twitch.tv/${userObject.display_name}" target="_blank"><img src="../content/christmas.png" style="position: absolute; z-index: 2; height: 50px; transform: rotate(-20deg) translateY(-30px) translateX(5px)"><img class="user_image" src=${userObject.profile_image_url}></img></a></div>
          <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewer_count}</img></div>
          <div class="streamer_game">${streamObject.game_id}</div>
          <div class="streamer_title">${streamObject.title}.</div>
          <div class="streamer_description">${userBio}</div>
          <div class="streamer_embed"><div id="${userObject.display_name}embedID"></div>
          </div>`
          //<a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
        );
      }else if(userObject.display_name.toLowerCase() == "potatoaimerssquad")//"potatoaimerssquad")
      {
        $('#pasonlineStreamerHeader').append("Potato Aimers Squad Twitch Channel");

        $('#passtreamerOnline').append(
          `<div id="${userObject.display_name.toLowerCase()}" class="streamerCard">
          <div class="streamer_name_pas"><b>${userObject.display_name}</b></div>
          <div class="streamer_logo"><a href="https://www.twitch.tv/${userObject.display_name}" target="_blank"><img src="../content/christmas.png" style="position: absolute; z-index: 2; height: 50px; transform: rotate(-20deg) translateY(-30px) translateX(5px)"><img class="user_image" src=${userObject.profile_image_url}></img></a></div>
          <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewer_count}</img></div>
          <div class="streamer_game">${streamObject.game_id}</div>
          <div class="streamer_title">${streamObject.title}.</div>
          <div class="streamer_description">${userBio}</div>
          <div class="streamer_embed"><div id="${userObject.display_name}embedID"></div>
          </div>`
          //<a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
        );
      }else{
        $('#streamerOnline').append(
          `<div id="${userObject.display_name.toLowerCase()}" class="streamerCard">
          <div class="streamer_name"><b>${userObject.display_name}</b></div>
          <div class="streamer_logo"><a href="https://www.twitch.tv/${userObject.display_name}" target="_blank"><img src="../content/christmas.png" style="position: absolute; z-index: 2; height: 50px; transform: rotate(-20deg) translateY(-30px) translateX(5px)"><img class="user_image" src=${userObject.profile_image_url}></img></a></div>
          <div class="streamer_views"><img src="content/viewers.png" id="viewers"> ${streamObject.viewer_count}</img></div>
          <div class="streamer_game">${streamObject.game_id}</div>
          <div class="streamer_title">${streamObject.title}.</div>
          <div class="streamer_description">${userBio}</div>
          <div class="streamer_embed"><div id="${userObject.display_name}embedID"></div>
          </div>`
          //<a href=${channelObject.url} target="_blank"><img src=${streamObject.preview.medium}></img></a></div>
        );
      }




    }

    function printDataUserOffline(nonActiveStreamer)
    {
      var userObject = nonActiveStreamer.userData;

      var userBio = "";

      if(userObject.description == "")
      {
        userBio = userObject.display_name + " has no bio. Check out their stream to find out more!";
      }else{
        userBio = userObject.description;
      }
      if(userObject.display_name == "Kellummaul" ||
      userObject.display_name == "Beldarean1" ||
      userObject.display_name == "DaddyCroon" ||
      userObject.display_name == "PraefecusDrac")
      {
        $('#streamerOffline').append(
          `<div id="${userObject.display_name.toLowerCase()}" class="streamerCardOffline">
          <div class="streamer_name_offline_founder"><b>${userObject.display_name}</b></div>
          <div class="streamer_logo_offline"><a href="https://www.twitch.tv/${userObject.display_name}" target="_blank"><img src="../content/christmas.png" style="position: absolute; z-index: 2; height: 50px; transform: rotate(-20deg) translateY(-30px) translateX(5px)"><img class="user_image" src=${userObject.profile_image_url}></img></a></div>
          <div class="streamer_description_offline">${userBio}</div>
          <div class="streamer_offline_message">${userObject.display_name} is Offline!</div>
          </div>`
        );
      }else {
        $('#streamerOffline').append(
          `<div id="${userObject.display_name.toLowerCase()}" class="streamerCardOffline">
          <div class="streamer_name_offline"><b>${userObject.display_name}</b></div>
          <div class="streamer_logo_offline"><a href="https://www.twitch.tv/${userObject.display_name}" target="_blank"><img src="../content/christmas.png" style="position: absolute; z-index: 2; height: 50px; transform: rotate(-20deg) translateY(-30px) translateX(5px)"><img class="user_image" src=${userObject.profile_image_url}></img></a></div>
          <div class="streamer_description_offline">${userBio}</div>
          <div class="streamer_offline_message">${userObject.display_name} is Offline!</div>
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
        if(a.userData.display_name.toLowerCase() < b.userData.display_name.toLowerCase())
        {

          return -1;
        }
        if(a.userData.display_name.toLowerCase() > b.userData.display_name.toLowerCase())
        {
          return 1;
        }
        return 0;
      });


      onlineStreamer.sort(function(a, b)
      {
        if(a.streamData.viewer_count < b.streamData.viewer_count)
        {
          return 1;

        }
        if(a.streamData.viewer_count > b.streamData.viewer_count)
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
            channel: onlineStreamer[i].userData.display_name,
            width: 400,
            height: 300,
            autoplay: false
          };
          var player = new Twitch.Player(onlineStreamer[i].userData.display_name+"embedID", options);
          player.pause();
          player.setVolume(0);
          onlineStreamerTwitchEmbed.push(player);
          //console.log(onlineStreamer[i].streamData.viewers)

          $("#multiLinkOptions").append(
            `<div class="optionMenuTitle" stream='${onlineStreamer[i].userData.display_name}' id='multiLink-${onlineStreamer[i].userData.display_name}'><b>${onlineStreamer[i].userData.display_name}</b> <br> ${onlineStreamer[i].streamData.game}</div>`
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
      getTokens();
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
      auth=undefined
    });
