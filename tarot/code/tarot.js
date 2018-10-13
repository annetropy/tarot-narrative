// Story Templates
// TODO: Add in character name generation
var storyTemplates = {
  comedy: [
  "Jack is the best in the world at one thing: ",
  "But when Jack ",
  "they ",
  "Now it's up to their best friend Jill to ",
  "and in doing so help Jack "
],
tragedy: [
  "Jack wants most of all to ",
  "and all they need to do to get there is ",
  "Things are looking up in response, and Jack finds themselves ",
  "But then the tide turns and Jack ",
  "In the end, Jack loses the battle and is remembered only for "
]
};

// upright = light
// reversed = shadow
var storySpreads = {
  comedy: [
  "light",
  "shadow",
  "shadow",
  "light",
  "light"
],
tragedy: [
  "light",
  "shadow",
  "light",
  "shadow",
  "shadow"
]
};

// punctuation to be added after each card meaning for template
var punctuation = {
  comedy: [
  ".<br>",
  ", ",
  ".<br>",
  ", ",
  ".<br>"
],
tragedy: [
  ", ",
  ".<br>",
  ".<br>",
  ".<br>",
  ".<br>"
]
};

// tenses to use for each card meaning within the template depending
// on position of the cards
// TODO: Clean up the data representation, this is a mess
var tenses = {
  comedy: [
  "present_participle",
  "present",
  "infinitive",
  "infinitive",
  "infinitive"
],
tragedy: [
  "infinitive",
  "infinitive",
  "present_participle",
  "present",
  "present_participle"
]
};

// Drama arc - each card is associated with each spot in the arc
var arc = [
  "Inciting Incident",
  "Complication",
  "Crisis",
  "Climax",
  "Resolution"
];

// list of seasons for the tag line generation
var seasons = [
  "SPRING",
  "SUMMER",
  "FALL",
  "WINTER"
];

// list of story templates available
var storyTypes = [
  "comedy",
  "tragedy"
];


var deck = {};
var cardSpread = [];
var storyType;
var story;
var tarot;

$(document).ready(startApp);

var setTable = function()
{
  // make the card containers and labels based on the number of positions in our arc
  var numSpots = arc.length;

  for (i=0; i<numSpots; i++)
  {
    $("#cards").append("<div id='card"+i+"' class='cardContainer'></div>");
    $("#labels").append("<div id='label"+i+"' class='cardLabel'></div>");
  }
}

// draw the card label for a given position and label if its reversed
var displayLabel = function(card, loc, reversed)
{
  var label = "#label"+loc;
  var labelText = arc[loc]+"<br><hr>";

  labelText += "<h2>" + card.name + "</h2>";
  if (reversed)
    labelText += "reversed";
  $(label).html(labelText);

}

// display the card for a given position, draw it upside down if the
// card is reversed
var displayCard = function(card, loc, reversed)
{
  var flip = "";

  if (reversed)
    flip = "reversed";
  // set up the URL for the image
  rank = card.rank;
  switch (rank) {
    case "page":
      rank = "p";
      break;
    case "knight":
      rank = "n";
      break;
    case "queen":
      rank = "q";
      break;
    case "king":
      rank = "k";
      break;
  }

  // coins are listed as pentacles in the filenames
  if (card.suit == "coins")
    cardURL = "images/cards/" + rank + "p" + ".jpg";
  else
    cardURL = "images/cards/" + rank + card.suit[0] + ".jpg";
  $("#card"+loc).html("<div><img class='cardimg "+flip+"' src='"+cardURL+"'></div>");
}

// display the buttons to draw a new card
function displayButtons(loc)
{
  $("#button"+loc).style.display = "block";
}

// if a button is pressed for a new card, draw a new card from the deck and
// display it
var newCard = function(event)
{
  var loc = event.data.param1;
  var reversed = (storySpreads[story][loc] == "shadow");
  index = Math.floor(Math.random()*deck.length);
  card = deck[index];
  deck.splice(index, 1);

  cardSpread[loc] = card;
  displayCard(card, loc, reversed);
  displayLabel(card, loc, reversed);
  updateStory();
}

// update the story given the current spread
function updateStory()
{
    $("#story").html("");
    $("#story").append("<h3 id='tagline'></h3>");
    for (var i=0; i<arc.length; i++)
    {
      var card = cardSpread[i];
      var reversed = (storySpreads[story][i] == "shadow");
      $("#story").append(storyTemplates[story][i]);

      var tense = tenses[story][i];
      if (reversed)
      {
        // can use meaningindex to get a random meaning instead of the first one
        //var meaningindex = Math.floor(Math.random()*deck[index].meanings.shadow.length);
        $("#story").append(card.story.shadow[tense] + punctuation[story][i]);
      }
      else
      {
        // can use meaningindex to get a random meaning instead of the first one
        //var meaningindex = Math.floor(Math.random()*deck[index].meanings.light.length);
        $("#story").append(card.story.light[tense] + punctuation[story][i]);
      }
    }
    $("#story").append("<br>");
    $("#tagline").html("THIS " + seasons[Math.floor(Math.random()*seasons.length)] + ", " +
    cardSpread[0].fortune_telling[Math.floor(Math.random()*cardSpread[0].fortune_telling.length)].toUpperCase());

}

// draw a spread of cards to fit our arc - this also chooses randomly whether
// the story will be a tragedy or comedy
var makeSpread = function(tarot)
{
  deck = JSON.parse(JSON.stringify(tarot.tarot_interpretations));

  // pick a story type
  story = storyTypes[Math.floor(Math.random()*storyTypes.length)];

  // change background based on story storyType
  $("body").css("background-image", "url('images/" + story + "2background.png')");
  cardSpread = [];
  $("#storyType").html("A Story of " + story);
  for (var i = 0; i < arc.length; i++)
  {
    var reversed = (storySpreads[story][i] == "shadow");
    index = Math.floor(Math.random()*deck.length);
    card = deck[index];
    cardSpread.push(card);

    displayCard(card, i, reversed);
    displayLabel(card, i, reversed);

    deck.splice(index, 1);
  }
  updateStory();
}

function createfunc(i) {
    return function() { newCard(i) };
}

// set up on start up
// load the JSON file, make a new spread, set up the button functionality for a
// new spread and for new card
function startApp() {
  setTable();
  $.getJSON("tarot.json", function(data) {
    tarot = data;
    makeSpread(tarot);

  });
  $("#newSpread").click(function() {makeSpread(tarot);});

  for (var i=0; i<arc.length; i++)
  {
    $("#button"+i).click({param1: i}, newCard);
  };

}
