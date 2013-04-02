// create the socket object
var socket = io.connect('http://localhost');

var logger = document.getElementById('logger');
// the main function that moves the box around the screen
function moveBox(data) {
  var box = document.getElementById('box');
  var transformstr = 'perspective(500px) rotateX('+data.z+'deg) rotateY('+data.x+'deg)';
  box.style.webkitTransform = transformstr;
  box.style.MozTransform = transformstr;
}

socket.on('connect', function () {
  // let the client know we are connected
  logger.style.color = '#22d332';
  logger.innerText = 'socket connected';
  // listen for move square
  socket.on('movesquare', function(data) {
    // send the data here for local manipulation
    moveBox(data);
  });
  socket.on('disconnect',function() {
    // visually disconnect
    logger.style.color = '#d31713';
    logger.innerText = 'socket disconnected';
  });
});
// get the check box
var is_client = document.getElementById('is_client');
// basic function to grab the device orientation
function handleOrientationEvent(z,x,o) {
  var data = {
    z: (Math.round(z))*5,
    x: (Math.round(x))*5,
    o: (Math.round(o))*5
  };
  if(is_client.checked) {
    // emit the devicemove event with the device data attached
    socket.emit('devicemove', data);
    // move it locally
    moveBox(data);
  }
}
// create the event handler and its properties
if(window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    var rotateDegrees = event.alpha;
    var leftToRight = event.gamma;
    var frontToBack = event.beta;
    handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
  }, false);
}