A particle system experiment made with help from:
https://software.intel.com/en-us/html5/hub/blogs/build-a-javascript-particle-system-in-200-lines
Beyond the tutorial, I've added particle collision and "modularity" by creating an engine of sorts
There are future plans to compile this into a library

Instructions:

Simply run any of the html files (other than template) in any HTML5 supporting browser

For PlaygroundParticleSystem.html:
-Clicking regularly creates an emitter that shoots out in all directions
-Clicking with the shift key held down creates an attracting green dot
-Clicking with the ctrl key held down creates a repelling red dot

Fields you can safely alter in the second <script> in Template.html as well as their defaults:
var MAX_PARTICLES = 2000;
var EMISSION_RATE = 4; //how many particles are emitted each frame
var PARTICLE_SIZE = 2;
var FE_SIZE = 3; //how big fields and emitters are
var PARTICLE_OVERRIDE_COLOR = "";
var EMITTER_COLOR = "rgb(255,255,255)";
var ATTRACT_FIELD_COLOR = "rgb(255,0,0)";
var REPEL_FIELD_COLOR = "rgb(0,255,0)";
var PARTICLE_COLLISION = 0; //set to 1 to turn on particle collision

var emitters = [];
var fields = [];

also midX and midY are available as middle x and y coordinates of the canvas
