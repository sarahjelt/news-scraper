// grab articles as JSON
$.getJSON("/articles", function(data) {
  for (let i = 0; i < data.length; i++) {
    $(".stories").append("<div class='row'><div class='col l12'><div class='card'><div class='card-content'><div class='row'><div class='col l9'><p data-id='" + data[i]._id + "'><span class='card-title'>" + data[i].headline + "</span><br />" + data[i].summary + "</a><br /><br />" + "<a class='light-blue-text text-lighten-2' href='" + data[i].link + "'>" + data[i].link + "</p></div><div class='col l3'><a class='save waves-effect waves-light btn-flat right light-blue lighten-2' href='#'>Save Article</a></div></div></div></div></div></div>")
  }
});

$.getJSON("/articles-saved", function(data) {
  for (let i = 0; i < data.length; i++) {
    $(".saved-stories").append("<div class='row'><div class='col l12'><div class='card'><div class='card-content'><div class='row'><div class='col l9'><p data-id='" + data[i]._id + "'><span class='card-title'>" + data[i].headline + "</span><br />" + data[i].summary + "</a><br /><br />" + "<a class='light-blue-text text-lighten-2' href='" + data[i].link + "'>" + data[i].link + "</p></div><div class='col l3'><a class='save waves-effect waves-light btn-flat right light-blue lighten-2' href='#'>Unsave Article</a><br /><br /><a class='save waves-effect waves-light btn-flat right light-blue lighten-2' href='#'>Add Note</a></div></div></div></div></div></div>")
  }
});

// click on save button
$(document).on("click", ".save", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

    }
  })
  
});

// click on add note button
$(document).on("click", ".add-note", function() {

});

// click on remove from saved button
$(document).on("click", ".remove-saved", function() {

});

// click on X button in note
$(document).on("click", ".delete-note", function() {

});