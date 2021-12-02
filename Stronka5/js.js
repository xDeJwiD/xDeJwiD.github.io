function test() {
    document.getElementById('h').innerHTML = ''
    
    var cos = document.getElementById('pesel').value
    var dlu = document.getElementById('pesel').lenght

    

    if (cos.value == 11) {
        document.getElementById('h').innerHTML ='Tak :D'

    } else {
        document.getElementById('h').innerHTML ='Nie :P'
    }
    // if (cos.lenght == 11) {
    //     document.getElementById('h').innerHTML =''
    //     document.getElementById('h').innerHTML ='Oj tak :)'

    // } 

    

    // if (cos [2] > 3) {
    //     document.getElementById('h').innerHTML+='nie nie nie'
    //     return 2
    // }

    // cos[9] % 2 == 0 ? document.getElementById('plec').innerHTML = 'kobieta' : document.getElementById('plec').innerHTML = "mezczyzna"
}
