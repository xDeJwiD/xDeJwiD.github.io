function dodawanie(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = liczbajeden + liczbadwa;
    document.getElementById('wynik+').innerHTML = wynik
}
function odejmowanie(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = liczbajeden - liczbadwa;
    document.getElementById('wynik+').innerHTML = wynik;
}
function mnożenie(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = liczbajeden * liczbadwa;
    document.getElementById('wynik+').innerHTML = wynik;
}
function dzielenie(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
    
    if(liczbadwa == 0){
        document.getElementById("wynik+").innerHTML = "0IQ jak dzielisz przez 0";
    }
    else{
        var wynik = liczbajeden / liczbadwa;
        document.getElementById('wynik+').innerHTML = wynik;
    }
   
}

function potegowanie(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = liczbajeden ** liczbadwa;
    document.getElementById('wynik+').innerHTML = wynik;
}
function modulo(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = liczbajeden % liczbadwa;
    document.getElementById('wynik+').innerHTML = wynik;
}
function inkrementacja(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = "liczba 1 ++ = " + String(++liczbajeden) + "Liczba 2 ++ =" + String(++liczbadwa);
    document.getElementById('wynik+').innerHTML = wynik;
}
function dekrementacja(){
    var liczbajeden = Number( document.getElementById("liczbajeden").value);
    var liczbadwa = Number( document.getElementById("liczbadwa").value);
   var wynik = "liczba 1 -- = " +  String(--liczbajeden) + "Liczba 2 -- =" +  String(--liczbadwa);
    document.getElementById('wynik+').innerHTML = wynik;
}
