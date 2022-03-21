var root = document.querySelector(':root');


var themes = document.querySelectorAll('.themepicker .themeslist .theme');

var theme1 = document.querySelector('.style1');
var theme2 = document.querySelector('.style2');
var theme3 = document.querySelector('.style3');
var theme4 = document.querySelector('.style4');
var theme5 = document.querySelector('.style5');

var theme6 = document.querySelector('.style6');
var theme7 = document.querySelector('.style7');
var theme8 = document.querySelector('.style8');
var theme9 = document.querySelector('.style9');
var theme10 = document.querySelector('.style10');




function themeSelect(x) {
    for (var i = 0; i < themes.length; i++) {
        var str = themes[i];
        themes[i].classList.remove('themeSelected');
    }
    if (x == 1) {
        theme1.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(11, 0, 21)');
        root.style.setProperty('--main', 'rgb(119, 0, 255)');
        root.style.setProperty('--main-dark', 'rgb(65, 0, 118)');
        root.style.setProperty('--main-darker', 'rgb(24, 0, 44)');
        root.style.setProperty('--main-sdarker', 'rgb(35, 0, 63)');
        root.style.setProperty('--main-text', 'rgb(153, 64, 255)');
        root.style.setProperty('--main-left-acc', 'rgb(61, 0, 130)');
        root.style.setProperty('--main-left-list', 'rgb(153, 64, 255)');
        root.style.setProperty('--blocked', 'rgb(80, 0, 172)');
        root.style.setProperty('--not-blocked', 'rgb(119, 0, 255)');
    }
    if (x == 2) {
        theme2.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(0, 28, 27)');
        root.style.setProperty('--main', 'rgb(0, 255, 251)');
        root.style.setProperty('--main-dark', 'rgb(0, 182, 179)');
        root.style.setProperty('--main-darker', 'rgb(0, 136, 134)');
        root.style.setProperty('--main-sdarker', 'rgb(0, 89, 87)');
        root.style.setProperty('--main-text', 'rgb(0, 24, 23)');
        root.style.setProperty('--main-left-acc', 'rgb(0, 72, 70)');
        root.style.setProperty('--main-left-list', 'rgb(0, 174, 171)');
        root.style.setProperty('--blocked', 'rgb(0, 82, 80)');
        root.style.setProperty('--not-blocked', 'rgb(0, 255, 251)');
    }
    if (x == 3) {
        theme3.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(0, 0, 0)');
        root.style.setProperty('--main', 'rgb(119, 119, 119)');
        root.style.setProperty('--main-dark', 'rgb(80, 80, 80)');
        root.style.setProperty('--main-darker', 'rgb(26, 26, 26)');
        root.style.setProperty('--main-sdarker', 'rgb(14, 14, 14)');
        root.style.setProperty('--main-text', 'rgb(221, 221, 221)');
        root.style.setProperty('--main-left-acc', 'rgb(46, 46, 46)');
        root.style.setProperty('--main-left-list', 'rgb(177, 177, 177)');
        root.style.setProperty('--blocked', 'rgb(53, 53, 53)');
        root.style.setProperty('--not-blocked', 'rgb(109, 109, 109)');
    }
    if (x == 4) {
        theme4.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(9, 8, 0)');
        root.style.setProperty('--main', 'rgb(255, 238, 0)');
        root.style.setProperty('--main-dark', 'rgb(138, 129, 0)');
        root.style.setProperty('--main-darker', 'rgb(65, 60, 0)');
        root.style.setProperty('--main-sdarker', 'rgb(24, 22, 0)');
        root.style.setProperty('--main-text', 'rgb(255, 238, 0)');
        root.style.setProperty('--main-left-acc', 'rgb(121, 113, 0)');
        root.style.setProperty('--main-left-list', 'rgb(189, 176, 0)');
        root.style.setProperty('--blocked', 'rgb(97, 91, 0)');
        root.style.setProperty('--not-blocked', 'rgb(155, 145, 0)');
    }
    if (x == 5) {
        theme5.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(4, 0, 0)');
        root.style.setProperty('--main', 'rgb(177, 0, 0)');
        root.style.setProperty('--main-dark', 'rgb(150, 0, 0)');
        root.style.setProperty('--main-darker', 'rgb(104, 0, 0)');
        root.style.setProperty('--main-sdarker', 'rgb(38, 0, 0)');
        root.style.setProperty('--main-text', 'rgb(0, 0, 0)');
        root.style.setProperty('--main-left-acc', 'rgb(75, 0, 0)');
        root.style.setProperty('--main-left-list', 'rgb(155, 0, 0)');
        root.style.setProperty('--blocked', 'rgb(102, 0, 0)');
        root.style.setProperty('--not-blocked', 'rgb(136, 0, 0)');
    }


    // FERRARI
    if (x == 6) {
        theme6.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(84, 0, 0)');
        root.style.setProperty('--main', 'rgb(255, 217, 0)');
        root.style.setProperty('--main-dark', 'rgb(192, 0, 0)');
        root.style.setProperty('--main-darker', 'rgb(131, 0, 0)');
        root.style.setProperty('--main-sdarker', 'rgb(75, 0, 0)');
        root.style.setProperty('--main-text', 'rgb(255, 225, 0)');
        root.style.setProperty('--main-left-acc', 'rgb(148, 0, 0)');
        root.style.setProperty('--main-left-list', 'rgb(255, 225, 0)');
        root.style.setProperty('--blocked', 'rgb(170, 150, 0)');
        root.style.setProperty('--not-blocked', 'rgb(255, 255, 0)');
    }

    if (x == 7) {
        theme7.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(60, 0, 68)');
        root.style.setProperty('--main', 'rgb(102, 202, 255)');
        root.style.setProperty('--main-dark', 'rgb(194, 51, 165)');
        root.style.setProperty('--main-darker', 'rgb(107, 21, 124)');
        root.style.setProperty('--main-sdarker', 'rgb(59, 0, 79)');
        root.style.setProperty('--main-text', 'rgb(102, 202, 255)');
        root.style.setProperty('--main-left-acc', 'rgb(107, 21, 124)');
        root.style.setProperty('--main-left-list', 'rgb(102, 202, 255)');
        root.style.setProperty('--blocked', 'rgb(53, 143, 192)');
        root.style.setProperty('--not-blocked', 'rgb(102, 202, 255)');
    }

    if (x == 8) {
        theme8.classList.add('themeSelected');

        root.style.setProperty('--bg', 'rgb(22, 22, 22)');
        root.style.setProperty('--main', 'rgb(208, 255, 0)');
        root.style.setProperty('--main-dark', 'rgb(70, 70, 70)');
        root.style.setProperty('--main-darker', 'rgb(34, 34, 34)');
        root.style.setProperty('--main-sdarker', 'rgb(208, 255, 0)');
        root.style.setProperty('--main-text', 'rgb(208, 255, 0)');
        root.style.setProperty('--main-left-acc', 'rgb(34, 34, 34)');
        root.style.setProperty('--main-left-list', 'rgb(208, 255, 0)');
        root.style.setProperty('--blocked', 'rgb(146, 179, 0)');
        root.style.setProperty('--not-blocked', 'rgb(208, 255, 0)');
    }

}



root.style.setProperty('--bg', '');
root.style.setProperty('--main', '');
root.style.setProperty('--main-dark', '');
root.style.setProperty('--main-darker', '');
root.style.setProperty('--main-sdarker', '');
root.style.setProperty('--main-text', '');
root.style.setProperty('--main-left-acc', '');
root.style.setProperty('--main-left-list', '');
root.style.setProperty('--blocked', '');
root.style.setProperty('--not-blocked', '');

