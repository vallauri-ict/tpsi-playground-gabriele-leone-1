"use strict"
$(document).ready(function () {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");
    let selectedNation
    _divDettagli.hide()
    let requestNazioni = inviaRichiesta("GET", "/api/nazioni") //tipo promise 
    requestNazioni.fail(errore);
    requestNazioni.done(function (data) {
        console.log(data)
        for (const naz of data.nazioni) {
            let a = $("<a>")
            a.prop("class", "dropdown-item")
            a.prop("href", "#")
            a.text(naz)
            a.val(naz)
            a.prop("id", naz)
            a.on("click", visualizzaPersone)
            a.appendTo(_lstNazioni)
        }
    })

    function visualizzaPersone() {
        if($(this).text()){
            selectedNation=$(this).text()
        }
        let requestPersone = inviaRichiesta("GET", "/api/persone", { "nazione": selectedNation }) //passarli in json così
        requestPersone.fail(errore);
        requestPersone.done(function (persons) {
            console.log(persons)
            _tabStudenti.empty()
            for (const person of persons) {
                let tr = $("<tr>").appendTo(_tabStudenti)
                for (const key in person) {
                    $("<td>").appendTo(tr).html(person[key]) //noi dobbiamo cercare la chiave che ha valore il contenuto di key non posso fare .key
                }
                let td = $("<td>").appendTo(tr)
                $("<button>").appendTo(td).html("dettagli").on("click", dettagli).prop("name", person.name) //normale
                td = $("<td>").appendTo(tr)
                $("<button>").appendTo(td).html("elimina").addClass("elimina").prop("name", person.name) //con selettori
            }
        })
    }
    //delegated events allegare l'evento al genitore non al figlio
    //questo pseudoselettore tutti i button che contengono nel loro testo elimina :
    //_tabStudenti.on("click","button:contains(elimina)",function(){}
    //invece questo selettore punta ai button che implementano la classe elimina:
    _tabStudenti.on("click", ".elimina", elimina)

    function dettagli() {
        let requestDettagli = inviaRichiesta("PATCH", "/api/dettagli", {
            "person": $(this).prop("name")
        });
        requestDettagli.fail(errore)
        let name = $(this).prop("name")
        requestDettagli.done(function (person) {
            console.log(person)
            _divDettagli.show(1000)
            $(".card-img-top").prop("src", person.picture.thumbnail)
            $(".card-title").html(name)
            let s = "<b>gender:</b> " + person.gender + "</br>"
            s += "<b> email:</b>" + JSON.stringify(person.email) + "</br>"
            s += "<b> address:</b>" + JSON.stringify(person.location) + "</br>"
            s += "<b> dob:</b>" + JSON.stringify(person.dob) + "</br>"
            $(".card-text").html(s)
        })
        
    }

    function elimina() {
        let name = $(this).prop("name")
        let requestElimina = inviaRichiesta("DELETE", "/api/elimina", { person: name })
        requestElimina.fail(errore)
        requestElimina.done(function(data){
            alert(data)
            visualizzaPersone()
        })
    }

    //GESTIONE PULSANTI DA FARE
})