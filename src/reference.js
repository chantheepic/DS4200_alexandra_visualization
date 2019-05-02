
    var parking = $('.parking');
    var parkingSelector = $('.parkingselector');
    var bus = $('.bus');
    var busSelector = $('.busselector');
    var subway = $('.subway');
    var subwaySelector = $('.subwayselector');
    var time24 = 0;
    var trafficFlow;
    var dispatch = d3.dispatch('updateTable', 'viewBtnClicked');

    parkingSelector.on('click', function () {
      if (!parkingSelector.children(':checkbox')[0].checked) {
        parking.css("color", "black");
      } else {
        parking.css("color", "red");
      }
    });
    busSelector.on('click', function () {
      if (!busSelector.children(':checkbox')[0].checked) {
        bus.css("color", "black");
        var busSvg = $('#svg_bus');
        console.log(busSvg);
        busSvg.css('visibility', 'hidden');
      } else {
        bus.css("color", "green");
        var busSvg = $('#svg_bus');
        console.log(busSvg);
        busSvg.css('visibility', 'visible');
      }
    });
    subwaySelector.on('click', function () {
      if (!subwaySelector.children(':checkbox')[0].checked) {
        subway.css("color", "black");
      } else {
        subway.css("color", "blue");
      }
    });

    $(".progress").on("click", function (e) {
      var progressBarSize = $(this).width();
      var absoluteVal = e.pageX - $(this).offset().left;
      time24 = Math.round(absoluteVal * 24 / progressBarSize);
      var time100 = Math.round(time24 * 4.1666666);
      var time12;
      if (time24 < 12) {
        time12 = time24 % 12 + ' AM';
      } else {
        time12 = time24 % 12 + ' PM';
      }
      $('.progress-bar').css('width', time100 + '%').text(time12);
      dispatch.call('updateTable', null, trafficFlow);
    });


    getTrafficFlow();
    function getTrafficFlow(callback) {
      $.get("https://chanminis.online/public/api/alexandra/trafficflow/time", function (returnBody) {
        trafficFlow = returnBody;
        dispatch.call('updateTable', null, trafficFlow);
      });
    }


    dispatch.on('updateTable', function (trafficFlow) {
      $('.flowtb').each(function () {
        var id = this.id.toUpperCase();
        var flow = trafficFlow.filter(function (d) { return d.hour == time24 && d.type == id });
        if (flow[0]) {
          this.innerHTML = flow[0].total;
        } else {
          this.innerHTML = 'data missing';
        }
      });
    });
