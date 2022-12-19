var imagens = ['img/facebook.png','img/facebook.png','img/android.png','img/android.png','img/chrome.png','img/chrome.png','img/firefox.png','img/firefox.png','img/html5.png','img/html5.png','img/googleplus.png','img/googleplus.png','img/twitter.png','img/twitter.png','img/windows.png','img/windows.png'];
  
$(document).ready(function() {//check if html loaded
  
  $('#Name').on('keypress', function(e) {
    return e.which !== 13;
  });

  updateScores();
  $(".carta").css({"pointer-events": "none"})

    // BoardSetup
    $("#jogar").click(function(){//click on play button
      
      const matchedCardsFound = [];//array to store matched cards, resets cards found
      $("#dialogo").html("CARREGANDO")
      stopTimer()
      milli = 0;
      seconds = 0;
      minutes = 0;
      
      $(".carta").children().fadeIn() //shows previous board if not revealed, for 3s
      $("button").prop("disabled",true);
      
      
      $(".carta").delay(3000).slideUp(function(){//hides cards
        
        shuffleArray(imagens); //shuffles
        $(".timer").html("00:00:000")
        $.each(imagens, function(i){ //deploys shuffled array to board
          
          $(`#carta${i+1}`).attr("src",this)
          
        })
        
        $(".carta").slideDown(function(){//reveals cards
          
          $("#dialogo").html("...");
          
          setTimeout(() =>{//shows x after 3s, enables buttons, starts timer and changes btn text
           
            $(".carta").children().fadeOut()
            $("button").prop("disabled",false);
            $("#jogar").text("REINICIAR");
            $("#dialogo").html("JOGANDO");
            $(".carta").css({"pointer-events": "auto", "cursor": "pointer"})
            
            if(int !== null){
              clearInterval(int);
            }
            int = setInterval(timer, 10);
            
          }, 3000)
          
        });
          
      });
      //gameplay function
      game(matchedCardsFound)
      return false;
    })
  
  
});

function timer(){
  milli += 10;
  
  if(milli == 1000){
    milli = 0;
    seconds++;

    if(seconds == 60){
      seconds = 0;
      minutes++;

      if(minutes == 2){
          gameLost();
      }
    }
  }
  
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ms = milli < 10 ? "00" + milli : milli < 100 ? "0" + milli : milli;
      
  $(".timer").html(`${m}:${s}:${ms}`);
}
function stopTimer() {
  clearInterval(int);
}

function gameWon() {
  stopTimer(int);
  $("#dialogo").html("VOCÊ VENCEU")
  $("#newScore").slideDown()
  $(".carta").css({"pointer-events": "none"});
  $("#btnNewScore").prop("disabled",false);
  addScore()
}

function addScore(){
  
  $("#btnNewScore").click(function(){
    if($("#Name").val().length == 3){
      let player = {
        name: $("#Name").val(),
        score: $(".timer").html()
      }
      if(!JSON.parse(localStorage.getItem("players"))){
        var players = [];
      }else{
        var players = JSON.parse(localStorage.getItem("players"))
      }
      players.unshift(player);
      localStorage.setItem("players", JSON.stringify(players));
      $("#dialogo").html("PONTUAÇÃO REGISTRADA");
      $("#newScore").slideUp()
      $("button").prop("disabled",false);
      updateScores()
      
    }else{
      alert("inserir 3 caracteres como nome para registrar pontuação")
    }
    
  })
}

function updateScores(){
  var players = JSON.parse(localStorage.getItem("players"));
  $("#recentes li").each(function(i){
    if(players.length == i){
      return false;
    }else
      $(this).html(`${players[i].name}-${players[i].score}`)
    
  })
  $("#top10 li").each(function(i){
    var sortedPlayers = JSON.parse(localStorage.getItem("players"));
    if(sortedPlayers.length == i){
      return false;
    }else{
      sortedPlayers.sort(function (a, b) {
        return a.score.localeCompare(b.score);
      });
    
      $(this).html(`${sortedPlayers[i].name}-${sortedPlayers[i].score}`)
    }
    
  })
}
function gameLost() {
  stopTimer();
  $("#dialogo").html("VOCÊ PERDEU");
  $(".carta").css({"pointer-events": "none"});
}

function game(matchedCardsFound){
  let card1 = ""; 
  let chosen = []; 
  
  $("li").click(function(){
    
    $(this).children().fadeIn();
    $(this).css({"pointer-events": "none"});//disables chosen card
    chosen.push($(this).children().attr("src"));
    console.log(chosen);
    
    if(chosen.length ==1){
      //stores first card
      card1 = $(this);
    }
    if(chosen.length == 2){
      
      $("button").prop("disabled",true);
      //checks if cards are equal
      $(".carta").css({"pointer-events": "none"}); //disables cards until checked for match
      if(chosen[0] == chosen[1]){
        //if equal, stores found matches and reenables unturned cards
        matchedCardsFound = matchedCardsFound.concat(chosen);
        console.log(matchedCardsFound);
        $("img:hidden").parent().css({"pointer-events": "auto"});
        
        if(matchedCardsFound.length == 16){
          gameWon()
        }
      }else{
        
        $("#dialogo").html("NÃO É PAR")
        //if not equal, keeps wrong cards on display for 1.5s, hides them again and reenables unturned cards
        setTimeout(() => {
        card1.children().fadeOut();
        card1.css({"pointer-events": "auto"});
        $(this).children().fadeOut();
        $(this).css({"pointer-events": "auto"});
        $("img:hidden").parent().css({"pointer-events": "auto"});
        $("button").delay(401).prop("disabled",false);
        $("#dialogo").html("JOGANDO")
        }, 1500);
      }
      chosen = [];//clears chosen cards after 2 were selected
    }
  })
  
}

function shuffleArray(array) {//Durstenfeld shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

var milli = 0;
var seconds = 0;
var minutes = 0;
var int = null;