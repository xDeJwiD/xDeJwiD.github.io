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

document.getElementById("pole")
function cos() {
  var div = document.createElement('div');
     div.style.backgroundColor = "pink";
     div.style.position = "absolute";
     div.style.transform = "translate(-50%, -50%)"
     div.style.left = kolo.style.left;
     div.style.top = kolo.style.top;
     div.style.height = "10px";
     div.style.width = "10px";
     div.style.borderRadius = "50rem"

     document.getElementsByTagName('body')[0].appendChild(div);
};
