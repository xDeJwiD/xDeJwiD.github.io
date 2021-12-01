var ruszanie = document.querySelector('#kolo');

document.onmousemove = (event) => {
    var x = event.clientX * 100 / window.innerWidth + "%";
    var y = event.clientY * 100 / window.innerHeight + "%";
    
    kolo.style.transition = "0s";
    kolo.style.left = x;
    kolo.style.top = y;
}

document.onmouseout = (event) => {
    kolo.style.transition = "0.7s";
    kolo.style.left = "50%";
    kolo.style.top = "50%";
}










var kolo;
window.onload=function(){
  var no = document.getElementById("no");
  kolo = document.getElementById("kolo");
  
  initDrag({
    element: kolo,
    start: function(){addShadow();},
    drag: function(){isCollapsed(kolo, no);},
    stop: function(){removeShadow();}
  });
}

function isCollapsed(kolo, no){
  var object_1 = kolo.getBoundingClientRect();
  var object_2 = no.getBoundingClientRect();
  
  if (object_1.left < object_2.left + object_2.width  && object_1.left + object_1.width  > object_2.left &&
		object_1.top < object_2.top + object_2.height && object_1.top + object_1.height > object_2.top) {
    no.classList.add("collide");
  }
  else{
    no.classList.remove("collide");
  }
}


function addShadow(){
  kolo.classList.add("onDrag");
}

function removeShadow(){
  kolo.classList.remove("onDrag");
}

function initDrag(options){
  var element = options.element;
  var mousedown, mouseup, mousemove,
      dragStart, initX, initY,
      offsetLeft, offsetTop;
  
  function mouseMove(ev){
    if(dragStart){
      var newX = offsetLeft + (ev.pageX - initX);
      var newY = offsetTop + (ev.pageY - initY);

      element.style.top = newY+"px";
      element.style.left = newX+"px";
      
      options.drag.call();
    }
  }
  
  function mouseUp(ev){
    dragStart = false;
    document.removeEventListener("mousemove", mouseMove, false);
    document.removeEventListener("mouseup", mouseUp, false);
    
    options.stop.call();
  }
  
  function mouseDown(ev){
    initX = ev.pageX;
    initY = ev.pageY;
    dragStart = true;
    offsetLeft = element.offsetLeft;
    offsetTop = element.offsetTop;
    document.addEventListener("mousemove", function(ev){mouseMove(ev)}, false);
    document.addEventListener("mouseup", function(ev){mouseUp(ev)}, false);
    
    options.start.call();
  }
  
  element.addEventListener("mousedown", function(ev){mouseDown(ev)}, false);
}