$(document).ready(function () {
  $("#btnInvia").on("click", function () {
    let request = inviaRichiesta("get", "/api/risorsa1", { nome: "Aurora" });
    request.fail(errore);
    request.done(function (data) {
      if (data.length > 0) {
        alert(JSON.stringify(data));
      } else {
        alert("Corrispondenza non trovata");
      }
    });
  });

  $("#btnInvia2").on("click", function () {
    let request = inviaRichiesta("patch", "/api/risorsa1", {
      nome: "Unico",
      vampires: 3,
    });
    request.fail(errore);
    request.done(function (data) {
      if (data.modifiedCount > 0) {
        alert("Aggiornamento Eseguito Correttamente");
      } else {
        alert("Nessuna Corrispondenza");
      }
    });
  });
});
