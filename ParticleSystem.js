/**
This script runs on an html5 canvas
*/

var canvas = document.getElementById('MyCanvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function loop() {
  clear();
  update();
  draw();
  queue();
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function queue() {
  window.requestAnimationFrame(loop);
}

function update() {
  //TODO
}

function draw() {
  //TODO
}




//running the loop now
loop();