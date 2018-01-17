$(document).ready(function() {

  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".unsave", unsaveArticle);
  $(document).on("click", ".notes", notesHandler);
  $(document).on("click", ".add-note", addNote);
  $(document).on("click", ".delete-note", deleteNote);
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
        $(".saved-stories").prepend("<div class='row'><div class='col l12'><div class='card'><div class='card-content'><div class='row'><div class='col l9'><p class='article' data-id='" + data[i]._id + "'><span class='card-title'>" + data[i].headline + "</span><br />" + data[i].summary + "</a><br /><br />" + "<a class='light-blue-text text-lighten-2' href='" + data[i].link + "'>" + data[i].link + "</p></div><div class='col l3'><a class='unsave waves-effect waves-light btn-flat right deep-orange darken-3'>Unsave Article</a><br /><br /><a class='notes modal-trigger waves-effect waves-light btn-flat right light-blue lighten-2' data-id='" + data[i]._id + "' href='#modal1'>Notes</a></div></div></div></div></div></div>")
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
    $(".add-note").attr("data-id", "");

    var noteId = $(this).attr("data-id");

    $(".add-note").attr("data-id", noteId);
  };

  // click on ADD NOTE button in notes modal
  function addNote() {
    var artNotes = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/api/articles/" + artNotes,
      data: {
        title: $("#note-title").val(),
        body: $("#note-content").val()
      }
    })
    .then(function(data) {
      console.log(data);
      $(".saved-notes").prepend("<div data-id='" + data._id + "'><h5>" + data.title + "</h5><p>" + data.body + "<span class='deleter deep-orange-text text-darken-3'>X</span></p></div>");
      $("#note-title").val("");
      $("#note-content").val("");
    })
  };

  // click on X next to notes
  function deleteNote() {
    var toBeDeleted = $(this).parent().parent();

    $.ajax({
      type: "GET",
      url: "/delete/" +toBeDeleted.attr("data-id")
    })
  };


});