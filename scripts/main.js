var Game = {
  inputAllowed: true, //enable or disable user input
  strict: false, //strict mode enabled
  pattern: [], //array to hold the pattern of button presses
  userInput: null, //user's input
  count: 0,
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

  playButtonSound: function(buttonNum) {
    this.sounds['button' + buttonNum].play();
  },

  stopButtonSounds: function() {
    this.sounds.button1.pause();
    this.sounds.button2.pause();
    this.sounds.button3.pause();
    this.sounds.button4.pause();
  },

  checkInput: function(button) {

  }
}


$(document).ready(function() {

  $('button').click(function() {
    Game.sounds.bad.play();
  });

  //Play button sound when pressed and input is allowed
  if (Game.inputAllowed) {
    $('div.button').bind('touchstart', function(e) {
      e.preventDefault(); //prevent the creation of click event from touchstart
      var button = $(this).prop('id');
      Game.playButtonSound(button);
    });
    $('div.button').mousedown(function() {
      var button = $(this).prop('id');
      Game.playButtonSound(button);
    });
  }

  //Stop playing sounds when mouse button is no longer pressed
  $(document).bind('touchend mouseup',function() {
    Game.stopButtonSounds();
    Game.stopButtonSounds();
  });
});
