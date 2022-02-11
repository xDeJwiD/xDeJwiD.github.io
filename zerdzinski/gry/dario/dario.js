var darek = document.getElementById('dariusz');
var block = document.getElementById('block');
var portal = document.getElementById('portal');
var score = document.querySelector('.score');
var game = document.getElementById('game');
var wrapper = document.querySelector('.wrapper');
var last = document.querySelector('.lastscore');
var high = document.querySelector('.highscore');


var hello = document.querySelector('.hello');

var eee;

var bsod = document.querySelector('.bsod');
var ad = document.querySelector('.ad')
var ad1 = document.querySelector('.ad1');
var ad2 = document.querySelector('.ad2');
var ad3 = document.querySelector('.ad3');
var ad4 = document.querySelector('.ad4');

var v = 1000;


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

var pt = 0;

var isDead = 0;


//      EASY                                       MEDIUM                                   HARD                
var easyPortal1 = 700; var mediumPortal1 = 700; var hardPortal1 = 700;
var easyPortal2 = 900; var mediumPortal2 = 700; var hardPortal2 = 700;
var easyPortal3 = 1100; var mediumPortal3 = 700; var hardPortal3 = 700;
var easyPortal4 = 1300; var mediumPortal4 = 700; var hardPortal4 = 700;
var easyPortal5 = 1500; var mediumPortal5 = 700; var hardPortal5 = 700;



var lvl = 0;

var dim = 0;

var lastScore = 0;
var highScore = 0;

// start();

// function start() {
//   // alert('Biegniesz Żerdziolem' + '\n\nUnikaj prostych odpowiedzi na pytania' + '\n\npowodzenia byku');
//   score.innerText = '0';
//   block.classList.add('block')
//   // document.querySelector('body').style.backgroundColor = "rgb(67, 143, 0)";
//   document.querySelector('body').style.color = "black";
//   block.style.animationDuration = Math.round(score.innerText);
//   bsod.classList.add('hidden');
//   document.querySelector('#game').style.transition = 'none';
//   document.querySelector('#game').style.transform = 'rotate(0deg)';
//   document.documentElement.style.setProperty('--top', '600px');
//   wrapper.style.backgroundImage = "linear-gradient(var(--ziemia-top) 50%, var(--ziemia-bottom) 0%)";
//   darek.backgroundImage = "url(./img/dario/dario-run.gif)";
//   portal.classList.add('hidden');



//   ad1.classList.remove('max');
//   winclose(1);
//   ad2.classList.remove('max');
//   winclose(2);
//   ad3.classList.remove('max');
//   winclose(3);


// }



// DO RESETU
// block.style.animationDuration = "1.6s"







function test() {
  ad4.classList.remove('hidden');
  document.querySelector('#vid').play()
  document.querySelector('#vid').volume = '.3';
}



z = 0;

function start(x) {
  score.innerText = 0;
  block.classList.remove('block');
  lvl = 0;
  dim = 0;
  score.innerText = 0;
  setTimeout(function () {
    points(1);
    isDead = 0;
    block.classList.add('block');
    block.classList.remove('hidden');
    dead();
  }, 5000)

  if (x == 1) {
    startRandom(1);
    window.setInterval(rrr, 10);
  }

}

function restart() {
  hello.classList.remove('hidden');


  setTimeout(function () {
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
    hello.style.filter = 'blur(0rem) grayscale(0)';
    wrapper.style.filter = 'blur(3rem) grayscale(1)';
  }, 500);
}

function scores() {
  lastScore = score.innerText;
  last.innerText = lastScore;
  highScore = high.innerText;
  if (highScore < lastScore) {
    highScore = last.innerText;
  }
  high.innerText = highScore;
  score.innerText = 0;
}

//====================================================================================//

//                                  JUMP
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


//====================================================================================//

//                          RANDOM COLOR & SPEED

var rrr;
function startRandom(c) {
  rrr = setInterval(function () {
    if (isDead == 1) {
      window.clearInterval(rrr);
    }
    // EASY
    if (c == 1) {
      var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
      var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
      if (block.classList != 'stop' && blockLeft >= 600 || blockLeft <= 0 && darekTop == 260) {
        block.classList.add('stop');
        setTimeout(function () {
          block.classList.remove('stop');
          document.documentElement.style.setProperty('--random-dart-dist-left', 40 + 'px');

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
        }, 1600);
      }
    }

  }, 10)
  return;
}

//====================================================================================//

//                                  DEAD 
function dead() {
  setInterval(function () {
    var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));


    if (block.classList != 'hidden') {
      if (blockLeft <= 115 && blockLeft >= 20 && darekTop >= 205) {

        alert('Przegranko' + '\n\nWynik: ' + score.innerText);

        isDead = 1;
        // score.innerText--;
        block.classList.add('hidden');
        wrapper.style.filter = 'blur(3rem) grayscale(1)';
        setTimeout(function () {
          restart();

        }, 1000)
        scores();


        // setTimeout(function () {
        //   if (ad.classList != 'close' || ad.classList == 'max') {
        //     ad.classList.add('close');
        //     ad.classList.remove('max');
        //   }
        // }, 10)
        // setTimeout(function () {
        //   hello.style.filter = 'blur(0rem) grayscale(0)';
        // }, 300)
        // hello.classList.remove('hidden');
        // restart();
        // setTimeout(function () {
        //   alert('Przegrałeś' + '\nWynik: ' + score.innerText);
        // }, 1000);
        // ad.classList.add('close');
      }
      // if (portal.classList != 'hidden') {
      //   if (portalLeft <= 60 && portalLeft >= 20 && darekTop >= 120) {
      //     if (dim == 0 && portalLeft <= 60) {
      //       document.documentElement.style.setProperty('--top', ziemiabg);
      //       wrapper.style.backgroundImage = ziemiawrap;
      //       portal.classList.add('hidden');
      //     }
      //     if (dim == 1 && portalLeft <= 60) {
      //       document.documentElement.style.setProperty('--top', netherbg);
      //       wrapper.style.backgroundImage = netherwrap;
      //       portal.classList.add('hidden');
      //     }
      //     if (dim == 2 && portalLeft <= 60) {
      //       document.documentElement.style.setProperty('--top', skybg);
      //       wrapper.style.backgroundImage = skywrap;
      //       portal.classList.add('hidden');
      //     }
      //     if (dim == 3 && portalLeft <= 60) {
      //       document.documentElement.style.setProperty('--top', cavebg);
      //       wrapper.style.backgroundImage = cavewrap;
      //       portal.classList.add('hidden');
      //     }
      //     if (dim == 4 && portalLeft <= 60) {
      //       document.documentElement.style.setProperty('--top', endbg);
      //       wrapper.style.backgroundImage = endwrap;
      //       portal.classList.add('hidden');
      //     }
      //   }
      // }
    }
  }, 10);
}

//====================================================================================//

//                                  POINTS

var ppp;

function points() {
  ppp = setInterval(function () {
    if (isDead == 1) {
      score.innerText = 0;
      window.clearInterval(ppp);
    }
    if (isDead == 0) {
      setTimeout(function () {
        score.innerText++;
      }, 10)
    }
    // if (isDead == 1) {
    //   score.innerText = 0;
    //   return;
    // }
  }, 50)
  return;
}


setInterval(function dimension() {
  var portalLeft = parseInt(window.getComputedStyle(portal).getPropertyValue('left'));
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
}, 10)



//====================================================================================//

//                                POINT EVENTS
function events(x) {

  // EASY
  if (x == 1) {
    setInterval(function () {

    }, 10);
  }

  // MEDIUM
  if (x == 2) {
    setInterval(function () {

    }, 10);
  }

  // HARD
  if (x == 3) {
    setInterval(function () {
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
      // if (score.innerText > 1400 && score.innerText < 1405) {
      //   bsod.classList.remove('hidden');
      // }
      // if (score.innerText > 600 && score.innerText < 605) {
      //   document.querySelector('#game').style.transform = 'rotate(180deg)';
      // }
      // if (score.innerText > 2000 && score.innerText < 2005) {
      //   document.querySelector('#game').style.transform = 'rotate(0deg)';
      // }


    }, 10);
  }

}

//====================================================================================//

//                            MAXIMIZE POP WINDOW
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

//====================================================================================//

//                            CLOSE POP WINDOW
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
  if (x == 4) {
    document.querySelector(".ad4").classList.add('close');
    document.querySelector('#vid').pause();
  }
}


//====================================================================================//

//                            BSOD POP WINDOW
function bsodoff() {
  document.querySelector('.bsod').classList.add('hidden');
}

//====================================================================================//

//                  LEVEL SELECTOR HOVER BACKGROUND COLOR
function bg(x) {
  if (x == 0) {
    hello.style.backgroundColor = "#212121";
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
  }
  if (x == 1) {
    hello.style.backgroundColor = "#522600";
    document.querySelector('.easy').style.filter = "grayscale(0)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
  }
  if (x == 2) {
    hello.style.backgroundColor = "#460000";
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(0)";
    document.querySelector('.hard').style.filter = "grayscale(1)";
  }
  if (x == 3) {
    hello.style.backgroundColor = "#390056";
    document.querySelector('.easy').style.filter = "grayscale(1)";
    document.querySelector('.medium').style.filter = "grayscale(1)";
    document.querySelector('.hard').style.filter = "grayscale(0)";
  }
}


//====================================================================================//

//                            LEVEL SELECTOR
function level(x) {
  if (x == 1) {
    setTimeout(function () {
      hello.style.filter = 'blur(3rem) grayscale(1)';
      wrapper.style.filter = 'blur(3rem) grayscale(1)';
    }, 500);
    setTimeout(function () {
      hello.classList.add('hidden');
    }, 1500);
    setTimeout(function () {
      wrapper.style.filter = 'blur(0rem) grayscale(0)';
      block.style.animationDuration = "1.6s"
    }, 2000);

    start(1);
  }
  if (x == 2) {
    lvl = 2;

  }
  if (x == 3) {
    lvl = 3;

  }
}

//====================================================================================//





// kabelki
// rownania mika
// tarcza i na srodek tam ten
// catptcha żerdzinskiego 