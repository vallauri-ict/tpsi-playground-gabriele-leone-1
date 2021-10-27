


$(document).ready(function () {
    let categoryList=$("#categoryList")
    let select=$("<select>")
    let mainwrapper=$("#mainWrapper")
    let btnInvia=$("#btnInvia")
    select.prop("id","selectCategories")
    select.appendTo(categoryList)
   let requestCategories=inviaRichiesta("GET","/api/categories")
   requestCategories.fail(errore)
   requestCategories.done(function(data){
    console.log(data)
    
    for (const categoria of data.categorie) {
        let opt = $("<option>")
        opt.val(categoria)
        opt.text(categoria)
        opt.appendTo(select)
    }
   })

   select.on("change",doFacts)

   function doFacts(){
    console.log($(this).val())
    let requestRadio = inviaRichiesta("GET", "/api/facts", { "name": $(this).val() })
    requestRadio.fail(errore)
    requestRadio.done(function(data){
        console.log(data)
        //<input type="checkbox" value="factID"> <span> factValue </span> <br></br>
        for (const factValue of data.facts) {
            
            let span=$("<span>")
            span.text(factValue.value).append("<br/>")
            span.prependTo(mainwrapper)
            let input=$("<input type='checkbox'>").addClass("chk")
            input.prependTo(span)
            input.val(factValue.id)
            

        }
    })
   }
   btnInvia.on("click",rate)


   function rate(){
       let selected={
       }
        let chk=$(".chk")
        let selectedLen=$(".chk").length
        let j=0
        for (let i = 0; i < selectedLen; i++) {
            let w=chk[i]
            if(w.checked){
                selected[j]= w.value
                j++
            }
        }
        console.log(JSON.stringify(selected))
        let requestRate=inviaRichiesta("POST","/api/rate",{"ids":selected})
        requestRate.fail(errore)
        requestRate.done(function(data){
           console.log(data)
        })
   }
});