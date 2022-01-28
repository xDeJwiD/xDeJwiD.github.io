var darek = document.getElementById('dariusz');
var block = document.getElementById('block');
var portal = document.getElementById('portal');
var score = document.querySelector('.score');
var game = document.getElementById('game');
var wrapper = document.querySelector('.wrapper');


var hello = document.querySelector('.hello');



var bsod = document.querySelector('.bsod');
var ad = document.querySelector('.ad')
var ad1 = document.querySelector('.ad1');
var ad2 = document.querySelector('.ad2');
var ad3 = document.querySelector('.ad3');
var ad4 = document.querySelector('.ad4');

var v = 1000;

var portal1 = 700;
var portal2 = 900;
var portal3 = 1100;
var portal4 = 1300;
var portal5 = 1500;


var lvl = 0;

var dim = 0;


// start();

function start() {
  // alert('Biegniesz Żerdziolem' + '\n\nUnikaj prostych odpowiedzi na pytania' + '\n\npowodzenia byku');
  score.innerText = '0';
  block.classList.add('block')
  // document.querySelector('body').style.backgroundColor = "rgb(67, 143, 0)";
  document.querySelector('body').style.color = "black";
  block.style.animationDuration = Math.round(score.innerText);
  bsod.classList.add('hidden');
  document.querySelector('#game').style.transition = 'none';
  document.querySelector('#game').style.transform = 'rotate(0deg)';
  document.documentElement.style.setProperty('--top', '600px');
  wrapper.style.backgroundImage = "linear-gradient(var(--ziemia-top) 50%, var(--ziemia-bottom) 0%)";
  darek.backgroundImage = "url(./img/dario/dario-run.gif)";
  portal.classList.add('hidden');



  ad1.classList.remove('max');
  winclose(1);
  ad2.classList.remove('max');
  winclose(2);
  ad3.classList.remove('max');
  winclose(3);


}

function jumping() {
  if (darek.classList != "jumpanimation") {
    darek.classList.add('jumpanimation');
    setTimeout(function () {
      darek.classList.remove('jumpanimation');

    }, 700);
    // if (parseInt(window.getComputedStyle(block).getPropertyValue('left')) <= 60 && parseInt(window.getComputedStyle(darek).getPropertyValue('top')) > 150) {


    // };

  }
}
// function dbljumping() {
//     if (darek.classList != "dbljumpanimation") {
//         darek.classList.remove('jumpanimation');
//         darek.classList.add('dbljumpanimation');
//         setTimeout(function () {
//             darek.classList.remove('dbljumpanimation')
//         }, 700)
//     }
// }



// sprawdzic co 10ms right block a potem co 1000ms zeby sie robilo zmiana left blocku i kolorku

function startRandom() {
  setInterval(function () {
    var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
    if (block.classList != 'stop' && block.classList != 'inv' && blockLeft >= 600 || blockLeft <= 0 && darekTop == 260) {
      block.classList.add('stop');
      setTimeout(function () {
        block.classList.remove('stop');
        var random = Math.random() * 200 + 40;
        document.documentElement.style.setProperty('--random-dart-dist-left', random + 'px');

        var color = Math.floor(Math.random() * 10 + 1);
        if (color == 1) {
          block.style.backgroundImage = "url(./img/darts/dart-black.png)"
        }
        if (color == 2) {
          block.style.backgroundImage = "url(./img/darts/dart-red.png)"
        }
        if (color == 3) {
          block.style.backgroundImage = "url(./img/darts/dart-pink.png)"
        }
        if (color == 4) {
          block.style.backgroundImage = "url(./img/darts/dart-violet.png)"
        }
        if (color == 5) {
          block.style.backgroundImage = "url(./img/darts/dart-white.png)"
        }
        if (color == 6) {
          block.style.backgroundImage = "url(./img/darts/dart-cyan.png)"
        }
        if (color == 7) {
          block.style.backgroundImage = "url(./img/darts/dart-blue.png)"
        }
        if (color == 8) {
          block.style.backgroundImage = "url(./img/darts/dart-lime.png)"
        }
        if (color == 9) {
          block.style.backgroundImage = "url(./img/darts/dart-yellow.png)"
        }
        if (color == 10) {
          block.style.backgroundImage = "url(./img/darts/dart-orange.png)"
        }
      }, 1000);
    }
  }, 10)
}


var endbg = "0px";
var skybg = "300px";
var ziemiabg = "600px";
var netherbg = "900px";
var cavebg = "1200px";


var endwrap = "linear-gradient(var(--end-top) 50%, var(--end-bottom) 0%)";
var skywrap = "linear-gradient(var(--sky-top) 50%, var(--sky-bottom) 0%)";
var ziemiawrap = "linear-gradient(var(--ziemia-top) 50%, var(--ziemia-bottom) 0%)";
var netherwrap = "linear-gradient(var(--nether-top) 50%, var(--nether-bottom) 0%)";
var cavewrap = "linear-gradient(var(--cave-top) 50%, var(--cave-bottom) 0%)";


var checkDead = setInterval(function () {
  score.innerText++;
  document.querySelector('#game').style.transition = 'ease-in-out 1s';
  var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
  var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
  var portalLeft = parseInt(window.getComputedStyle(portal).getPropertyValue('left'));

  if (block.classList != 'hidden') {
    if (blockLeft <= 115 && blockLeft >= 20 && darekTop >= 205) {
      block.classList.remove('block')
      // block.style.display = "none";
      score.innerText--;
      setTimeout(function () {
        if (ad.classList != 'close' || ad.classList == 'max') {
          ad.classList.add('close');
          ad.classList.remove('max');
        }
      }, 10)
      setTimeout(function () {
        hello.style.filter = 'blur(0rem) grayscale(0)';
      }, 300)
      hello.classList.remove('hidden');
      restart();
      setTimeout(function () {
        alert('Przegrałeś' + '\nWynik: ' + score.innerText);
      }, 1000);
      ad.classList.add('close');
    }
    if (portal.classList != 'hidden') {
      if (portalLeft <= 60 && portalLeft >= 20 && darekTop >= 120) {
        if (dim == 0 && portalLeft <= 60) {
          document.documentElement.style.setProperty('--top', ziemiabg);
          wrapper.style.backgroundImage = ziemiawrap;
          portal.classList.add('hidden');
        }
        if (dim == 1 && portalLeft <= 60) {
          document.documentElement.style.setProperty('--top', netherbg);
          wrapper.style.backgroundImage = netherwrap;
          portal.classList.add('hidden');
        }
        if (dim == 2 && portalLeft <= 60) {
          document.documentElement.style.setProperty('--top', skybg);
          wrapper.style.backgroundImage = skywrap;
          portal.classList.add('hidden');
        }
        if (dim == 3 && portalLeft <= 60) {
          document.documentElement.style.setProperty('--top', cavebg);
          wrapper.style.backgroundImage = cavewrap;
          portal.classList.add('hidden');
        }
        if (dim == 4 && portalLeft <= 60) {
          document.documentElement.style.setProperty('--top', endbg);
          wrapper.style.backgroundImage = endwrap;
          portal.classList.add('hidden');
        }
      }
    }
  }
}, 10);




var checkPt = setInterval(function () {


  if (score.innerText >= portal1 && score.innerText <= portal1 + 10 && block.classList != 'hidden') {
    dim = 1;
    portal.style.backgroundImage = "url(./img/portals/portal-nether.png)";
    block.classList.add('stop');
    portal.classList.remove('hidden');
    setTimeout(function () {
      block.classList.add('stop');
      portal.classList.add('hidden');
    }, 1500);
  }
  if (score.innerText >= portal2 && score.innerText <= portal2 + 10 && block.classList != 'hidden') {
    dim = 2;
    portal.style.backgroundImage = "url(./img/portals/portal-sky.png)";
    block.classList.add('stop');
    portal.classList.remove('hidden');
    setTimeout(function () {
      block.classList.add('stop');
      portal.classList.add('hidden');
    }, 1500);
  }
  if (score.innerText >= portal3 && score.innerText <= portal3 + 10 && block.classList != 'hidden') {
    dim = 3;
    portal.style.backgroundImage = "url(./img/portals/portal-cave.png)";
    block.classList.add('stop');
    portal.classList.remove('hidden');
    setTimeout(function () {
      block.classList.add('stop');
      portal.classList.add('hidden');
    }, 1500);
  }
  if (score.innerText >= portal4 && score.innerText <= portal4 + 10 && block.classList != 'hidden') {
    dim = 4;
    portal.style.backgroundImage = "url(./img/portals/portal-end.png)";
    block.classList.add('stop');
    portal.classList.remove('hidden');
    setTimeout(function () {
      block.classList.add('stop');
      portal.classList.add('hidden');
    }, 1500);
  }
  if (score.innerText >= portal5 && score.innerText <= portal5 + 10 && block.classList != 'hidden') {
    dim = 0;
    portal.style.backgroundImage = "url(./img/portals/portal-ziemia.png)";
    block.classList.add('stop');
    portal.classList.remove('hidden');
    setTimeout(function () {
      block.classList.add('stop');
      portal.classList.add('hidden');
    }, 1500);
  }

  // if (score.innerText > 1000 && score.innerText < 1010) {
  //   ad4.style.top = Math.random(Math.floor) * 20 + 40 + "%";
  //   ad4.style.left = Math.random(Math.floor) * 20 + 40 + "%";
  //   ad4.classList.remove('close');
  //   document.querySelector('#vid').play();
  // }

  // if (score.innerText > 500 && score.innerText < 505) {
  //   ad1.style.top = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad1.style.left = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad1.classList.remove('close');
  // }
  // if (score.innerText > 700 && score.innerText < 705) {
  //   ad2.style.top = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad2.style.left = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad2.classList.remove('close');
  // }
  // if (score.innerText > 900 && score.innerText < 905) {
  //   ad3.style.top = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad3.style.left = Math.random(Math.floor) * 70 + 20 + "%";
  //   ad3.classList.remove('close');
  // }
  // if (score.innerText > 200 && score.innerText < 205) {
  //   bsod.classList.remove('hidden');
  // }
  if (score.innerText > 1400 && score.innerText < 1405) {
    bsod.classList.remove('hidden');
  }
  // if (score.innerText > 600 && score.innerText < 605) {
  //   document.querySelector('#game').style.transform = 'rotate(180deg)';
  // }
  // if (score.innerText > 2000 && score.innerText < 2005) {
  //   document.querySelector('#game').style.transform = 'rotate(0deg)';
  // }

}, 10);




function winmax(x) {
  if (x == 1) {
    document.querySelector(".ad1").classList.add('max');
    ad1.style.top = '50%';
    ad1.style.left = '50%';
  }
  if (x == 2) {
    document.querySelector(".ad2").classList.add('max');
    ad2.style.top = '50%';
    ad2.style.left = '50%';
  }
  if (x == 3) {
    document.querySelector(".ad3").classList.add('max');
    ad3.style.top = '50%';
    ad3.style.left = '50%';
  }
}

function winclose(x) {
  if (x == 1) {
    document.querySelector(".ad1").classList.add('close');
  }
  if (x == 2) {
    document.querySelector(".ad2").classList.add('close');
  }
  if (x == 3) {
    document.querySelector(".ad3").classList.add('close');
  }
  if (x == 3) {
    document.querySelector(".ad4").classList.add('close');
  }
}



function bsodoff() {
  document.querySelector('.bsod').classList.add('hidden');
}

function bg(x) {
  if (x == 0) {
    hello.style.backgroundColor = "#212121";
  }
  if (x == 1) {
    hello.style.backgroundColor = "#522600";
  }
  if (x == 2) {
    hello.style.backgroundColor = "#460000";
  }
  if (x == 3) {
    hello.style.backgroundColor = "#390056";
  }
}

function restart() {
  lvl = 0;
  hello.classList.remove('hidden');
}


function level(x) {
  if (x == 1) {
    lvl = 1;
    document.querySelector('.easy').style.filter = "grayscale(0)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
    setTimeout(function () {
      hello.style.filter = 'blur(3rem) grayscale(1)';
      wrapper.style.filter = 'blur(3rem) grayscale(1)';
    }, 500);
    setTimeout(function () {
      hello.classList.add('hidden');
    }, 1500);
    setTimeout(function () {
      wrapper.style.filter = 'blur(0rem) grayscale(0)';
    }, 2000);
    setTimeout(function () {
      document.documentElement.style.setProperty('--random-dart-dist-left', 100 + 'px');
      block.classList.remove('hidden');
      startRandom();
    }, 4000);
  }
  if (x == 2) {
    lvl = 2;
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(0)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
  }
  if (x == 3) {
    lvl = 3;
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(0)";
  }
}






// kabelki
// rownania mika
// tarcza i na srodek tam ten
// catptcha żerdzinskiego 