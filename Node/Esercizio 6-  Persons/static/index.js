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
        a.appendTo(_lstNazioni)
       }
    })
})