"use strict"
$(document).ready(function () {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide()
    let requestNazioni = inviaRichiesta("GET", "/api/nazioni") //tipo promise 
    requestNazioni.fail(errore);
    requestNazioni.done(function (data) {
        console.log(data)
       for (const naz of data.nazioni) {
        let a=$("<a>")
        a.prop("class","dropdown-item")
        a.prop("href","#")
        a.text(naz)
        a.val(naz)
        a.prop("id",naz)
        a.on("click",visualizzaPersone)
        a.appendTo(_lstNazioni)
       }
    })

    function visualizzaPersone(){
        let param=$(this).text()
        console.log(param)
        let requestPersone=inviaRichiesta("GET","/api/persone",{"nazione":param}) //passarli in json così
        requestPersone.fail(errore);
        requestPersone.done(function(persons){
            console.log(persons)
            _tabStudenti.empty()
            for (const person of persons) {
                let tr=$("<tr>").appendTo(_tabStudenti)
                for (const key in person) {
                    $("<td>").appendTo(tr).html(person[key]) //noi dobbiamo cercare la chiave che ha valore il contenuto di key non posso fare .key
                }
                let td=$("<td>").appendTo(tr)
                $("<button>").appendTo(td).html("dettagli")
                td=$("<td>").appendTo(tr)
                $("<button>").appendTo(td).html("elimina")
            }
        })
    }

    

})