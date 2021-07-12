$(function() {



  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };


  var baseData = {
    // A labels array that can contain any sort of values
    labels: $.map($(Array(kpiData.week)),function(val, i) { return "Week " + (i+1); }),
  };

  var otherData = {
    fullWidth: true,
    plugins: [
      Chartist.plugins.ctPointLabels({
        textAnchor: 'middle'
      })
    ],
    low: 0,
    showArea: true,
    lineSmooth: false,
    axisY: {
      labelInterpolationFnc: function(value) {
        return parseInt(value+0.5);
      }
    }
  };

  var createChart = function(selector, data, options) {
    chart = new Chartist.Line(selector, data, options);
    var seq = 0;
    var delays = 20;
    var durations = 1000;
    chart.on('draw', function(data) {
      seq = 0;

      if(data.type === 'line') {
        // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
        data.element.animate({
          opacity: {
            // The delay when we like to start the animation
            begin: seq * delays + 1000,
            // Duration of the animation
            dur: durations,
            // The value where the animation should start
            from: 0,
            // The value where it should end
            to: 1
          }
        });
      } else if(data.type === 'label' && data.axis === 'x') {
        data.element.animate({
          y: {
            begin: seq * delays,
            dur: durations,
            from: data.y + 100,
            to: data.y,
            // We can specify an easing function from Chartist.Svg.Easing
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'label' && data.axis === 'y') {
        data.element.animate({
          x: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 100,
            to: data.x,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'point') {
        data.element.animate({
          x1: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          x2: {
            begin: seq * delays,
            dur: durations,
            from: data.x - 10,
            to: data.x,
            easing: 'easeOutQuart'
          },
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
          }
        });
      } else if(data.type === 'grid') {
        // Using data.axis we get x or y which we can use to construct our animation definition objects
        var pos1Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis + '1'] - 30,
          to: data[data.axis + '1'],
          easing: 'easeOutQuart'
        };

        var pos2Animation = {
          begin: seq * delays,
          dur: durations,
          from: data[data.axis + '2'] - 100,
          to: data[data.axis + '2'],
          easing: 'easeOutQuart'
        };

        var animations = {};
        animations[data.axis + '1'] = pos1Animation;
        animations[data.axis + '2'] = pos2Animation;
        animations['opacity'] = {
          begin: seq * delays,
          dur: durations,
          from: 0,
          to: 1,
          easing: 'easeOutQuart'
        };

        data.element.animate(animations);
      }
    });


  }

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  var chart;
  chart = createChart('#kpi-1 .ct-chart', 
    $.extend({}, baseData, {
      series: [
        kpiData.newActivations
      ]
    })
    , $.extend({}, otherData, {
      low: kpiData.newActivations.min()/1.25,
      high: kpiData.newActivations.max()*1.25,
    }));

  chart = createChart('#kpi-2 .ct-chart', 
    $.extend({}, baseData, {
      series: [
        kpiData.websiteSessions
      ]
    })
    , $.extend({}, otherData, {
      low: kpiData.websiteSessions.min()/1.25,
      high: kpiData.websiteSessions.max()*1.25,
    }));


  chart = createChart('#kpi-3 .ct-chart', 
    $.extend({}, baseData, {
      series: [
        kpiData.subscribers
      ]
    })
    , $.extend({}, otherData, {
      low: kpiData.subscribers.min()/1.25,
      high: kpiData.subscribers.max()*1.25,
      axisY: {
        labelInterpolationFnc: function(value) {
          return value.toFixed(1) + "%";
        }
      }   
    }));

  chart = createChart('#kpi-4 .ct-chart', 
    $.extend({}, baseData, {
      series: [
        kpiData.newMailchimpSubscribers
      ]
    })
    , $.extend({}, otherData, {
      low: kpiData.newMailchimpSubscribers.min()/1.25,
      high: kpiData.newMailchimpSubscribers.max()*1.25,
    }));

  // chart = createChart('#kpi-2 .ct-chart', data, otherData);
  
  // chart = createChart('#kpi-3 .ct-chart', data, otherData);
  
  // chart = createChart('#kpi-4 .ct-chart', data, otherData);



});