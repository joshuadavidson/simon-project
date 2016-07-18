var Game = {
  round: 1,
  sequence: [], //array to hold the sequence of button presses
  userInput: [], //user's input
  hardcore: false, //hardcore mode enabled
  inputTimer: null, //timer used for user input
  sounds: { //create an object for sounds that contains Howler.js objects
    button1: new Howl({
      urls: ['./audio/green.mp3', './audio/green.ogg', './audio/green.wav'],
      loop: true
    }),
    button2: new Howl({
      urls: ['./audio/red.mp3', './audio/red.ogg', './audio/red.wav'],
      loop: true
    }),
    button3: new Howl({
      urls: ['./audio/yellow.mp3', './audio/yellow.ogg', './audio/yellow.wav'],
      loop: true
    }),
    button4: new Howl({
      urls: ['./audio/blue.mp3', './audio/blue.ogg', './audio/blue.wav'],
      loop: true
    }),
    bad: new Howl({
      urls: ['./audio/bad.mp3', './audio/bad.ogg', './audio/bad.wav'],
    })
  },

  //function to play button sound
  playButtonSound: function(buttonNum) {
    this.sounds['button' + buttonNum].play();
  },

  //function that stops all button sounds.
  stopButtonSounds: function() {
    this.sounds.button1.pause();
    this.sounds.button2.pause();
    this.sounds.button3.pause();
    this.sounds.button4.pause();
  },

  //function that prevents user from pusing buttons
  preventInput: function() {
    $('.button').each(function() {
      $(this).addClass('prevent-click');
    });
  },

  //function that allows user to push buttons
  allowInput: function() {
    $('.button').each(function() {
      $(this).removeClass('prevent-click');
    });
  },

  //function that checks the users input
  checkInput: function(button) {
    clearInterval(this.inputTimer);
    if (button == this.sequence[this.userInput.length]) { //user pushed correct button
      this.playButtonSound(button);
      this.userInput.push(parseInt(button)); //add the button to the userInput array
    } else if (this.hardcore) { //wrong button pressed in hardcore mode restarts game
      this.preventInput(); //prevent user from clicking more buttons
      this.sounds.bad.play();
      setTimeout(function() { //wait 1.5 seconds before restarting to allow error sound to complete
        this.restart();
      }.bind(this), 1500);
    } else { //wrong button pressed not repeat the last playSequence for user to try again
      this.preventInput(); //prevent user from clicking more buttons
      this.userInput = []; //clear the user's input
      this.sounds.bad.play();
      setTimeout(function() { //wait 1.5 seconds before starting sequence over again  to allow error sound to complete
        this.playSequence();
      }.bind(this), 1500);
    }

    //Advance to vicotrySequence if last button in the sequence
    if (this.userInput.length === this.sequence.length) {
      this.preventInput(); //prevent user from clicking more buttons
      setTimeout(function() { //wait 1 second before starting victorySequence
        this.playVictorySequence();
        $('#round-num').html('WIN');
      }.bind(this), 1000);
    } else if (this.userInput.length === this.round) { //User input the last button in the round.
      this.preventInput(); //prevent user from clicking more buttons
      this.round++; //advance to next round
      this.userInput = []; //reset the userInput
      this.updateround();
      setTimeout(function() { //wait 1 second before starting next round
        this.playSequence();
      }.bind(this), 1000);
    }
  },

  //function that fires when user's input has timed out
  inputTimedOut: function() {
    if (this.hardcore) { //hardcore mode restarts game
      this.preventInput(); //prevent user from clicking more buttons
      this.sounds.bad.play();
      setTimeout(function() { //wait 1.5 seconds before restarting to allow error sound to complete
        this.restart();
      }.bind(this), 1500);
    } else { //repeat the last playSequence for user to try again
      this.preventInput(); //prevent user from clicking more buttons
      this.userInput = []; //clear the user's input
      this.sounds.bad.play();
      setTimeout(function() { //wait 1.5 seconds before starting sequence over again  to allow error sound to complete
        this.playSequence();
      }.bind(this), 1500);
    }
  },

  //funciton to play back the sequence of button presses upto the current round
  playSequence: function() {
    var i = 0; //iterator for timed loop
    var buttonPlayInterval; //interval used for time between button sounds
    var buttonStopTimeout; //timeout used to stop button sounds
    var intervalSpeed = 525; //duration between button sounds
    var soundDuration = 500; //duration of sound

    //create a timed loop for playback of button presses
    buttonPlayInterval = setInterval(function() {
      var button = this.sequence[i]; //current buton
      $('#' + button).addClass('button-active');

      this.playButtonSound(button); //Play the button sound

      //wait for 500 ms then stop the button sound
      buttonStopTimeout = setTimeout(function() {
        this.stopButtonSounds();
        $('#' + button).removeClass('button-active');
      }.bind(this), soundDuration);

      i++; //increment the iterator

      //stop the timed loop if iterator has reached round
      if (i >= this.round) {
        clearInterval(buttonPlayInterval);
        this.allowInput(); //allow user input again

        //start the inputTimer which expects to see user input in 3 seconds or user fails
        this.inputTimer = setTimeout(function() {
          this.inputTimedOut();
        }.bind(this), 3000);
      }
    }.bind(this), intervalSpeed);
  },

  //funciton to play back the victory sequence upon winning
  playVictorySequence: function() {
    var i = 0; //iterator for timed loop
    var buttonPlayInterval; //interval used for time between button sounds
    var buttonStopTimeout; //timeout used to stop button sounds
    var intervalSpeed = 525; //duration between button sounds
    var soundDuration = 500; //duration of sound

    //create a timed loop for playback of button presses
    buttonPlayInterval = setInterval(function() {
      //play all buttons simulataneously
      this.playButtonSound(1);
      this.playButtonSound(2);
      this.playButtonSound(3);
      this.playButtonSound(4);

      $('.button').each(function() { //highlight all buttons
        $(this).addClass('button-active');
      });

      //wait for 500 ms then stop the button sounds
      buttonStopTimeout = setTimeout(function() {
        this.stopButtonSounds();
        $('.button').each(function() { //un-highlight all buttons
          $(this).removeClass('button-active');
        });
      }.bind(this), soundDuration);

      i++; //increment the iterator

      //stop the timed loop if iterator has repeated 3 times
      if (i >= 3) {
        clearInterval(buttonPlayInterval);
      }
    }.bind(this), intervalSpeed);
  },

  //function to update the round number on the display
  updateround: function() {
    $('#round-num').html(this.round);
  },

  //function to start/reset game called when start/reset button is pushed
  restart: function() {
    //reset variables to initial values
    this.userInput = [];
    this.round = 1;
    this.sequence = [];

    this.updateround(); //Update round on screen

    //generate a new sequence of random buttons
    for (var i = 0; i < 20; i++) {
      this.sequence.push(Math.floor(Math.random() * 4) + 1);
    }
    this.playSequence(this.round); //start the first round
  }
}

$(document).ready(function() {
  Game.restart(); //Start the game on initial load

  $('button').click(function() { //start/reset button press handler
    Game.restart();
  });

  $('input').click(function() { //hardcore mode toggle handler
    Game.hardcore = !Game.hardcore;
  });

  //Check the user's input when they touch or click on a button
  //touchstarts and mousedowns registered differently so they must be handled differently and not via click
  $('div.button').bind('touchstart', function(e) {
    e.preventDefault(); //prevent the creation of click event from touchstart
    var button = $(this).prop('id'); //find out which button was pressed
    $(this).addClass('button-active'); //show the button as being pressed
    Game.checkInput(button);
  });

  $('div.button').mousedown(function() {
    var button = $(this).prop('id'); //find out which button was pressed
    $(this).addClass('button-active'); //show the button as being pressed
    Game.checkInput(button);
  });

  //Stop playing sounds when mouse button is no longer pressed
  $(document).bind('touchend mouseup', function() {
    $('.button').each(function() {
      $(this).removeClass('button-active'); //remove the aura showing that the button is pressed
    });
    Game.stopButtonSounds();
  });
});
