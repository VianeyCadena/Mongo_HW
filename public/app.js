
function getJson() {
  $.getJSON("/articles", function(data) {
      $("#savedArticles").hide();
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class='panel panel-info'> <div class='panel-heading'><h3 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" +  "</h3></div>" + "<h5>" + "<a href='" + data[i].link + "'>" + "Article link" + '</a>' + "</h5>" +
        "<button class='btn btn-primary view-notes' type='button' data-target='#noteModal' data-toggle='modal' data-id='" + data[i]._id + "'>" + "View Notes" + "</button>" +
        "<button class=' btn btn-success save-article' type='submit' data-id='" + data[i]._id + "'>" + "Save Article" + "</button></div></div>"  + "<br>" + "<br>" + "<br>"
        
      );
    }
  });
}

getJson();

$(document).on("click", ".view-notes", function() {
  $("#notes").empty();
  $("#newNote").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .done(function(data) {
      console.log(data);

      $("#noteModal").modal("show");
      $("#newNote").append("<input id='title-input' name='title' >" + "<br>");
      $("#newNote").append("<textarea id='body-input' name='body'></textarea>" + "<br>");
      $("#newNote").append("<button data-id='" + data._id + "' class='btn btn-success save-note'>Save Note</button>");

      if (data.note.length != 0) {
      for (var i = 0; i < data.note.length; i++) {
        $("#notes").append(
          "<h3>" + data.note[i].title + "</h3>" +
          "<p>" + data.note[i].body + "</p>" +
          "<button data-id='" + data.note[i]._id + "' articleId='" + thisId + "' class='btn btn-danger delete-note'>Delete Note</button>"
        );
      }
      }
      else {
        $("#notes").append("There are currently no notes for this article" + "<br>" + "<br>");

      }
    });
});

$(document).on("click", ".save-note", function() {
  var thisId = $(this).attr("data-id");

  // Run a POST request
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#title-input").val(),
        body: $("#body-input").val()
      }
    }).done(function(data) {
      $("#notes").empty();
    });

  $("#title-input").val("");
  $("#body-input").val("");
  $("#noteModal").modal("hide");
});

$("#closeModal").on("click", function(event) {
  $("#noteModal").modal("hide");
});


$(document).on("click", ".save-article", function() {
  var thisId = $(this).attr("data-id");

  // Run POST method
  $.ajax({
      method: "POST",
      url: "/saved/" + thisId,
    })
    .done(function(data) { 
    console.log("article saved: " + data);
    });

});


$(document).on("click", ".delete-article", function() {
  var thisId = $(this).attr("data-id");

  // Run POST method
  $.ajax({
      method: "POST",
      url: "/deleteSaved/" + thisId,
    })
    .done(function(data) {
 location.reload();
    });
});

$(document).on("click", ".delete-note", function() {
  var thisId = $(this).attr("data-id");
   var articleId = $(this).attr("articleId");
console.log("inside delete-note " + thisId + " " + articleId);
  $.ajax({
      method: "DELETE",
      url: "/notes/deleteNote/" + thisId + "/" + articleId,
    })
    .done(function(data) { 
     $("#noteModal").modal("hide");
    console.log("delete successful: " + data);
    location.reload();
    });

});


 $("#view-saved").on("click", function() {
  $.getJSON("/saved", function(data) {
     $("#articles").hide();
      $("#savedArticles").show();
      $("#savedArticles").empty();
    for (var i = 0; i < data.length; i++) {
       $("#savedArticles").append("<div class='panel panel-primary'> <div class='panel-heading'><h4 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" +  "</h4></div>" + "<br>" +
      "<h5>" + "<a href='" + data[i].link + "'>" + "Article link" + '</a>' + "</h5>" +
        "<button class='btn btn-primary view-notes' type='button' data-target='#noteModal' data-toggle='modal' data-id='" + data[i]._id + "'>" + "View Notes" + "</button>" +
        "<button class='btn btn-danger delete-article' type='submit' data-id='" + data[i]._id + "'>" + "Delete Article" + "</button></div></div>"  + "<br>" + "<br>" + "<br>"
      );
    }
  });
 });
 
 
 $("#view-all").on("click", function() {
     $("#savedArticles").hide();
       $("#articles").show();
     getJson();
 })
 
 
$(document).on("click", "#run-scrape", function() {
  $("#articles").empty();
   $.ajax({
      method: "DELETE",
      url: "/articles/deleteAll" 
    }).done(function() {
      $.ajax({
        method: "GET",
        url: "/scrape"
      }).done(function(data) {
       console.log(data);
      location.reload();
      });
    
    });

});


