
const _http = require("http"); //richiamo librerie tramite funzione di NodeJS , ce ne sono diverse possono essere installate oltre a quelle default
const _url = require("url");
const _colors=require("colors");
// './'  rappresenta cartella corrente
const HEADERS = require("./headers.json")

const port = 1337;

//crea il Web Server e mi restituisce il puntatore ma non viene avviato 
//si aspetta una callback che viene eseguita tutte le volte che ha una richiesta 
const server=_http.createServer(function (req, res) {
    /* PRIMA PROVA
    //corpo intestazione 
    res.writeHead(200,HEADERS.text);
    //corpo della risposta
    res.write("richiesta eseguita correttamente");
    //invio 
    res.end();
    console.log("richiesta eseguita");
    */
    //parsing della URL ricevuta parse(url,true= parsificare i parametri) se non metto booleana non parsifica di default

    //LETTURA DI METODO RISORSA E PARAMETRI 
    let metodo= req.method;
    let url = _url.parse(req.url,true);
    let risorsa=url.pathname;
    let parametri=url.query; 

    
    let dominio=req.headers.host;
    
    //costruzione riposta 
    res.writeHead(200,HEADERS.html);
    res.write("<h1> Informazioni relative alla Richiesta ricevuta </h1>");
    res.write("<br>");
    res.write(`<p><b> Risorsa Richiesta : </b> ${risorsa} </p>`);
    res.write(`<p><b> Metodo: </b> ${metodo} </p>`);
    res.write(`<p><b> Parametri: </b> ${JSON.stringify(parametri)} </p>`);
    res.write(`<p><b> Dominio Richiesto: </b> ${dominio} </p>`);
    res.write("<p>Grazie per la richiesta </p>");
    //fine 
    res.end();
    console.log("richiesta ricevuta: "+ req.url.yellow);
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);