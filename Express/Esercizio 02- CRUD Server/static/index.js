"use strict";

$(document).ready(function () {
  let divIntestazione = $("#divIntestazione");
  let divCollections = $("#divCollections");
  let table = $("#mainTable");
  let divDettagli = $("#divDettagli");
  let currentCollection = "";
  let filters=$(".card").first()

  filters.hide()
  let request = inviaRichiesta("get", "api/getCollections");
  request.fail(errore);
  request.done(function (collections) {
    console.log(collections);
    let label = divCollections.children("label");
    for (const collection of collections) {
      let clone = label.clone();
      clone.appendTo(divCollections);
      clone.children("input").val(collection.name);
      clone.children("span").text(collection.name);
      divCollections.append("<br>");
    }
    label.remove();
  });

  divCollections.on("click", "input[type=radio]", function () {
    
    currentCollection=$(this).val();
    let request=inviaRichiesta("GET","/api/"+currentCollection)
    request.fail(errore)
    request.done(function(data){
        console.log(data)
        table.children("tbody").empty()
        divIntestazione.find("strong").eq(0).text(currentCollection)
        divIntestazione.find("strong").eq(1).text(data.length)
        if(currentCollection=="unicorns"){
            filters.show()
        }
        else
        {
            filters.hide()
        }
        for (const item of data) {
            let tr=$("<tr>")
            tr.appendTo(table.children("tbody"))
            let td=$("<td>")
            td.appendTo(tr)
            td.prop("id",item._id)
            td.on("click",visualizzaDettagli)
            td.text(item._id)

            td=$("<td>")
            td.appendTo(tr)
            td.prop("id",item._id)
            td.on("click",visualizzaDettagli)
            td.text(item.name)

            td=$("<td>")
            td.appendTo(tr)
            for (let i = 0; i < 3; i++) {
                $("<div>").appendTo(td)
                
            }
        }
    })
  })


  function visualizzaDettagli(){
    let id=$(this).prop("id")
    let requestDettagli=inviaRichiesta("GET","/api/"+currentCollection+"/"+id)
    requestDettagli.fail(errore)
    requestDettagli.done(function(data){
        console.log(data)
        let content=""
        for (const key in data[0]) {
            content+="<strong>"+ key +"</strong> : "+data[0][key]+"<br>"
        }
        divDettagli.html(content)
    })
}
});

