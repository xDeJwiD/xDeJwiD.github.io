var lpanel = document.querySelector('#left-panel');
var minmax = document.querySelector('#minmax');
var acc = document.querySelector('#account');
var blocked = 0;


const scrollContainer1 = document.querySelector("#right-panel .top");
const scrollContainer2 = document.querySelector("#right-panel .bottom");

scrollContainer1.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer1.scrollLeft += evt.deltaY * 3;
    return;
});
// scrollContainer2.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer2.scrollLeft += evt.deltaY * 3;
//     return;
// });

setInterval(() => {
    if (window.innerWidth <= 800) {
        lpanel.classList.remove('max');
        minmax.style.background = 'var(--blocked)';
        minmax.disabled = true;
        document.querySelector('.bi-arrow-bar-right').classList.add('hidden');
        document.querySelector('.bi-unlock-fill').classList.add('hidden');
        document.querySelector('.bi-lock-fill').classList.remove('hidden');
    }
    if (window.innerWidth >= 800 && lpanel.classList != 'max') {
        minmax.style.background = 'var(--not-blocked)';
        minmax.disabled = false;
        document.querySelector('.bi-arrow-bar-right').classList.remove('hidden');
        document.querySelector('.bi-unlock-fill').classList.add('hidden');
        document.querySelector('.bi-lock-fill').classList.add('hidden');
    }
}, 10);

function maxed(x) {


    if (lpanel.classList != 'max' && x == 0) {
        lpanel.classList.add('max');
        blocked = 0;
        document.querySelector('.bi-arrow-bar-right').classList.add('hidden');
        document.querySelector('.bi-unlock-fill').classList.remove('hidden');
        document.querySelector('.bi-lock-fill').classList.add('hidden');
        return;
    }
    if (lpanel.classList == 'max' && blocked == 0 && x == 0) {
        blocked = 1;
        minmax.style.background = 'var(--blocked)';
        document.querySelector('.bi-arrow-bar-right').classList.add('hidden');
        document.querySelector('.bi-unlock-fill').classList.add('hidden');
        document.querySelector('.bi-lock-fill').classList.remove('hidden');
        return;
    }
    if (lpanel.classList == 'max' && blocked == 1 && x == 0) {
        blocked = 0;
        minmax.style.background = 'var(--not-blocked)';
        document.querySelector('.bi-arrow-bar-right').classList.add('hidden');
        document.querySelector('.bi-unlock-fill').classList.remove('hidden');
        document.querySelector('.bi-lock-fill').classList.add('hidden');
    }


    //      ACCOUNT
    if (lpanel.classList != 'max' && blocked != 2 && x == 1) {
        blocked = 0;
        lpanel.classList.add('max');
        document.querySelector('.bi-arrow-bar-right').classList.add('hidden');
        document.querySelector('.bi-unlock-fill').classList.remove('hidden');
        document.querySelector('.bi-lock-fill').classList.add('hidden');
        return;
    }

}

function maxedOnLeave() {
    if (lpanel.classList == 'max' && blocked != 1) {
        lpanel.classList.remove('max');
        blocked = 0;
        minmax.style.background = 'var(--not-blocked)';
        document.querySelector('.bi-arrow-bar-right').classList.remove('hidden');
        document.querySelector('.bi-unlock-fill').classList.add('hidden');
        document.querySelector('.bi-lock-fill').classList.add('hidden');
        acc.classList.remove('max');
    }
}






var home = document.querySelector('#right-panel .home');
var shop = document.querySelector('#right-panel .shop');
var games = document.querySelector('#right-panel .games');
var info = document.querySelector('#right-panel .info');
var login = document.querySelector('#right-panel .loginsec');

function rightPanel(x) {
    if (x == 1) {
        home.classList.remove('hidden');
        shop.classList.add('hidden');
        games.classList.add('hidden');
        info.classList.add('hidden');
        login.classList.add('hidden');
    }
    if (x == 2) {
        home.classList.add('hidden');
        shop.classList.remove('hidden');
        games.classList.add('hidden');
        info.classList.add('hidden');
        login.classList.add('hidden');
    }
    if (x == 3) {
        home.classList.add('hidden');
        shop.classList.add('hidden');
        games.classList.remove('hidden');
        info.classList.add('hidden');
        login.classList.add('hidden');
    }
    if (x == 4) {
        home.classList.add('hidden');
        shop.classList.add('hidden');
        games.classList.add('hidden');
        info.classList.remove('hidden');
        login.classList.add('hidden');
    }

    if (x == 6) {
        home.classList.add('hidden');
        shop.classList.add('hidden');
        games.classList.add('hidden');
        info.classList.add('hidden');
        login.classList.remove('hidden');
    }
}








// LOGIN
var fornick = document.querySelector("#right-panel label[for='nick']");
var nick = document.querySelector("#right-panel #nick");

var forpass = document.querySelector("#right-panel label[for='pass']");
var pass = document.querySelector("#right-panel #pass");


// REGISTER
var forrnick = document.querySelector("#right-panel label[for='rnick']");
var rnick = document.querySelector("#right-panel #rnick");

var forrpass = document.querySelector("#right-panel label[for='rpass']");
var rpass = document.querySelector("#right-panel #rpass");

var forrrpass = document.querySelector("#right-panel label[for='rrpass']");
var rrpass = document.querySelector("#right-panel #rrpass");

function active(x) {
    // LOGIN
    if (x == 1) {
        if (x == 1 && nick.value == '') {
            fornick.classList.add('clicked');
            setInterval(() => {
                if (nick.value !== '') {
                    fornick.classList.add('clicked');
                    return;
                }
            }, 100);
            setTimeout(() => {
                if (nick.value == '') {
                    fornick.classList.remove('clicked');
                    return;
                }
            }, 3000);
            return;
        }
    }
    if (x == 2) {
        if (x == 2 && pass.value == '') {
            forpass.classList.add('clicked');
            setInterval(() => {
                if (nick.value !== '') {
                    forpass.classList.add('clicked');
                    return;
                }
            }, 100);
            setTimeout(() => {
                if (nick.value == '') {
                    forpass.classList.remove('clicked');
                    return;
                }
            }, 3000);
            return;
        }
    }



    // REGISTER
    if (x == 3) {
        if (x == 3 && rnick.value == '') {
            forrnick.classList.add('clicked');
            setInterval(() => {
                if (rnick.value !== '') {
                    forrnick.classList.add('clicked');
                    return;
                }
            }, 100);
            setTimeout(() => {
                if (rnick.value == '') {
                    forrnick.classList.remove('clicked');
                    return;
                }
            }, 3000);
            return;
        }
    }
    if (x == 4) {
        if (x == 4 && rpass.value == '') {
            forrpass.classList.add('clicked');
            setInterval(() => {
                if (rpass.value !== '') {
                    forrpass.classList.add('clicked');
                    return;
                }
            }, 100);
            setTimeout(() => {
                if (rpass.value == '') {
                    forrpass.classList.remove('clicked');
                    return;
                }
            }, 3000);
            return;
        }
    }
    if (x == 5) {
        if (x == 5 && rrpass.value == '') {
            forrrpass.classList.add('clicked');
            setInterval(() => {
                if (rrpass.value !== '') {
                    forrrpass.classList.add('clicked');
                    return;
                }
            }, 100);
            setTimeout(() => {
                if (rrpass.value == '') {
                    forrrpass.classList.remove('clicked');
                    return;
                }
            }, 3000);
            return;
        }
    }
}


var hidelogin = document.querySelector("#right-panel .logincont");
var hideregister = document.querySelector("#right-panel .registercont");

function noaccount(x) {
    if (x==1){
        hideregister.classList.remove('hidden');
        hideregister.classList.add('smooth');
        hidelogin.style.height = "0%";

        setTimeout(() => {
            hidelogin.classList.add('hidden');
        }, 1100);
    }
}