let modulo=require('modulo.js');
//utilizzo funzione anonima
modulo();

//utilizzo funzioni esplicite
let somma= modulo._somma(3,7);
let moltiplicazione=modulo._moltiplicazione(6,4);
console.log("Somma: "+somma,"Moltiplicazione: "+moltiplicazione); //si possono passare più dati

//utilizzo di un JSON
console.log("Prima: "+ modulo.json.nome);
modulo.json.setNome("pluto");
console.log("Dopo: "+ modulo.json.nome);

console.log(modulo.MyClass.nome);
modulo.MyClass.setNome("pluto");
console.log(modulo.MyClass.nome);