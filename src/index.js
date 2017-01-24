/* establish global variables for ESLint */
/* global $ Howl document */

// function that prevents user from pusing buttons
function preventInput() {
  $('.button').each(function () {
    $(this).addClass('prevent-click');
  });
}

// function that allows user to push buttons
function allowInput() {
  $('.button').each(function () {
    $(this).removeClass('prevent-click');
  });
}

class Game {
  constructor() {
    this.round = 1;

    // array to hold the sequence of button presses
    this.sequence = [];

    // user's input
    this.userInput = [];

    // hardcore mode enabled
    this.hardcore = false;

    // timer used for user input
    this.inputTimer = null;

    // timer used for playing sequence
    this.playSequenceTimer = null;

    // create an object for sounds that contains Howler.js objects
    this.sounds = {
      button1: new Howl({
        urls: ['./audio/green.mp3', './audio/green.ogg', './audio/green.wav'],
        loop: true,
      }),
      button2: new Howl({
        urls: ['./audio/red.mp3', './audio/red.ogg', './audio/red.wav'],
        loop: true,
      }),
      button3: new Howl({
        urls: ['./audio/yellow.mp3', './audio/yellow.ogg', './audio/yellow.wav'],
        loop: true,
      }),
      button4: new Howl({
        urls: ['./audio/blue.mp3', './audio/blue.ogg', './audio/blue.wav'],
        loop: true,
      }),
      bad: new Howl({
        urls: ['./audio/bad.mp3', './audio/bad.ogg', './audio/bad.wav'],
      }),
    };
  }

  // method to play button sound
  playButtonSound(buttonNum) {
    this.sounds[`button${buttonNum}`].play();
  }

  // method to stop all button sounds.
  stopButtonSounds() {
    this.sounds.button1.pause();
    this.sounds.button2.pause();
    this.sounds.button3.pause();
    this.sounds.button4.pause();
  }

  // method that checks the users input
  checkInput(button) {
    clearInterval(this.inputTimer);
    // user pushed correct button
    if (button === this.sequence[this.userInput.length]) {
      this.playButtonSound(button);

      // add the button to the userInput array
      this.userInput.push(button);
    }
    // wrong button pressed in hardcore mode restarts game
    else if (this.hardcore) {
      // prevent user from clicking more buttons
      preventInput();
      this.sounds.bad.play();

      // wait 1.5 seconds before restarting to allow error sound to complete
      setTimeout(() => {
        this.restart();
      }, 1500);
    }
    // wrong button pressed repeat the last playSequence for user to try again
    else {
      // prevent user from clicking more buttons
      preventInput();

      // clear the user's input
      this.userInput = [];
      this.sounds.bad.play();

      // wait 1.5 seconds before starting sequence over again  to allow error sound to complete
      setTimeout(() => {
        this.playSequence();
      }, 1500);
    }

    // Advance to vicotrySequence if last button in the sequence
    if (this.userInput.length === this.sequence.length) {
      // prevent user from clicking more buttons
      preventInput();

      // wait 1 second before starting victorySequence
      setTimeout(() => {
        this.playVictorySequence();
        $('#round-num').html('WIN');
      }, 1000);
    }
    // User input the last button in the round.
    else if (this.userInput.length === this.round) {
      // prevent user from clicking more buttons
      preventInput();

      // advance to next round
      this.round += 1;

      // reset the userInput
      this.userInput = [];
      this.updateround();

      // wait 1 second before starting next round
      setTimeout(() => {
        this.playSequence();
      }, 1000);
    }
  }

  // method that fires when user's input has timed out
  inputTimedOut() {
    // hardcore mode restarts game
    if (this.hardcore) {
      // prevent user from clicking more buttons
      preventInput();

      // alert them with bad sound that they timed out
      this.sounds.bad.play();

      // wait 1.5 seconds before restarting to allow error sound to complete
      setTimeout(() => {
        this.restart();
      }, 1500);
    }
    // repeat the last playSequence for user to try again
    else {
      // prevent user from clicking more buttons
      preventInput();
      // clear the user's input
      this.userInput = [];

      // alert them with bad sound that they timed ou
      this.sounds.bad.play();

      // wait 1.5 seconds before starting sequence over again  to allow error sound to complete
      this.playSequenceTimer = setTimeout(() => {
        this.playSequence();
      }, 1500);
    }
  }

  // method to play back the sequence of button presses upto the current round
  playSequence() {
    // iterator for timed loop
    let i = 0;

    // interval used for time between button sounds
    let buttonPlayInterval = null;

    // duration between button sounds
    const intervalSpeed = 525;

    // duration of sound
    const soundDuration = 500;

    // create a timed loop for playback of button presses
    buttonPlayInterval = setInterval(() => {
      // current buton
      const button = this.sequence[i];
      $(`#${button}`).addClass('button-active');

      // Play the button sound
      this.playButtonSound(button);

      // wait for 500 ms then stop the button sound
      setTimeout(() => {
        this.stopButtonSounds();
        $(`#${button}`).removeClass('button-active');
      }, soundDuration);

      // increment the iterator
      i += 1;

      // stop the timed loop if iterator has reached round
      if (i >= this.round) {
        clearInterval(buttonPlayInterval);
        allowInput();// allow user input again

        // start the inputTimer which expects to see user input in 3 seconds or user fails
        this.inputTimer = setTimeout(() => {
          this.inputTimedOut();
        }, 3000);
      }
    }, intervalSpeed);
  }

  // method to play back the victory sequence upon winning
  playVictorySequence() {
    // iterator for timed loop
    let i = 0;

    // interval used for time between button sounds
    let buttonPlayInterval = null;

    // duration between button sounds
    const intervalSpeed = 525;

    // duration of sound
    const soundDuration = 500;

   // create a timed loop for playback of button presses
    buttonPlayInterval = setInterval(() => {
      // play all buttons simulataneously
      this.playButtonSound(1);
      this.playButtonSound(2);
      this.playButtonSound(3);
      this.playButtonSound(4);

      // highlight all buttons
      $('.button').each(function () {
        $(this).addClass('button-active');
      });

      // wait for 500 ms then stop the button sounds
      setTimeout(() => {
        this.stopButtonSounds();

        // un-highlight all buttons
        $('.button').each(function () {
          $(this).removeClass('button-active');
        });
      }, soundDuration);

      // increment the iterator
      i += 1;

      // stop the timed loop if iterator has repeated 3 times
      if (i >= 3) {
        clearInterval(buttonPlayInterval);
      }
    }, intervalSpeed);
  }

  // method to update the round number on the display
  updateround() {
    $('#round-num').html(this.round);
  }

  // method to start/reset game called when start/reset button is pushed
  restart() {
    // reset variables to initial values
    clearTimeout(this.inputTimer);
    clearTimeout(this.playSequenceTimer);
    this.userInput = [];
    this.round = 1;
    this.sequence = [];

    // Update round on screen
    this.updateround();

    // generate a new sequence of random buttons
    for (let i = 0; i < 20; i += 1) {
      this.sequence.push(Math.floor(Math.random() * 4) + 1);
    }
    // start the first round
    this.playSequence();

    // allow user input
    allowInput();
  }
}

// bootstrap the game once the page has fully loaded
$(document).ready(() => {
  // start by preventing any input
  preventInput();

  // create a new game object
  const currGame = new Game();

  // start/reset button press handler
  $('button').click(() => {
    currGame.restart();
  });

  // hardcore mode toggle handler
  $('input').click(() => {
    currGame.hardcore = !currGame.hardcore;
  });

  // Check the user's input when they touch or click on a button
  // touchstarts and mousedowns registered differently
  // they must be handled differently and not via click
  $('div.button').bind('touchstart', function (e) {
    // prevent the creation of click event from touchstart
    e.preventDefault();

    // find out which button was pressed convert it to integer
    const button = parseInt($(this).prop('id'), 10);

    // show the button as being pressed
    $(this).addClass('button-active');
    currGame.checkInput(button);
  });

  $('div.button').mousedown(function () {
    // find out which button was pressed convert it to integer
    const button = parseInt($(this).prop('id'), 10);

    // show the button as being pressed
    $(this).addClass('button-active');
    currGame.checkInput(button);
  });

  // Stop playing sounds when mouse button is no longer pressed
  $(document).bind('touchend mouseup', () => {
    $('.button').each(function () {
      // remove the aura showing that the button is pressed
      $(this).removeClass('button-active');
    });
    currGame.stopButtonSounds();
  });
});
