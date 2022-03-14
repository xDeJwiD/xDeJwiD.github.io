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
    if (lpanel.classList != 'max' && x == 1 && blocked != 1) {
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

function rightPanel(x) {
    if (x == 1) {
        home.classList.remove('hidden');
        shop.classList.add('hidden');
        games.classList.add('hidden');
    }
    if (x == 2) {
        home.classList.add('hidden');
        shop.classList.remove('hidden');
        games.classList.add('hidden');
    }
    if (x == 3) {
        home.classList.add('hidden');
        shop.classList.add('hidden');
        games.classList.remove('hidden');
    }
}
