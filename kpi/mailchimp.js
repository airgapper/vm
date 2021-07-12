var MailChimpAPI = require('mailchimp').MailChimpAPI;

if(!process.env.MAILCHIMP_APIKEY) {
    console.log("You need to set MAILCHIMP_APIKEY");
    return;
}

var apiKey = process.env.MAILCHIMP_APIKEY;

var moment = require('moment');

try { 
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

/*
api.call('campaigns', 'list', { start: 0, limit: 100 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(data); // Do something with your data!
});
*/

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}


function getSubscribers(cb) {
  function getSubsPage(start, cb) {
    api.call('lists', 'members', { id: process.env.MAILCHIMP_LISTID, opts: { start: start, limit: 100} }, function (error, data) {
      var total = data.total;
      console.error("Loading", start);

      if (error)
        cb(error, null);
      else {
        if(data.data.length == 0) {
          return cb(null, data.data);
        }
        getSubsPage(start + 1, function(err, data2) {
          if(err) return cb(err);
          
          cb(null, data.data.concat(data2));
        });
      }
    });
  }
  getSubsPage(0, function(err, data) {
    cb(err, data);
  })
}

var weekData = {};

moment.lang('us', {
    week : {
        dow : 4 // Monday is the first day of the week
    }
});


getSubscribers(function(err, data) {
  data.forEach(function(subscriber) {

    var timestamp = subscriber.timestamp_signup;
    if(!timestamp) {
      timestamp = subscriber.timestamp;
    }

    var m = timestamp.match(/^(\d+)-(\d+)/);
    var year = m[1];
    var month = m[2];

    //console.log(timestamp)
    var date = moment(timestamp, 'YYYY-MM-DD HH:mm:ss');
    //console.log(date.toString(), timestamp, date.week());

    year = date.weekYear();
    var week = date.week();

    if(!weekData[year + '-W' + week])
      weekData[year + '-W' + week] = [];
    weekData[year + '-W' + week].push(subscriber);

    weekData[year + '-W' + week].week = week;
    weekData[year + '-W' + week].year = year;
    weekData[year + '-W' + week].date = moment().day("Thursday").week(week);
  });

  var list = [];
  Object.keys(weekData).forEach(function(key) {
    list.push(weekData[key]);
  });

  list = list.sort(function(a, b) {
    if(a.year != b.year)
      return a.year - b.year;
    return a.week - b.week;
  });
  var total = 0;
  function wrap(str) {
    return '"' + str + '"';
  }

  console.log(['Year+Week', 'Monday date', 'New', 'Total', 'Growth'].map(wrap).join(';'));
  console.log(list.map(function(elem) {

    var growth = ((100 * (total + elem.length) / (total))-100).toFixed(2);
    total += elem.length;

    return [elem.year + 'W' + elem.week,  elem.date.format("MM/DD/YYYY"), elem.length, total, growth + '%'].map(wrap).join(';');
  }).join('\n'));

});
