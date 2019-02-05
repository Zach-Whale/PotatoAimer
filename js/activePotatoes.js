$(document).ready(function()
{

  count=0;


      function loopStreamers()
      {
        $.ajax({
          type: "GET",
          url: "../pages/streamers.txt",
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

      $('#potatoCount').append(`${streamerNames.length}`);

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

          if(data.stream)
          {
            count += 1;
            updateStreamCounter();
          }

        },
        error: function(jqXHR, textStatus, error){console.log(error);}

      });
    }


    function updateStreamCounter()
    {
      $("#testingDIV").empty();
      $("#testingDIV").append("Potatoes Online: " + count);

    }

    loopStreamers();

    setInterval(function() {
      count = 0;
      loopStreamers()
    }, 900000);
});