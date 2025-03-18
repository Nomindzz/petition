// Funktion zum Setzen eines Cookies
function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); 
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Funktion zum Abrufen eines Cookies
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

document.getElementById("unterschreibenButton").addEventListener("click", function() {
    // Überprüfe, ob der Benutzer bereits unterschrieben hat
    if (getCookie('hasSigned') === 'true') {
        alert('Du hast bereits unterschrieben!');
        return;  // Verhindert, dass das Popup angezeigt wird
    }
    document.getElementById("popup").classList.add('show'); 
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("popup").classList.remove('show'); 
});

document.getElementById("submitButton").addEventListener("click", function() {
    // Hole die Werte aus den Input-Feldern
    var vorname = document.getElementById("vorname").value;
    var nachname = document.getElementById("nachname").value;
    var jahrgang = document.getElementById("jahrgang").value;

    // Sende die Daten an das Backend (Flask)
    fetch('http://10.223.37.200:5000/unterschreiben', {  // Ändere die URL hier
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vorname: vorname,
            nachname: nachname,
            jahrgang: jahrgang
        })
    })
    .then(response => response.json())
    .then(data => {
        // Überprüfen, ob die Antwort den Status "error" enthält
        if (data.status === 'error') {
            alert(data.message);  // Zeigt eine Nachricht an, falls der Benutzer bereits unterschrieben hat
        } else {
            alert('Danke für deine Unterschrift!');  // Bestätigung, wenn die Unterschrift erfolgreich gespeichert wurde
            setCookie('hasSigned', 'true', 365);  // Setzt den Cookie, dass der Benutzer unterschrieben hat
        }
        document.getElementById("popup").classList.remove('show'); // Popup schließen mit Animation
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Etwas ist schiefgegangen!');
    });
});

