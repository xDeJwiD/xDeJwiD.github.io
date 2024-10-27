var przelacznik = 0;

function liczba(ile) {
    if (przelacznik == 0) {
        pole1.value += ile;
    }
    if (przelacznik == 1) {
        pole3.value += ile;
    }
}

function znak(zn) {
    
    
    
    
    
    
    
    
    
    
    
    
    pole2.value = zn;
    przelacznik = 1;
}

function oblicz() {
    znakDzialania = document.kalkulator.pole2.value;

    switch (znakDzialania) 
    {
        case '+':
            alert(document.kalk.pole1.value *1) + parseInt(document.kalk.pole3.value)
    }
}