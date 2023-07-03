const tabList = document.querySelectorAll(".tab_menu .list li");
const contents = document.querySelectorAll(".tab_menu .cont_area .cont");
let activeCont = ""; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

for (var i = 0; i < tabList.length; i++) {
  tabList[i].querySelector(".btn").addEventListener("click", function (e) {
    e.preventDefault();
    for (var j = 0; j < tabList.length; j++) {
      // 나머지 버튼 클래스 제거
      tabList[j].classList.remove("is_on");

      // 나머지 컨텐츠 display:none 처리
      contents[j].style.display = "none";
    }

    // 버튼 관련 이벤트
    this.parentNode.classList.add("is_on");

    // 버튼 클릭시 컨텐츠 전환
    activeCont = this.getAttribute("href");
    changeTabEvent(activeCont);
    document.querySelector(activeCont).style.display = "block";
  });
}


$(document).ready(function () {
  let timer
  $("html").click(function () {
    clearTimeout(timer)
    $(".changeMode").addClass("show");
    if($(".changeMode").hasClass("show")) {
      timer = setTimeout(function() {
        $(".changeMode").removeClass("show");
      }, 3000);
    }
  });



  $(".setbtn").click(function () {
    if ($(this).hasClass("active")) {
      if ($(".tab-section").is(":visible") === true) {
        $(".tab-section").hide();
        $(".text-section").css({ width: "100%" });
        $(this).addClass('hide')
      } else {
        $(".tab-section").show();
        $(".text-section").css({ width: "calc(100% - 380px)" });
        $(this).removeClass('hide')
      }
    } else {
      $(".tab-section").show();
      $(".text-section").css({ width: "calc(100% - 380px)" });
      changeMode(document.querySelector("#bigChange"));
    }
  });
  $(".setbtn-mode").click(function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $(".tab-section").show();
    } else {
      $(".tab-section").hide();
    }
  });

  // hover event
  $(".setting-warning").mouseenter(function (event) {
    event.preventDefault();
    $(".setting-hover").css({
      display: "block",
    });
  });
  $(".setting-warning").mouseleave(function (event) {
    event.preventDefault();
    $(".setting-hover").css({
      display: "none",
    });
  });

  // function switchBtn() {
  //   var element = document.querySelector(".swichbtn");
  //   element.parentNode.classList.toggle("right");
  // }

  // 설정 스위치 버튼
  $(".swichbox").click(function () {
    if (!system_ready) {
      systemAlertOn("시스템이 준비 되지 않았습니다. 잠시 후 시도해주시기 바랍니다.");
    } else {
      const idx = $(".swichbox").index();
      $(this).eq(idx).toggleClass("right");
      if ($(this).hasClass("right")) {
        $(this).children().eq(0).addClass("font-color");
        $(this).children().eq(1).removeClass("font-color");
      } else {
        $(this).children().eq(1).addClass("font-color");
        $(this).children().eq(0).removeClass("font-color");
      }
    }
  });

  // $(".select-choice").click(function () {
  //     // if($(".select-choice").not(".select-choice")){
  //     $(this).siblings(".select-list").toggle();
  //     // }
  //     if ($(".select-list").is(":visible")) {
  //         $(this).children().addClass("active");
  //     } else {
  //         $(this).children().removeClass("active");
  //     }
  // });
  // $('html').click(function (e) {
  //     if ($(e.target).parents('.select-choice').length < 1) {
  //         $(".select-list").hide();
  //         $(".select-arrow").removeClass("active");
  //     }
  // });

  // 셀렉트 수정 후
  $(".select-choice").click(function () {
    if ($(this).siblings(".select-list").is(":visible")) {
      $(this).siblings(".select-list").show();
    } else {
      if ($(".select-list").not(".select-list")) {
        $(".select-list").hide();
      }
    }
    $(this).siblings(".select-list").toggle();
    if ($(".select-list").is(":visible")) {
      $(this).children().addClass("active");
    } else {
      $(this).children().removeClass("active");
    }
  });
  $("html").click(function (e) {
    if ($(e.target).parents(".select-choice").length < 1) {
      $(".select-list").hide();
      $(".select-arrow").removeClass("active");
    }
  });

  // 목록 icon
  $(document).on("click", ".note-record-top", function () {
    // $(".note-record-top").click(function(){
    $(this)
      .parents()
      .parents()
      .siblings()
      .children()
      .children(".more-icon-box")
      .stop()
      .hide();
    // $(this).children().children(".note-title-more").toggleClass("active");
    $(this).siblings(".more-icon-box").stop().toggle();
    // $(this).parents(".note-record").toggleClass("border-change");
    if ($(this).siblings(".more-icon-box").is(":visible") == false) {
      $(this).parents(".note-record").addClass("border-change");
      $(this).children().children(".note-title-more").addClass("active");
    } else {
      $(".note-record").removeClass("border-change");
      $(".note-title-more").removeClass("active");
    }
    $(this).parents(".note-record").toggleClass("border-change");
    $(this).children().children(".note-title-more").toggleClass("active");
    if ($("#list-all-selectbtn").hasClass("active")) {
      $(".more-icon-box").stop().hide();
      $(".note-record").removeClass("border-change");
      $(".note-title-more").removeClass("active");
    }
  });

  // $(".note-record-top").click(function(){
  //   $(this).parents().siblings().children(".more-icon-box").stop().slideUp();
  //   $(this).siblings(".more-icon-box").stop().slideToggle();
  //   $(".note-title-more").toggleClass("active");
  //   $(this).parents().toggleClass("border-change");
  //   if($(this).siblings().is(':visible') == "false"){
  //     $(this).parents().removeClass("border-change");
  //    }else{
  //     $(this).parents().addClass("border-change");
  //   }
  //   if($("#list-all-selectbtn").hasClass("active")){
  //     $(".more-icon-box").stop().hide();
  //     $(this).parents().removeClass("border-change");
  //     $(".note-title-more").removeClass("active");
  //   }
  // });

  // 목록 click event, checkbox click event
  $(document).on("click", "#list-all-selectbtn", function (e) {
    // $("#list-all-selectbtn").click(function(){
    $(".more-icon-box").stop().hide();
    $(".note-title-more").removeClass("active");
    $(".note-record").removeClass("border-change");
    $(this).siblings(".checkbtn").toggle();
    $(this)
      .parents(".flex")
      .siblings(".list-scroll")
      .find(".all-checkbox")
      .toggle();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      if ($("#list-checkbox-in").is(":checked")) {
        $(".note-record").addClass("active-b");
      }
    } else {
      $(".note-record").removeClass("active-b");
      $(".checkbox-in").prop("checked", false);
      $("#tab3 .checkbtn").removeClass("active");
    }
  });
  $(document).on("click", "#tab3 .checkbtn", function (e) {
    // $("#tab3 .checkbtn").click(function(){
    if ($(this).hasClass("active")) {
      $(".checkbox-in").prop("checked", false);
      $(".note-record").removeClass("active-b");
    } else {
      $(".checkbox-in").prop("checked", true);
      $(".note-record").addClass("active-b");
    }
    // if($("#tab3 .checkbox-in").is(":checked").length() < 1) {
    //   $(this).addClass("active");
    // }
    $(this).toggleClass("active");
  });

  // $(".agree label").click(function(e){
  //   e.preventDefault();
  //   var len = $("#list-checkbox-in").length;
  //   var chklen = $(".container .checked").length;
  //   var unchk = len - chklen;
  //   if(unchk == 0){
  //       $("#total label .chkbox").addClass("checked");
  //       $("#total label input[type='checkbox]").attr("checked","checked");
  //   }else{
  //       $("#total label .chkbox").removeClass("checked");
  //       $("#total label input[type='checkbox]").removeAttr("checked");
  //   }
  // });

  // $(document).on('click', '#tab3 .all-checkbox', function(e){
  //   e.preventDefault();
  //   var len = $("#list-checkbox-in").length;
  //   var chklen = $("#list-checkbox-in:checked").length;
  //   var unchk = len - chklen;
  //   if(unchk == 0){
  //     $(".checkbtn").addClass("active");
  //     $(".checkbox-in").prop("checked", true);
  //   }else{
  //     $(".checkbtn").removeClass("active");
  //     $(".checkbox-in").prop("checked", false);
  //   }
  // });

  $(document).on("change", "#tab3 .checkbox-in", function (e) {
    // $("#tab3 .checkbox-in").click(function(){

    if ($(this).is(":checked")) {
      $(this).parents().siblings(".note-record").addClass("active-b");
    } else {
      $(this).parents().siblings(".note-record").removeClass("active-b");
    }
  });
  // 자주쓰는단어 click event
  $(document).on("click", "#word-all-selectbtn", function (e) {
    // $("#word-all-selectbtn").click(function(){
    $(this).siblings(".checkbtn").toggle();
    $(this)
      .parents(".flex")
      .siblings(".word-list")
      .find(".all-checkbox")
      .toggle();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      if ($("#word-checkbox-in").is(":checked")) {
        $(".word-input-selectbox").addClass("active-b");
      }
      $(".word-input-selectbox").addClass("active");
      $(".word-input-trash").show();
    } else {
      $(".word-input-selectbox").removeClass("active");
      $(".word-input-trash").hide();
      $(".word-input-selectbox").removeClass("active-b");
      $(".checkbox-in").prop("checked", false);
      $("#tab4 .checkbtn").removeClass("active");
    }
  });
  $(document).on("click", "#tab4 .checkbtn", function (e) {
    // $("#tab4 .checkbtn").click(function(){
    if ($(this).hasClass("active")) {
      $(".checkbox-in").prop("checked", false);
      $(".word-input-selectbox").removeClass("active-b");
    } else {
      $(".checkbox-in").prop("checked", true);
      $(".word-input-selectbox").addClass("active-b");
    }
    $(this).toggleClass("active");
  });

  $(document).on("change", "#tab4 .checkbox-in", function (e) {
    // $("#tab4 .checkbox-in").change(function(){
    if ($(this).is(":checked")) {
      $(this).parents().siblings(".word-input-selectbox").addClass("active-b");
    } else {
      $(this)
        .parents()
        .siblings(".word-input-selectbox")
        .removeClass("active-b");
    }
  });

  // $(".all-selectbtn").click(function(){
  //   $(".note-record").siblings().children(".more-icon-box").stop().slideUp();
  //   $(".note-record").removeClass("border-change");
  //   $(".checkbtn").toggle();
  //   $(".all-checkbox").toggle();
  //   $(this).toggleClass("active");
  //   $(".more-icon-box").css({display: "none"});
  //   if($(this).hasClass("active")){
  //     $(".word-input-selectbox").addClass("active");
  //     $(".word-input-trash").show();
  //   }else{
  //     $(".word-input-selectbox").removeClass("active");
  //     $(".word-input-trash").hide();
  //   }
  // });
  // $("#tab3 .checkbtn").click(function(){
  //   if($(this).hasClass("active")) {
  //     $(".checkbox-in").prop("checked", false);
  //   }else{
  //     $(".checkbox-in").prop("checked", true);
  //   }
  //   $(this).toggleClass("active");
  //   // if($(".checkbox-in").is(":checked")) {
  //   //   $(".note-record, .word-input-selectbox").css({border : "1px solid #335FFF"});

  //   // }else{
  //   //   $(".note-record").css({border : "none"});
  //   //   // $(".word-input-selectbox").css({border: "1px solid #99A5B8"});
  //   // }
  // });

  // $(".checkbox-in").change(function(){
  //   if($(".checkbox-in").is(":checked")) {
  //     $(".note-record, .word-input-selectbox").addClass("active-b");
  //   }else{
  //     // $(".note-record").css({border : "none"});
  //     // $(".word-input-selectbox").css({border: "1px solid #99A5B8"});
  //     $(".note-record, .word-input-selectbox").removeClass("active-b");
  //   }
  // });

  // 자주쓰는단어 click event
  // $(document).on('click', '#word-all-selectbtn', function(e) {
  //   $(".word-input-selectbox").toggleClass("active");
  //   $(".word-input-select").attr("readonly", true);
  // })

  // modal

  // window.onclick = function(event) {
  //     if (event.target.className === "modal") {
  //         event.target.style.display = "none";
  //     }
  // }

  // $(".playbtn").click(function(){
  //   $(".recordbtn").toggleClass("play");
  //   $(".recordbtn").removeClass("pause stop");
  // });
  // $(".pausebtn").click(function(){
  //   $(".recordbtn").toggleClass("pause");
  //   $(".recordbtn").removeClass("play stop");
  // });
  // $(".stopbtn").click(function(){
  //   // $(".recordbtn").toggleClass("stop");
  //   $(".recordbtn").removeClass("pause play");
  //   $(".playbtn, .pausebtn").removeClass("active");
  // });
});

function fnHidePop(modalId) {
  $("#" + modalId).removeClass("on");
  $(".memobtn").removeClass("active");
}

function fnShowPop(modalId, id, title) {
  if (modalId === "admin") adminSettingF();
  if (modalId === "shareStart") cancelShareEnd();
  if (modalId === "sharePasteURLComplete") pasteURL();
  if (modalId === "file_title") noteTitleF(id, title);
  if (modalId === "delete_note") deleteNoteF(id, title);
  if (modalId === "list_export") exportNoteF(id);
  if (modalId === "list_export_select" || modalId === "delete_note_select") {
    modalId = modalId.split("_")[0] + "_" + modalId.split("_")[1];
    let checkmode = $(".list-btn.all-selectbtn")[0].className;
    if (!checkmode.includes("active")) {
      // alert('선택 모드가 아닙니다.')
      systemAlertOn("선택 모드가 아닙니다.");
      return;
    }
    let list = $(".note-list").find("input");
    let list_count = 0;
    for (let i = 0; i < list.length; i++) {
      if ($(".NoteItemNumber-" + String(i)).is(":checked")) {
        list_count += 1;
      }
    }
    if (list_count === 0) {
      // alert("선택된 노트가 없습니다.")
      systemAlertOn("선택된 노트가 없습니다.");
      return;
    }
    if (modalId === "delete_note") deleteNoteSelectF(id, list_count);
  }
  if (modalId === "word_delete_select") {
    let checkmode = $(".list-btn.word-checkbtn")[0].className;
    if (!checkmode.includes("active")) {
      // alert('선택 모드가 아닙니다.')
      systemAlertOn("선택 모드가 아닙니다.");
      return;
    }
    let list = $(".word-list").find(".word-checkbox");
    let list_count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked) {
        list_count += 1;
      }
    }
    if (list_count === 0) {
      // alert("선택된 단어가 없습니다.")
      systemAlertOn("선택된 단어가 없습니다.");
      return;
    }
    deleteWordSelectF(list_count);
  }
  $("#" + modalId).addClass("on");
  $(".memobtn").addClass("active");
}

// function clickBtn(clickBtn) {
//     if ($("." + clickBtn).not("." + clickBtn)) {
//         $("." + clickBtn).toggleClass("active")
//         $("." + clickBtn).siblings().removeClass("active");
//     }
// }

// active event
$(document).on("click", ".all-selectbtn-share", function (e) {
  $(this).toggleClass("active");
});

$(document).on("click", ".share-translation-btn", function (e) {
  $(this).toggleClass("active");
});
