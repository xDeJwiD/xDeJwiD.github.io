function test() {
    document.getElementById('h').innerHTML = ''
    
    var cos = document.getElementById('pesel').value

    

    if (cos.lenght != 11) {
        document.getElementById('h').innerHTML =''
        document.getElementById('h').innerHTML ='nie'

    }
    if (cos.lenght == 11) {
        document.getElementById('h').innerHTML =''
        document.getElementById('h').innerHTML ='Tak :D'
    }
    // if (cos.lenght == 11) {
    //     document.getElementById('h').innerHTML =''
    //     document.getElementById('h').innerHTML ='Oj tak :)'

    // } 

    if (cos.include('-') == true) {

    }

    if (cos [2] > 3) {
        document.getElementById('h').innerHTML+='nie nie nie'
        return 2
    }

    cos[9] % 2 == 0 ? document.getElementById('plec').innerHTML = 'kobieta' : document.getElementById('plec').innerHTML = "mezczyzna"
}
