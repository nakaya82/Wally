var canvas = null;
var target = null;

$(function(){
  /*================================================
    ファイルをドロップした時の処理
  =================================================*/
  $('[id=drag-area]').bind('drop', function(e){
    // デフォルトの挙動を停止
    e.preventDefault();

    // ファイル情報を取得
    var files = e.originalEvent.dataTransfer.files;

    if($(this).hasClass("canvas-fld")) {
      uploadFile(files, "canvas");
    } else if ($(this).hasClass("target-fld"))  {
      uploadFile(files, "target");
    }

  }).bind('dragenter', function(){
    // デフォルトの挙動を停止
    return false;
  }).bind('dragover', function(){
    // デフォルトの挙動を停止
    return false;
  });

  /*================================================
    ボタンを押した時の処理
  =================================================*/
  $('#canvas-btn').click(function() {
    $('input[name="canvas-btn"]').click();
  });
  $('input[name="canvas-btn"]').change(function(){
    var files = this.files;
    uploadFile(files, "canvas");
  });

  $('#target-btn').click(function() {
    $('input[name="target-btn"]').click();
  });
  $('input[name="target-btn"]').change(function(){
    var files = this.files;
    uploadFile(files, "target");
  });

  $('#submit-btn').click(function() {
    doSearch();
  });


});

/*================================================
  アップロード処理
=================================================*/
function uploadFile(files, field) {
  var fd = new FormData();
  fd.append("up_file", files[0]);

  $.ajax({
    url: '/upload',
    type: 'POST',
    data: fd,
    processData: false,
    contentType: false,
  }).done(function(data) {
      alert('ファイルがアップロードされました。' );
      var block , image;
      if (field == "canvas") {
        block = $(".canvas-fld");
        image = $(".canvas-img");
        canvas = data.match(".+/(.+?)([\?#;].*)?$")[1];
      } else if (field == "target") {
        block = $(".target-fld");
        image = $(".target-img");
        target = data.match(".+/(.+?)([\?#;].*)?$")[1];
      } else {
          return;
      }
      block.hide();
      block.css('display', 'none');
      image.attr("src", data);
      image.show();
  }).fail(function(data) {
      alert('ファイルのアップロードに失敗しました。');
  });
}

/*================================================
  探す処理実行
=================================================*/
function doSearch() {
  var data = {
      canvas: canvas,
      target: target
  }
  if (!canvas || !target) {
      alert('ファイルを設定してください');
      return;
  }
  $(function(){
       /* グレイパネル作成
        *  -------------------------------------------------------------------------------*/
       $('<div class="gray_panel" id="gray_panel"> </div>')
             .css({
                "background" : "#000",
                "opacity"  : "0.5",
                "width"   : "100%",
                "height"  : 99999,
                "position"  : "fixed",
                "top"   : "0",
                "left"   : "0",
                "display"  : "none",
                "z-index"  : "50"
             }).appendTo($("body"));
  });
  $( "#gray_panel" ).fadeIn("slow");
  $.ajax({
    url: '/dosearch',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: false,
    timeout: 300000,
  }).done(function(data) {
      alert('ウォーリー発見！');
      $( "#gray_panel" ).fadeOut("slow");
      $(".ans-img").attr("src", data);
      $(".ans-img").show();
  }).fail(function(data) {
      alert('失敗しました。' );
      $( "#gray_panel" ).fadeOut("slow");
  });
}
