// function test() {
//     document.getElementById('h').innerHTML = ''
    
//     var cos = document.getElementById('pesel').value
//     var dlu = document.getElementById('pesel').lenght

    

//     if (cos.value == 11) {
//         document.getElementById('h').innerHTML ='Tak :D'

//     } else {
//         document.getElementById('h').innerHTML ='Nie :P'
//     }
    // if (cos.lenght == 11) {
    //     document.getElementById('h').innerHTML =''
    //     document.getElementById('h').innerHTML ='Oj tak :)'

    // } 

    

    // if (cos [2] > 3) {
    //     document.getElementById('h').innerHTML+='nie nie nie'
    //     return 2
    // }

    // cos[9] % 2 == 0 ? document.getElementById('plec').innerHTML = 'kobieta' : document.getElementById('plec').innerHTML = "mezczyzna"
// }


// function calc() {
//     var ogloszenia = ogl.value
    
    
//     if(ogloszenia <= 40) {
//         var cena = ogloszenia * 3;
//         document.getElementById('h').innerHTML = "Cena = " + cena;
//     } else {
//         var cena = ogloszenia * 2;
//         document.getElementById('h').innerHTML = "Cena = " + cena;
//     }

//     if(ogloszenia == 333) {
//         var cena = ogloszenia * 2;
//         document.getElementById('h').innerHTML = "Cena = " + cena + " >:)";
//     }

//     if(d.checked) {
//         var cena = cena * 0.3;
//         document.getElementById('h').innerHTML = "Cena = " + cena;
//     }
// }

function calc() {
    var metr = document.getElementById('metr').value
    var pok = document.getElementById('pok').value
    var cena = 0

    cena = metr * 4000 + pok * 200

    if (d.checked) {
        cena = cena + 200
    }
    if (e.checked) {
        cena = cena + 1500
    }
    if (f.checked) {
        cena = cena + 500
    }

    document.getElementById('h').innerHTML = "Cena wynosi " + cena;
}