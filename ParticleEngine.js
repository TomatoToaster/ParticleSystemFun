/**
This script runs on an html5 canvas
help strongly taken from: https://software.intel.com/en-us/html5/hub/blogs/build-a-javascript-particle-system-in-200-lines
*/

var MAX_PARTICLES = 2000;
var EMISSION_RATE = 4; //how many particles are emitted each frame
var PARTICLE_SIZE = 2;
var FE_SIZE = 3; //how big fields and emitters are
var PARTICLE_OVERRIDE_COLOR = "";
var EMITTER_COLOR = "rgb(255,255,255)";
var ATTRACT_FIELD_COLOR = "rgb(255,0,0)";
var REPEL_FIELD_COLOR = "rgb(0,255,0)";
var PARTICLE_COLLISION = 0;

var canvas = document.getElementById('MyCanvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/*
Vector: represents a 2D vector
*/
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
//add: Adds a vector to another
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
};
//length: Gets the length of the vector
Vector.prototype.getMagnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
//getAngle: Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};
//fromAngle: Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function(angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};


/*
Particle: represents a single particle in our system
*/
function Particle(point, velocity, acceleration) {
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0,0);
  this.acceleration = acceleration || new Vector(0, 0);
}
//move: Applies acceleration and velocity
Particle.prototype.move = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
};
//submits the particle to fields
Particle.prototype.submitToFields = function(fields) {
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];

    var vectorX = field.position.x - this.position.x;
    var vectorY = field.position.y - this.position.y;

    //High School Physics
    var force = field.mass / Math.pow(vectorX*vectorX + vectorY* vectorY, 1.5)

    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }

  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
};
//gets color for the particle based on its fields
Particle.prototype.getColor = function() {
  return "rgb(" + parseInt(((this.velocity.getMagnitude() * 40) % 200) + 56)
  +"," +parseInt(((this.velocity.getMagnitude() * 50) % 200) + 56)
  +"," +parseInt(((this.velocity.getMagnitude() * 60) % 200) + 56) +")";
};
//checks collision of particles (ignoring the currentIndex of the particle)
Particle.prtotype.collideAgainstOtherParticles = function(currentIndex) {
  for (var i  = 0; i < particles.length; i++) {
    if (i == currentIndex)
      continue;

    var otherPos = particles[i].position;
    var dist = (new Vector(otherPos.x - this.position.x, otherPos.y - this.position.y)).getMagnitude();
    if (dist <= PARTICLE_SIZE) {
      var otherVel = particles[i].velocity;
      var
    }
  }
}


/*
Emitter: Represents a Particle Emitter
*/
function Emitter(point, velocity, spread) {
  this.position = point; //Vector
  this.velocity = velocity; //velocity
  this.spread = spread || Math.PI / 32; // possible angles = velocity +/- spread
  this.drawColor = EMITTER_COLOR; //So we can tell them apart from fields
}
//emitParticle: emits a particle randomly over the spread
Emitter.prototype.emitParticle = function() {
  var angle = this.velocity.getAngle() + this.spread -
    (Math.random() * this.spread * 2);
  var magnitude = this.velocity.getMagnitude();
  var position = new Vector(this.position.x, this.position.y);
  var velocity = Vector.fromAngle(angle, magnitude);

  return new Particle(position, velocity);
};


/*
Field: a field that attracts or repels
positive mass attracts and negative mass repels
*/
function Field(point, mass) {
  this.position = point;
  this.setMass(mass);
}
//setMass: Sets the mass of the field
Field.prototype.setMass = function(mass) {
  this.mass = mass || 100;
  this.drawColor =  (mass < 0) ? ATTRACT_FIELD_COLOR : REPEL_FIELD_COLOR;
};



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
  addNewParticles();
  plotParticles(canvas.width, canvas.height)
}

function addNewParticles() {
  if (particles.length > MAX_PARTICLES)
    return;

  for (var i = 0; i < emitters.length; i++) {
    for (var j = 0; j < EMISSION_RATE; j++) {
      particles.push(emitters[i].emitParticle());
    }
  }
}

function plotParticles(boundsX, boundsY) {
  var stillValidParticles = [];

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos  = particle.position;

    if (pos.x < 0 || pos.x > boundsX ||pos.y < 0 || pos.y > boundsY)
      continue;

    particle.submitToFields(fields);
    particle.move();
    stillValidParticles.push(particle);
  }
  particles = stillValidParticles;
}

function draw() {
  drawParticles();
  fields.forEach(drawCircle);
  emitters.forEach(drawCircle);
}

function drawParticles() {

  if (PARTICLE_OVERRIDE_COLOR != "") {
    context.fillStyle = PARTICLE_OVERRIDE_COLOR;
    for (var i = 0; i< particles.length; i++) {
      var position = particles[i].position;
      context.fillRect(position.x, position.y, PARTICLE_SIZE, PARTICLE_SIZE);
    }
  }
  else {
    for (var i = 0; i< particles.length; i++) {
      var position = particles[i].position;
      context.fillStyle = particles[i].getColor();
      context.fillRect(position.x, position.y, PARTICLE_SIZE, PARTICLE_SIZE);
    }
  }
}

function drawCircle(object) {
  context.fillStyle = object.drawColor;
  context.beginPath();
  context.arc(object.position.x, object.position.y, FE_SIZE, 0, Math.PI * 2);
  context.closePath();
  context.fill();
}

var midX = canvas.width / 2;
var midY = canvas.height / 2;

var particles = [];
var emitters = [];
var fields = [];


//running the loop now
loop();
