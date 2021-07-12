//= require vendor/jquery-2.1.0.min.js
//= require vendor/jquery.ajaxchimp-1.3.0.js
//= require bootstrap
//= require vendor/bootstrap-combobox.js
//= require vendor/bootstrap-sortable.js


$(function() {
  $('.newsletter form').ajaxChimp({
    callback: function(response, element) {
      resultElement = $('.newsletter .result');

      if (response.result == 'error') {
        resultElement.text(response.msg);
      } else {
        resultElement.text(resultElement.data('success'));
        ga('send', 'event', 'newsletter_proto', 'subscribe');
      }
    }
  });
});
