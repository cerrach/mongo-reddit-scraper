
$(document).ready(function(){
  var count = 1;
  $('.cool-heading').children('span').each(function(){
    var delay = (count / ( $('.cool-heading').children('span').length) ) + 's';
    $(this).css({'-webkit-animation-delay': delay,'animation-delay': delay});
    $(this).attr('class','animated bounceInDown');
    count++;
  });
});



var check = true;
$(".btn-1").on("click",function(){
  if(check){
    $(".button-holder").append("<input id='redditInput' name='title' placeholder='Subreddit of your choice' class='form-control rInput animated fadeIn'>");
    check = false;
  }
});



$(".btn-2").on("click",function(){

  $("#articles").empty();
  $("#notes").empty();

  var newReddit = $("#redditInput").val();

  $.get("/scrape/" + newReddit,function(data){console.log("new scrape")}).then(function(){


    $.getJSON("/articles", function(data) {
      // For each one
      // console.log(data);
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page

        var articleContainer = $("<div class='articleContainer'>");
        articleContainer.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "</p>");


        if(data[i].link.endsWith("/")){
            var adjustedLink = data[i].link.substring(0,data[i].link.length - 1);
            articleContainer.append(`<a target='_blank' href=${adjustedLink}>${adjustedLink}</a>`);
        }else if(data[i].link.beginsWith("/"){
            var adjustedLink = "https://www.reddit.com/" + data[i].link;
            articleContainer.append(`<a target='_blank' href=${adjustedLink}>${adjustedLink}</a>`);
        }else{
            articleContainer.append(`<a target='_blank' href=${data[i].link}>${data[i].link}</a>`);
        }



        $("#articles").append(articleContainer);
      }
    });


  });






});









// Grab the articles as a json


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' class='form-control tInput'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' class='form-control tArea'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-3'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
