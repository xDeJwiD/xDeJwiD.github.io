// KOLORY TLA PO NAJECHANIU -------------------------------------------------------------
function cyan() {
    document.querySelector('body').style.backgroundColor = 'var(--maincyan)';
}

function gold() {
    document.querySelector('body').style.backgroundColor = 'var(--maingold)';
}

function normal() {
    document.querySelector('body').style.backgroundColor = 'var(--mainpink)';
}
// ----------------------------------------------------------------------------------------

// KAFELKA Z GRAMI ------------------------------------------------------------------------
function gry() {
    document.querySelector('.section-games-panel').classList.remove('hidden');
    document.querySelector('.gry').classList.add('hidden');
}

function niegry() {
    document.querySelector('.section-games-panel').classList.add('hidden');
    document.querySelector('.gry').classList.remove('hidden');
}
// ----------------------------------------------------------------------------------------

// ZARTY ----------------------------------------------------------------------------------
function joke() {
    // document.getElementById("joke-panel").classList.remove('hidden')
    document.querySelector('#joke-panel').classList.remove('hidden');
}

function niejoke() {
    // document.getElementById("joke-panel").classList.remove('hidden')
    document.querySelector('#joke-panel').classList.add('hidden');
}
// ----------------------------------------------------------------------------------------

// LOGIN ----------------------------------------------------------------------------------
function login() {
    document.querySelector('#login-panel').classList.remove('hidden');
    // document.querySelector('body').style.backgroundColor = 'var(--maincyan)';
}

function nielogin() {
    document.querySelector('#login-panel').classList.add('hidden');
    // document.querySelector('body').style.backgroundColor = 'var(--mainpink)';
}
// ----------------------------------------------------------------------------------------

// REGISTER -------------------------------------------------------------------------------
function register() {
    document.querySelector('#register-panel').classList.remove('hidden');
}

function nieregister() {
    document.querySelector('#register-panel').classList.add('hidden');
}
// ----------------------------------------------------------------------------------------

// NIE MAM KONTA --------------------------------------------------------------------------
function niemamkonta() {
    document.querySelector('#login-panel').classList.add('hidden');
    document.querySelector('#register-panel').classList.remove('hidden');
}
// ----------------------------------------------------------------------------------------

// MAM JEDNAK KONTO -----------------------------------------------------------------------
function mamjednakkonto() {
    document.querySelector('#login-panel').classList.remove('hidden');
    document.querySelector('#register-panel').classList.add('hidden');
}
// ----------------------------------------------------------------------------------------