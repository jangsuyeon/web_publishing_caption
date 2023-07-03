$(document).ready(function () {
  $('.gauge').each(function () {
    var $this = $(this);
    var per = $this.attr('per');
    $this.animate({
      width: per + "%"
    });

    $({ countNum: $(".count").text() }).animate(
      {
        countNum: per
      },
      {
        duration: 1000,
        easing: 'linear',
        step: function () {
          // $(".count").text(Math.floor(this.countNum) + "%");
          $(".count").text('1' + "%");
        },
        complete: function () {
          $(".count").text((this.countNum) + "%");
          $(".download-com").show();
          $(".download-loading").hide();
        }
      });

  });
});