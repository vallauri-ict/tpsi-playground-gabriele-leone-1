

$(document).ready(function() {
    let modified
    $("#btnInvia").on("click", function() {
        modified=$("textarea").val()
        let id=$("textarea").prop("_id")
        let request = inviaRichiesta("post", "/api/servizio2",{"value":modified,"id":id});
        request.fail(errore);
        request.done(function(data) {
            console.log(data)
            alert("Value Modificata Correttamente")
        });
    });

    let requestDati=inviaRichiesta("get", "/api/servizio1")
    requestDati.fail(errore);
    requestDati.done(function(data){
        console.log(JSON.stringify(data))
        for (const item of data) {
            let option=$("<option>")
            option.text(item._id)
            option.val(item.value)
            option.appendTo($("#select"))
        }
    })




    $("#select").on("change",function (){
        console.log($(this).val()) //valore
        $(this).text()
        $("textarea").empty()
        let text=$(this).val()
        $("textarea").val(text)
        $("textarea").prop("_id",$('#select').find(":selected").text())
        console.log($("textarea").prop("_id"))
    })
    
});