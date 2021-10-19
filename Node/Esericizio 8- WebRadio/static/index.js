

$(document).ready(function () {
    let lstRegioni = $("#lstRegioni")
    let table = $("#tbody")
    let requestElenco = inviaRichiesta("GET", "/api/elenco")
    requestElenco.fail(errore)
    requestElenco.done(function (data) {
        console.log(data)
        for (const region of data.elenco) {
            let opt = $("<option>")
            opt.val(region.name)
            opt.text(region.name + " " + "[" + region.station + " emittenti]")
            opt.appendTo(lstRegioni)
        }
    })

    lstRegioni.on("change", radios)

    function radios() {
        console.log($(this).val())
        let requestRadio = inviaRichiesta("POST", "/api/radios", { "name": $(this).val() })
        requestRadio.fail(errore)
        requestRadio.done(function (data) {
            table.empty()
            console.log(data)
            for (const radio of data.radio) {
                let tr = $("<tr>")
                tr.appendTo(table)
                let td = $("<td>")
                let img = $("<img>")
                img.prop("src", radio.favicon)
                img.prop("width", "40")
                img.appendTo(td)
                td.appendTo(tr)

                td = $("<td>")
                td.text(radio.name)
                td.appendTo(tr)

                td = $("<td>")
                td.text(radio.codec)
                td.appendTo(tr)

                td = $("<td>")
                td.text(radio.bitrate)
                td.appendTo(tr)

                td = $("<td>")
                td.text(radio.votes)
                td.appendTo(tr)

                td = $("<td>").prop("id", radio.id).addClass("like")
                td.appendTo(tr)
                img = $("<img width=40>")
                img.prop("src", "./like.jpg")
                img.appendTo(td)
                td.appendTo(tr)
            }
        })
    }

    table.on("click",".like",like)
    
    function like(){
        _this=$(this)
        let requestLike=inviaRichiesta("POST","/api/like",{ "id": $(this).prop("id") })
        requestLike.fail(errore)
        requestLike.done(function(data){
            console.log(data)
            lstRegioni.trigger("change") //triggero il change sulla lst 
        })
    }

});