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
var ad5 = document.querySelector('.ad5');

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


//      EASY                   MEDIUM                    HARD                
var easyPortal1 = 1000; var mediumPortal1 = 1000; var hardPortal1 = 500;
var easyPortal2 = 2000; var mediumPortal2 = 2000; var hardPortal2 = 1000;
var easyPortal3 = 3000; var mediumPortal3 = 3000; var hardPortal3 = 1500;
var easyPortal4 = 4000; var mediumPortal4 = 4000; var hardPortal4 = 2000;
var easyPortal5 = 5000; var mediumPortal5 = 5000; var hardPortal5 = 2500;



var lvl = 0;

var dim = 0;

var immortal = 0;


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

function reset() {
  cimgreset()
  darek.style.backgroundImage = 'url(./img/dario/dario-run.gif)'
  wrapper.style.outline = '0px solid transparent'
  skip = 0;


  ad1.classList.add('close');
  ad2.classList.add('close');
  ad3.classList.add('close');
  ad4.classList.add('close');
  ad5.classList.add('close');
  document.querySelector('#vid').pause();
  document.querySelector('#vid').currentTime = 0

  document.querySelector('.chin').pause();
  document.querySelector('.chin').currentTime = 0;
  document.querySelector('.sus').classList.add('hidden');
  document.querySelector('.rock').pause();
  document.querySelector('.rock').currentTime = 0


  document.querySelector('.z').innerText = '1 z 6';
  document.querySelector('.pyt-1').style.display = 'flex';
  document.querySelector('.chinashop').style.display = 'none';

  wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg)';
  score.style.transform = 'rotate(0deg)';
}


function cimgreset() {
  cap = 0;
  good = 0;
  ded = 0;

  document.querySelector('.captcha-top').style.backgroundColor = '#0091ff';
  document.querySelector('.captchacont button').style.backgroundColor = '#0091ff';

  document.querySelector('.cimg1').style.opacity = '1';
  document.querySelector('.cimg1').style.visibility = 'visible';

  document.querySelector('.cimg2').style.opacity = '1';
  document.querySelector('.cimg2').style.visibility = 'visible';

  document.querySelector('.cimg3').style.opacity = '1';
  document.querySelector('.cimg3').style.visibility = 'visible';

  document.querySelector('.cimg4').style.opacity = '1';
  document.querySelector('.cimg4').style.visibility = 'visible';

  document.querySelector('.cimg5').style.opacity = '1';
  document.querySelector('.cimg5').style.visibility = 'visible';

  document.querySelector('.cimg6').style.opacity = '1';
  document.querySelector('.cimg6').style.visibility = 'visible';

  document.querySelector('.cimg7').style.opacity = '1';
  document.querySelector('.cimg7').style.visibility = 'visible';

  document.querySelector('.cimg8').style.opacity = '1';
  document.querySelector('.cimg8').style.visibility = 'visible';

  document.querySelector('.cimg9').style.opacity = '1';
  document.querySelector('.cimg9').style.visibility = 'visible';

  return;
}


// function test() {
//   ad4.classList.remove('close');
//   document.querySelector('#vid').play()
//   document.querySelector('#vid').volume = '.3';
// }



z = 0;



var main;
var points;
var dims;
var pkt;
var ded = 0;

function mainLoop() {
  main = setInterval(function () {
    var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

    if (block.classList != 'hidden' || ded == 1) {
      if (blockLeft <= 115 && blockLeft >= 20 && darekTop >= 205 && immortal != 1 || ded == 1 && immortal != 1) {
        last.innerText = score.innerText;
        if (last.innerText >= high.innerText) {
          high.innerText = last.innerText;
        }



        alert('Przegranko' + '\n\nWynik: ' + score.innerText);

        reset();
        wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        score.style.transform = 'rotate(0deg)';

        ded = 0;
        isDead = 1;
        window.clearInterval(points);
        window.clearInterval(main);
        // window.clearInterval(speed);
        // window.clearInterval(randomize);
        // score.innerText--;
        block.classList.add('hidden');

        wrapper.style.filter = 'blur(3rem) grayscale(1)';
        setTimeout(function () {
          hello.classList.remove('hidden');
          hello.style.filter = 'blur(0rem) grayscale(0)';

          score.innerText = 0;
        }, 1000)

      }
      if (blockLeft <= 115 && blockLeft >= 20 && darekTop >= 205 && immortal == 1 || ded == 1 && immortal == 1) {
        darek.style.backgroundImage = 'url(./img/dario/dario-run.gif)'
        wrapper.style.outline = '0px solid transparent'
        document.querySelector('body').style.backgroundColor = 'red';
        setTimeout(() => {
          document.querySelector('body').style.backgroundColor = 'rgb(30, 30, 30)';
        }, 10);
        setTimeout(() => {
          immortal = 0;
          ded = 0;
        }, 1000);
        return;
      }
    }
  }, 10)

  dims = setInterval(function dimension() {

    var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
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

  points = setInterval(function () {
    score.innerText++;
    pkt = parseInt(score.innerText);
  }, 100)


  // var darekTop = parseInt(window.getComputedStyle(darek).getPropertyValue('top'));
  // var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

  // speedd = setInterval(function () {
  //   if (block.classList != 'stop' && blockLeft >= 600 || blockLeft <= -40 && darekTop == 260) {

  //     setTimeout(function () {
  //       block.classList.remove('stop');
  //       var random = Math.random() * 200 + 40;
  //       document.documentElement.style.setProperty('--random-dart-dist-left', random + 'px'); 
  //       block.classList.add('stop');
  //       window.clearInterval(speedd);
  //     }, 1000)
  //   }


  // }, 100)

  return;
}

// function velo() {
//   var random = Math.random() * 600 + 40;
//   document.documentElement.style.setProperty('--random-dart-dist-left', random + 'px');

//   return;
// }


//====================================================================================//

//                                        SKOK
function jumping() {
  if (darek.classList != "jumpanimation") {
    darek.classList.add('jumpanimation');
    setTimeout(function () {
      darek.classList.remove('jumpanimation');

    }, 700);
  }
  else {
    return;
  }
}

//====================================================================================//

//                                      LEVEL

var lvl = 0;
var c = 0;

function level(x) {
  if (x == 1 && c != 1) {
    c = 1;
    lvl = 1;
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
    setTimeout(function () {
      start();
      c = 0;
    }, 5000)
  }
  if (x == 2 && c != 1) {
    c = 1;
    lvl = 2;
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
    setTimeout(function () {
      start();
      c = 0;
    }, 5000)
  }
  if (x == 3 && c != 1) {
    c = 1;
    lvl = 3;
    reset();
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
    setTimeout(function () {
      start();
      c = 0;
    }, 5000)
  }
}


//====================================================================================//

//                                  RANDOM THINGS
function randoms() {
  randomize = setInterval(function () {
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
    if (block.classList != 'hidden') {
      if (blockLeft >= 600 || blockLeft <= -80) {
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
        if (lvl == 2) {
          document.documentElement.style.setProperty('--random-dart-dist-left', 40 + 'px');
        }
      }
      if (blockLeft <= -190) {
        if (lvl == 1) {
          document.documentElement.style.setProperty('--random-dart-dist-right', 650 + 'px');
          return;
        }
        if (lvl == 2) {
          var random = Math.random() * 800 + 650;
          document.documentElement.style.setProperty('--random-dart-dist-right', random + 'px');
          return;
        }
        if (lvl == 3) {
          var random = Math.random() * 1000 + 650;
          document.documentElement.style.setProperty('--random-dart-dist-right', random + 'px');
          return;
        }
        if (lvl == 4) {
          var random = Math.random() * 1000 + 650;
          document.documentElement.style.setProperty('--random-dart-dist-right', random + 'px');
          return;
        }
      }
    }
  }, 10)
  return;
}
var srandom;



//====================================================================================//

//                                  START

function start() {
  if (lvl == 1) {
    mainLoop();
    randoms();
    events();
    portals();
    block.classList.remove('hidden');
  }
  if (lvl == 2) {
    mainLoop();
    randoms();
    events();
    portals();
    block.classList.remove('hidden');
  }
  if (lvl == 3) {
    reset();
    mainLoop();
    randoms();
    events();
    portals();
    block.classList.remove('hidden');
  }
}




//====================================================================================//

//                                PORTALS

function portals() {

  // EASY
  if (lvl == 1) {
    // setInterval(function () {
    //   var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

    //   if (score.innerText >= easyPortal1 && score.innerText <= easyPortal1 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
    //     dim = 1;
    //     portal.style.backgroundImage = "url(./img/portals/portal-nether.png)";
    //     block.classList.add('hidden');
    //     portal.classList.remove('hidden');
    //     setTimeout(function () {
    //       portal.classList.add('hidden');
    //       block.classList.remove('hidden');
    //     }, 3000);
    //   }
    //   if (score.innerText >= easyPortal2 && score.innerText <= easyPortal2 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
    //     dim = 2;
    //     portal.style.backgroundImage = "url(./img/portals/portal-sky.png)";
    //     block.classList.add('hidden');
    //     portal.classList.remove('hidden');
    //     setTimeout(function () {
    //       portal.classList.add('hidden');
    //       block.classList.remove('hidden');
    //     }, 3000);
    //   }
    //   if (score.innerText >= easyPortal3 && score.innerText <= easyPortal3 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
    //     dim = 3;
    //     portal.style.backgroundImage = "url(./img/portals/portal-cave.png)";
    //     block.classList.add('hidden');
    //     portal.classList.remove('hidden');
    //     setTimeout(function () {
    //       portal.classList.add('hidden');
    //       block.classList.remove('hidden');
    //     }, 3000);
    //   }
    //   if (score.innerText >= easyPortal4 && score.innerText <= easyPortal4 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
    //     dim = 4;
    //     portal.style.backgroundImage = "url(./img/portals/portal-end.png)";
    //     block.classList.add('hidden');
    //     portal.classList.remove('hidden');
    //     setTimeout(function () {
    //       portal.classList.add('hidden');
    //       block.classList.remove('hidden');
    //     }, 3000);
    //   }
    //   if (score.innerText >= easyPortal5 && score.innerText <= easyPortal5 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
    //     dim = 0;
    //     portal.style.backgroundImage = "url(./img/portals/portal-ziemia.png)";
    //     block.classList.add('hidden');
    //     portal.classList.remove('hidden');
    //     setTimeout(function () {
    //       portal.classList.add('hidden');
    //       block.classList.remove('hidden');
    //     }, 3000);
    //   }
    // }, 10);
  }

  // MEDIUM
  if (lvl == 2) {
    setInterval(function () {
      var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

      if (score.innerText >= mediumPortal1 && score.innerText <= mediumPortal1 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 1;
        portal.style.backgroundImage = "url(./img/portals/portal-nether.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= mediumPortal2 && score.innerText <= mediumPortal2 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 2;
        portal.style.backgroundImage = "url(./img/portals/portal-sky.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= mediumPortal3 && score.innerText <= mediumPortal3 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 3;
        portal.style.backgroundImage = "url(./img/portals/portal-cave.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= mediumPortal4 && score.innerText <= mediumPortal4 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 4;
        portal.style.backgroundImage = "url(./img/portals/portal-end.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= mediumPortal5 && score.innerText <= mediumPortal5 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 0;
        portal.style.backgroundImage = "url(./img/portals/portal-ziemia.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
    }, 10);
  }

  // HARD
  if (lvl == 3) {
    setInterval(function () {
      var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

      if (score.innerText >= hardPortal1 && score.innerText <= hardPortal1 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 1;
        portal.style.backgroundImage = "url(./img/portals/portal-nether.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= hardPortal2 && score.innerText <= hardPortal2 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 2;
        portal.style.backgroundImage = "url(./img/portals/portal-sky.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= hardPortal3 && score.innerText <= hardPortal3 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 3;
        portal.style.backgroundImage = "url(./img/portals/portal-cave.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= hardPortal4 && score.innerText <= hardPortal4 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 4;
        portal.style.backgroundImage = "url(./img/portals/portal-end.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
      if (score.innerText >= hardPortal5 && score.innerText <= hardPortal5 + 40 && block.classList != 'hidden' && blockLeft <= -70) {
        dim = 0;
        portal.style.backgroundImage = "url(./img/portals/portal-ziemia.png)";
        block.classList.add('hidden');
        portal.classList.remove('hidden');
        setTimeout(function () {
          portal.classList.add('hidden');
          block.classList.remove('hidden');
        }, 3000);
      }
    }, 10);
  }
}


//====================================================================================//

//                                SCORE EVENTS

var m = 0;

function events() {

  // EASY
  if (lvl == 1) {
    setInterval(function () {
    }, 10);
  }

  // MEDIUM
  if (lvl == 2) {
    setInterval(function () {
    }, 10);
  }

  // HARD
  if (lvl == 3) {
    setInterval(function () {
      // var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

      // RICK
      if (m != 1 && score.innerText == 200 || score.innerText == 700 || score.innerText == 900 || score.innerText == 1337) {
        m = 1;
        ad4.style.top = Math.random(Math.floor) * 20 + 40 + "%";
        ad4.style.left = Math.random(Math.floor) * 20 + 40 + "%";
        ad4.classList.remove('close');
        document.querySelector('#vid').play();
        setTimeout(function () { m = 0 }, 100);
      }


      // CAPTCHA
      if (m != 1 && score.innerText == 666) {
        m = 1;
        cimgreset();
        ad1.style.top = Math.random(Math.floor) * 20 + 40 + "%";
        ad1.style.left = Math.random(Math.floor) * 20 + 40 + "%";
        ad1.classList.remove('close');
        block.classList.add('hidden');
        setTimeout(function () { window.clearInterval(points); window.clearInterval(main); window.clearInterval(dims); }, 100);
        game.style.animationPlayState = 'paused';
        setTimeout(function () { m = 0 }, 100);
        setTimeout(function () {
          leftt(3);
        }, 100)
      }

      // UNDERWATER
      if (m != 1 && score.innerText == 350 || score.innerText == 1400) {
        m = 1;
        ad2.style.top = Math.random(Math.floor) * 20 + 40 + "%";
        ad2.style.left = Math.random(Math.floor) * 20 + 40 + "%";
        document.querySelector('.help').style.display = 'none';
        ad2.classList.remove('close');
        block.classList.add('hidden');
        document.querySelector('.underwater').play()
        document.querySelector('.underwater').volume = '.3';
        setTimeout(function () { window.clearInterval(points); window.clearInterval(main); window.clearInterval(dims); }, 100);
        game.style.animationPlayState = 'paused';
        setTimeout(function () { m = 0 }, 100);
        setTimeout(function () {
          document.querySelector('.help').style.display = 'flex';
          leftt(2);
        }, 6000)
      }

      // SOCIAL
      if (m != 1 && score.innerText == 1500) {
        m = 1;
        ad3.style.top = Math.random(Math.floor) * 20 + 40 + "%";
        ad3.style.left = Math.random(Math.floor) * 20 + 40 + "%";
        ad3.classList.remove('close');
        credits.innerText = sc;
        block.classList.add('hidden');
        leftt(1);
        document.querySelector('.chin').play()
        document.querySelector('.chin').volume = '.3';
        setTimeout(function () { window.clearInterval(points); window.clearInterval(main); window.clearInterval(dims); }, 100);
        game.style.animationPlayState = 'paused';
        setTimeout(function () { m = 0 }, 100)
      }

      // BSOD
      if (m != 1 && score.innerText == 500 || score.innerText == 600 || score.innerText == 1000) {
        m = 1;
        bsod.classList.remove('hidden');
        setTimeout(function () { m = 0 }, 100);
      }



      // OBROT
      if (m != 1 && score.innerText == 140 || score.innerText == 600) {
        m = 1;
        wrapper.style.transform = 'translate(-50%, -50%) rotate(180deg)';
        score.style.transform = 'rotate(180deg)';
        setTimeout(function () { m = 0 }, 100)
      }
      if (m != 1 && score.innerText == 240 || score.innerText == 700) {
        m = 1;
        wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        score.style.transform = 'rotate(0deg)';
        setTimeout(function () { m = 0 }, 100)
      }


      // ANNOY
      if (m != 1 && score.innerText == 100 || score.innerText == 1000 || score.innerText == 1700 || score.innerText == 2300 || score.innerText == 3100) {
        m = 1;
        ad5.style.top = Math.random(Math.floor) * 20 + 40 + "%";
        ad5.style.left = Math.random(Math.floor) * 20 + 40 + "%";
        ad5.classList.remove('close');
        setTimeout(function () { m = 0 }, 100);
        setTimeout(function () {

        }, 6000)
      }



    }, 10);
  }



}
//====================================================================================//

//                            MAXIMIZE POP WINDOW

function winmax(x) {
  if (x == 1) {
    // document.querySelector(".ad1").classList.add('max');
    // ad1.style.top = '50%';
    // ad1.style.left = '50%';
  }
  if (x == 2) {
    // document.querySelector(".ad2").classList.add('max');
    // ad2.style.top = '50%';
    // ad2.style.left = '50%';
  }
  if (x == 3) {
    document.querySelector(".ad3").classList.add('max');
    ad3.style.top = '50%';
    ad3.style.left = '50%';
  }
  return;
}

//====================================================================================//

//                            CLOSE POP WINDOW

var q = 0;
var credits = document.querySelector('.credits');
var sc = 1000
var r;

function winclose(x) {
  if (x == 1) {

  }
  if (x == 2) {

  }
  if (x == 3 && q != 1) {
    q = 1;
    setTimeout(() => {
      q = 0;
    }, 1200)
    if (skip == 1) {
      document.querySelector(".ad3").classList.add('close');
      block.classList.remove('hidden');
      window.clearInterval(s);
      setTimeout(function () { mainLoop() }, 100);
      document.querySelector('.chin').pause();
      document.querySelector('.chin').currentTime = 0;
      game.style.animationPlayState = 'running';
      skip = 0;
    }
    else {
      document.querySelector('.rock').play();
      document.querySelector('.rock').volume = '.3';
      setTimeout(() => {
        document.querySelector('.sus').classList.remove('hidden');
      }, 300);
      document.querySelector('.sus').style.left = Math.random(Math.floor) * 70 + 10 + "%";
      sc = sc - 1500;
      credits.innerText = sc;
      setTimeout(() => {
        document.querySelector('.sus').classList.add('hidden');
        document.querySelector('.rock').pause();
        document.querySelector('.rock').currentTime = 0
        q = 0;
      }, 1200);
    }
  }
  if (x == 4) {
    document.querySelector(".ad4").classList.add('close');
    document.querySelector('#vid').pause();
    return;
  }
  if (x == 5) {
    ad5.style.top = Math.random(Math.floor) * 80 + 10 + "%";
    ad5.style.left = Math.random(Math.floor) * 80 + 10 + "%";

    document.querySelector('.kod').innerText = Math.floor(Math.random() * 101 + 1);

    if (document.querySelector('.kod').innerText == 69) {
      ad5.classList.add('close');
      return;
    }
    return;
  }
}






//====================================================================================//

//                          SHOP TIMER / TIMER

var left = document.querySelector('.left');
var ct = document.querySelector('.ctimer');
var s;

function leftt(x) {
  if (x == 1) {
    left.innerText = 45;
    s = setInterval(function () {
      if (left.innerText != 0) {
        left.innerText--;
      }
      if (left.innerText == 0) {
        window.clearInterval(s);
        setTimeout(() => {
          document.querySelector(".ad3").classList.add('close');
          game.style.animationPlayState = 'running';
          block.classList.remove('hidden');
          mainLoop();
        }, 1000);
      }
    }, 1000);
    return;
  };

  if (x == 2) {
    left.innerText = 5;
    s = setInterval(function () {
      if (left.innerText != 0) {
        left.innerText--;
      }
      if (left.innerText == 0) {
        window.clearInterval(s);
        setTimeout(() => {
          document.querySelector(".ad2").classList.add('close');
          game.style.animationPlayState = 'running';
          block.classList.remove('hidden');
          mainLoop();
        }, 1000);
      }
    }, 1000);
    return;
  }

  if (x == 3) {
    b = Math.floor(Math.random() * 6 + 3);
    ct.innerText = b;
    s = setInterval(function () {
      if (ct.innerText != 0) {
        ct.innerText--;
      }
      if (ct.innerText == 0) {
        window.clearInterval(s);
        ded = 1;
        setTimeout(() => {
          document.querySelector(".ad1").classList.add('close');
          game.style.animationPlayState = 'running';
          block.classList.remove('hidden');
          mainLoop();
        }, 1000);
      }
    }, 1000);
    return;
  }
  return;
}

//====================================================================================//

//                          CHINA CREDIT TEST

var skip = 0;

function pyt(x) {

  // PYTANIE 1
  if (x == 0) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 1) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 0 || x == 1) {
    setTimeout(function () {
      document.querySelector('.pyt-1').style.display = 'none';
      document.querySelector('.pyt-2').style.display = 'flex';
      document.querySelector('.z').innerText = '2 z 6';
    }, 700);
  }




  // PYTANIE 2
  if (x == 2) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 3) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 2 || x == 3) {
    setTimeout(function () {
      document.querySelector('.pyt-2').style.display = 'none';
      document.querySelector('.pyt-3').style.display = 'flex';
      document.querySelector('.z').innerText = '3 z 6';
    }, 700);
  }




  // PYTANIE 3
  if (x == 5) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 4) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 4 || x == 5) {
    setTimeout(function () {
      document.querySelector('.pyt-3').style.display = 'none';
      document.querySelector('.pyt-4').style.display = 'flex';
      document.querySelector('.z').innerText = '4 z 6';
    }, 700);
  }




  // PYTANIE 4
  if (x == 6) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 7) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 6 || x == 7) {
    setTimeout(function () {
      document.querySelector('.pyt-4').style.display = 'none';
      document.querySelector('.pyt-5').style.display = 'flex';
      document.querySelector('.z').innerText = '5 z 6';
    }, 700);
  }



  // PYTANIE 5
  if (x == 9) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 8) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 8 || x == 9) {
    setTimeout(function () {
      document.querySelector('.pyt-5').style.display = 'none';
      document.querySelector('.pyt-6').style.display = 'flex';
      document.querySelector('.z').innerText = '6 z 6';
    }, 700);
  }



  // PYTANIE 6
  if (x == 11) {
    document.querySelector('.social').style.backgroundColor = 'red';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc - 500;
    credits.innerText = sc;
  }
  if (x == 10) {
    document.querySelector('.social').style.backgroundColor = 'yellow';
    setTimeout(() => {
      document.querySelector('.social').style.backgroundColor = 'transparent';
    }, 500);
    sc = sc + 1000;
    credits.innerText = sc;
  }
  if (x == 10 || x == 11) {
    setTimeout(function () {
      document.querySelector('.pyt-6').style.display = 'none';
      document.querySelector('.chinashop').style.display = 'flex';
      document.querySelector('.z').innerText = '';
      skip = 1;
    }, 700);
  }


}







//====================================================================================//

//                            CREDIT SHOP
function cshop(x) {
  if (x == 1) {
    if (sc >= 2000) {
      sc = sc - 2000;
      credits.innerText = sc;
      pkt = pkt + 100;
      score.innerText = pkt;
    }
    else {
      document.querySelector('.social').style.backgroundColor = 'red';
      setTimeout(() => {
        document.querySelector('.social').style.backgroundColor = 'transparent';
      }, 500);
    }
  }

  if (x == 2) {
    if (sc >= 4000) {
      sc = sc - 4000;
      credits.innerText = sc;
      pkt = pkt + 300;
      score.innerText = pkt;
    }
    else {
      document.querySelector('.social').style.backgroundColor = 'red';
      setTimeout(() => {
        document.querySelector('.social').style.backgroundColor = 'transparent';
      }, 500);
    }
  }

  if (x == 3) {
    if (sc >= 7000) {
      sc = sc - 7000;
      credits.innerText = sc;
      darek.style.backgroundImage = 'url(./img/dario/dario-gold-run.gif)';
      wrapper.style.outline = '10px solid gold'
      immortal = 1;
    }
    else {
      document.querySelector('.social').style.backgroundColor = 'red';
      setTimeout(() => {
        document.querySelector('.social').style.backgroundColor = 'transparent';
      }, 500);
    }

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

//                                  CAPTCHA
var s;
var cap = 0;
var good = 0;
var ctimer = 10;

function capt(x) {
  if (x == 1) {
    document.querySelector('.cimg1').style.transition = 'ease 1s';
    document.querySelector('.cimg1').style.opacity = '0';
    // cap = cap + 1;
    good = 1;
    setTimeout(function () {
      document.querySelector('.cimg1').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 3) {
    document.querySelector('.cimg3').style.transition = 'ease 1s';
    document.querySelector('.cimg3').style.opacity = '0';
    // cap = cap + 1;
    good = 1;
    setTimeout(function () {
      document.querySelector('.cimg3').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 9) {
    document.querySelector('.cimg9').style.transition = 'ease 1s';
    document.querySelector('.cimg9').style.opacity = '0';
    // cap = cap + 1;
    good = 1;
    setTimeout(function () {
      document.querySelector('.cimg9').style.visibility = 'hidden';
    }, 1000);
  }

  if (x == 2) {
    document.querySelector('.cimg2').style.transition = 'ease 1s';
    document.querySelector('.cimg2').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg2').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 4) {
    document.querySelector('.cimg4').style.transition = 'ease 1s';
    document.querySelector('.cimg4').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg4').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 5) {
    document.querySelector('.cimg5').style.transition = 'ease 1s';
    document.querySelector('.cimg5').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg5').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 6) {
    document.querySelector('.cimg6').style.transition = 'ease 1s';
    document.querySelector('.cimg6').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg6').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 7) {
    document.querySelector('.cimg7').style.transition = 'ease 1s';
    document.querySelector('.cimg7').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg7').style.visibility = 'hidden';
    }, 1000);
  }
  if (x == 8) {
    document.querySelector('.cimg8').style.transition = 'ease 1s';
    document.querySelector('.cimg8').style.opacity = '0';
    cap = 1;
    setTimeout(function () {
      document.querySelector('.cimg8').style.visibility = 'hidden';
    }, 1000);
  }


}


function ccheck() {
  if (cap == 0) {
    document.querySelector(".ad1").classList.add('close');
    game.style.animationPlayState = 'running';
    block.classList.remove('hidden');
    window.clearInterval(s);
    mainLoop();
  }
  else {
    document.querySelector('.captcha-top').style.backgroundColor = 'red';
    document.querySelector('.captchacont button').style.backgroundColor = 'red';

  }
}





//====================================================================================//

//                              HELP THE INDIAN

var l = 0;

function help(x) {
  if (x == 1) {
    if (l != 1) {
      l = 1;
      pkt = pkt + 100;
      score.innerText = pkt;
      setTimeout(() => {
        l = 0;
      }, 10000);
      return;
    }
  }
  if (x == 2) {
    if (l != 1) {
      l = 1;
      document.querySelector('.underwater').volume = '.3';
      document.querySelector('.virus').play();
      setTimeout(() => {
        l = 0;
      }, 10000);
      return;
    }
  }
}




//====================================================================================//

//                            GLITCH TEXT EFFECT

// const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// function generateString(length) {
//   let result = ' ';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }

//   return result;
// }

// setInterval(function () {
//   document.querySelector('.glitch').innerText = generateString(10);
// }, 50);

//====================================================================================//




// kabelki
// rownania mika
// tarcza i na srodek tam ten



// catptcha żerdzinskiego  DONE




// zloty zerdzinski ma 2 zycia
