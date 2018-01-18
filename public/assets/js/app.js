$(document).ready(function() {

  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".unsave", unsaveArticle);
  $(document).on("click", ".notes", notesHandler);
  $(document).on("click", ".add-note", addNote);
  $(document).on("click", ".deleter", deleteNote);
  $(document).on("click", ".scrape", scrapeArts);


  initialize();
  renderSavedArts();

  $('.modal').modal();

  function initialize() {
    console.log("initializing...");

    $(".stories").empty();

    // grab articles as JSON from articles API
    $.getJSON("/api/unsaved-articles", function(data) {
      for (let i = 0; i < data.length; i++) {
        $(".stories").prepend("<div class='row'><div class='col l12'><div class='card'><div class='card-content'><div class='row'><div class='col l9'><p class='article' data-id='" + data[i]._id + "'><span class='card-title'>" + data[i].headline + "</span><br />" + data[i].summary + "</a><br /><br />" + "<a class='light-blue-text text-lighten-2' href='" + data[i].link + "'>" + data[i].link + "</p></div><div class='col l3'><a class='save waves-effect waves-light btn-flat right light-blue lighten-2'>Save Article</a></div></div></div></div></div></div>")
      }
    })
  };

  function renderSavedArts() {
    $(".saved-stories").empty();
    // get saved articles from articles-saved API
    $.getJSON("/api/saved-articles", function(data) {
      for (let i = 0; i < data.length; i++) {
        var savePanel = $("<div class='row'><div class='col l12'><div class='card'><div class='card-content'><div class='row'><div class='col l9'><p class='article' data-id='" + data[i]._id + "'><span class='card-title'>" + data[i].headline + "</span><br />" + data[i].summary + "</a><br /><br />" + "<a class='light-blue-text text-lighten-2' href='" + data[i].link + "'>" + data[i].link + "</p></div><div class='col l3'><a class='unsave waves-effect waves-light btn-flat right deep-orange darken-3'>Unsave Article</a><br /><br /><a class='notes modal-trigger waves-effect waves-light btn-flat right light-blue lighten-2' data-id='" + data[i]._id + "' href='#modal1'>Notes</a></div></div></div></div></div></div>")
        $(".saved-stories").prepend(savePanel);
        savePanel.data("_id", data._id);
      }
    })
  };

  // scrape function
  function scrapeArts() {
    $.get("/scrape").then(function(data) {
      initialize();
    })
  };

  // click on save button on article
  function saveArticle() {
    var artSave = $(this).parents(".card-content").find("p.article").attr("data-id");

    $.ajax({
      method: "POST",
      url: "/save/" + artSave,
      data: {
        saved: true
      }
    })
    .then(initialize());
  };

  // click on unsave button on article
  function unsaveArticle() {
    var artUnsave = $(this).parents(".card-content").find("p.article").attr("data-id");

    $.ajax({
      method: "POST",
      url: "/unsave/" + artUnsave,
      data: {
        saved: false
      }
    })
    .then(renderSavedArts())
  };

  // when you click NOTES on saved article
  function notesHandler() {

    //remove data-id of add-note (from previous article that was clicked into with Notes)
    $(".add-note").attr("data-id", "");

    //data-id of article you're in
    var noteId = $(this).attr("data-id");

    //adds id of article you're in to data-id
    $(".add-note").attr("data-id", noteId);

    //empties saved-notes div of notes from previous art -- but they weren't there to begin with??
    $(".saved-notes").empty();

    $.ajax({
      method: "GET",
      url: "/api/articles/" + noteId
    })
    .then(function(data) {
      console.log(data);
      for (var i = 0; i < data.note.length; i++) {
        $(".saved-notes").prepend("<div class='to-be-deleted'><p>" + data.note[i].body + "<span class=' deleter deep-orange-text text-darken-3' data-id='" + data.note[i]._id + "'>X</span></p></div>");
      }
      // This note doesn't stick
      $("#note-content").val("");
    })

      $("#note-title").val("");
      $("#note-content").val("");
  };

  // click on ADD NOTE button in notes modal
  function addNote() {
    // var noteData;
    // var newNote = $("#note-content").val().trim();

    // if (newNote) {
    //   noteData = {
    //     _id: $(".add-note").attr("data-id"),
    //     body: newNote
    //   }
    //   $.post("/api/articles/" + noteData._id, noteData)
    //   .then(function() {
    //     $("#modal1").hide();
    //     console.log("yeah man we've added a note")
    //   })
    // }
    var artNotes = $(this).attr("data-id");
    console.log(artNotes);
    $.ajax({
      method: "POST",
      url: "/api/articles/" + artNotes,
      data: {
        body: $("#note-content").val()
      }
    })
    .then(function(data) {
      var newHotness = $("#note-content").val();
      console.log(data);
      $(".saved-notes").prepend("<div class='to-be-deleted'><p>" + newHotness + "<span class=' deleter deep-orange-text text-darken-3' data-id='" + data.note.slice(-1)[0] + "'>X</span></p></div>");
      // This note is undefined, can't get body through post route

      //empties text input
      $("#note-content").val("");
    })
  };

  // click on X next to notes -- doesn't work yet
  function deleteNote() {
    var toBeDeleted = $(this).find(".to-be-deleted");
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
      type: "GET",
      url: "/delete/" + thisId,
      success: function(response) {
        toBeDeleted.remove();
        $("#note-content").val("");
      }
    })
  };


});