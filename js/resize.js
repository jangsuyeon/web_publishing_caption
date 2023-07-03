$(function () {
  window.onresize = resize;
  resize();
});

function resize() {
  var h =
    window.innerHeight ||
    window.document.documentElement.clientHeight ||
    window.document.body.clientHeight;
  var divHight = 20 + $("#div_left").height(); //20=body padding:10px
  $("#text-sec-sec").css({
    "min-height": h - divHight + "px",
  });
  $("#div_vertical").css({
    height: h - divHight + "px",
  });
  $("#resizePanel").css({
    height: h - divHight + "px",
  });
  $("#RightPanel").css({
    height: h - divHight + "px",
    width:
      $("#text-sec-sec").width() -
      $("#resizePanel").width() -
      $("#div_vertical").width() +
      "px",
  });
}

jQuery.resizable = function (resizerID, vOrH) {
  jQuery("#" + resizerID).bind("mousedown", function (e) {
    var start = e.pageY;
    if (vOrH == "v") start = e.pageX;
    jQuery("body").bind("mouseup", function () {
      jQuery("body").unbind("mousemove");
      jQuery("body").unbind("mouseup");
    });
    jQuery("body").bind("mousemove", function (e) {
      var end = e.pageY;
      if (vOrH == "v") end = e.pageX;
      if (vOrH == "h") {
        jQuery("#" + resizerID)
          .prev()
          .height(
            jQuery("#" + resizerID)
              .prev()
              .height() +
              (end - start)
          );
        jQuery("#" + resizerID)
          .next()
          .height(
            jQuery("#" + resizerID)
              .next()
              .height() -
              (end - start)
          );
      } else {
        jQuery("#" + resizerID)
          .prev()
          .width(
            jQuery("#" + resizerID)
              .prev()
              .width() +
              (end - start)
          );
        jQuery("#" + resizerID)
          .next()
          .width(
            jQuery("#" + resizerID)
              .next()
              .width() -
              (end - start)
          );
      }
      start = end;
    });
  });
};

jQuery.resizable("div_vertical", "v");
jQuery.resizable("div_right", "h");
jQuery.resizable("div_left", "h");
