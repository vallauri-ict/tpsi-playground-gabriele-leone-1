"use strict"



$(document).ready(function () {
    let wrapper=$("#wrapper")
    let news=$("#news")
    let requestElenco=inviaRichiesta("GET","/api/elenco")
    requestElenco.fail(errore)
    requestElenco.done(function(data){
        console.log(data)
        let i=0
        for (const object of data) {
            let titolo=$("<span class='titolo'>")
            titolo.text(data[i].titolo)
            titolo.appendTo(wrapper)

            let leggi=$("<a>")
            leggi.prop("id",data[i].file)
            leggi.prop("vis",i)
            leggi.prop("href","#")
            leggi.text("Leggi")
            leggi.appendTo(wrapper)

            let visual=$("<span class='nVis'>")
            visual.text("[visualizzato "+data[i].visualizzazioni+" volte]")
            visual.appendTo(wrapper)
            let br=$("<br>")
            br.appendTo(wrapper)

            i++
        }
    })

    wrapper.on("click","a",dettagli)

    function dettagli(){
        let param={
            "name":$(this).prop("id"),
            "visual":$(this).prop("vis")
        }
        let requestDettagli=inviaRichiesta("POST","/api/dettagli",param)
        requestDettagli.fail(errore)
        requestDettagli.done(function(data){
            console.log(data)
            news.html(data)
        })
    }
    
})