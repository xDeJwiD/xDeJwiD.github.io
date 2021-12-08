function siem() {
    var imiee = document.getElementById('imie').value;
    var nazww = document.getElementById('nazw').value;
    var emaill = document.getElementById('mail').value;
    var selee = document.getElementById('sele').value;

    document.getElementById('test').innerHTML = imiee + ' ' + nazww +' ' + emaill + "<br>" + selee;
}