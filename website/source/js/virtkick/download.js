// create namespace
if (!vk) var vk = {};

vk.download = (function () {
  var currentDistro = undefined;

  var hideDistro = function (distro) {
    if (distro) {
      $('.' + distro).removeClass('active');
      $('.' + distro + '-installation').addClass('hidden');
    }
  };
  return {
    showCopyTooltip: function (elem) {
      // show tooltip
      elem.tooltip({
        placement: 'top',
        trigger: 'manual',
        title: 'Press ctrl + C to copy',
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"><p></p></div></div>'
      });
      elem.tooltip('show');

      // if ctrl + c detected
      $(document).keypress("c",function (e) {
        if (e.ctrlKey) {
          var tooltipInner = $('.' + currentDistro + '-installation').find('.tooltip-inner');
          var copiedMsg = '<span class="fa fa-check"></span> Copied!';
          tooltipInner.width(tooltipInner.width());
          tooltipInner.html(copiedMsg);
        }
      });

      // on clicking anywhere hide tooltip
      var hideTooltip = function () {
        elem.tooltip('hide');
        $(document).unbind('mouseup', hideTooltip);
      }

      $(document).mouseup(hideTooltip);
    },
    showDistro: function (distro) {
      if (currentDistro !== distro) {
        if (vk.mobile.check()) {
            $('.' + distro + '-installation .copy').addClass('hidden');

            var mobileCommandElem = $('.' + distro + '-installation .mobile-command');
            mobileCommandElem.removeClass('hidden');
            mobileCommandElem.change(function () {
              var command = mobileCommandElem.data('command');
              mobileCommandElem.val(command);
            });
        } else {
          $('.' + distro + '-installation .desktop-command').removeClass('hidden');
        }
        hideDistro(currentDistro);
        $('.' + distro).addClass('active');
        $('.' + distro + '-installation').removeClass('hidden');
        currentDistro = distro;
      }
    }
  }
})();