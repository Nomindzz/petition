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

document.addEventListener("DOMContentLoaded", function() {
    // Sicherstellen, dass alle Elemente existieren
    const unterschreibenButton = document.getElementById("unterschreibenButton");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const submitButton = document.getElementById("submitButton");

    if (!unterschreibenButton || !popup || !closePopup || !submitButton) {
        console.error("Ein oder mehrere Elemente wurden nicht gefunden!");
        return;
    }

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
            var c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Unterschreiben-Button
    unterschreibenButton.addEventListener("click", function() {
        if (getCookie('hasSigned') === 'true') {
            alert('Du hast bereits unterschrieben!');
            return;
        }
        console.log("Popup wird angezeigt");  // Debugging
        popup.classList.add('show');
    });

    // Schließen-Button
    closePopup.addEventListener("click", function() {
        popup.classList.remove('show');
    });

    // Absenden-Button
    submitButton.addEventListener("click", function() {
        var vorname = document.getElementById("vorname").value;
        var nachname = document.getElementById("nachname").value;
        var jahrgang = document.getElementById("jahrgang").value;

        if (!vorname || !nachname || !jahrgang) {
            alert("Bitte alle Felder ausfüllen!");
            return;
        }

        fetch('https://schimmeltuerken.pythonanywhere.com/unterschreiben', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vorname, nachname, jahrgang })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error') {
                alert(data.message);
            } else {
                alert('Danke für deine Unterschrift!');
                setCookie('hasSigned', 'true', 365);
            }
            popup.classList.remove('show');
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Etwas ist schiefgegangen! Stelle sicher, dass du online bist.');
        });
    });
});
