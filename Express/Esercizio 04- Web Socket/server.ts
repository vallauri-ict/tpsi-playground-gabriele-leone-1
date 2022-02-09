"use strict";
import http from "http";
import colors from "colors";
import express from "express";
const app = express()
const httpServer = http.createServer(app);
import {Server, Socket} from "socket.io";// import solo l‟oggetto Server
const io = new Server(httpServer);


const PORT = 1337

httpServer.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

app.use(express.static('./static'));


/************************* gestione web socket ********************** */
let users = []; //il socket di ogni utente viene salvato all'interno di questo vettore 

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) {
	//let user:any = {}; così accetto tutto 
	let user = {} as {username:string,socket:Socket};
	// 1) ricezione username
	clientSocket.on('login', function(username) {
		// controllo se user esiste già
		//find scorre tutto il vettore enumerativo degli users 
		let item = users.find(function(item) {
			return (item.username == username)
		})
		if (item != null) { //controlla se esiste già un nome uguale e dice che non va bene 
			clientSocket.emit("loginAck", "NOK")
		}
		else{//se il nome non esiste si salva l'username e il suo socket nel user  dichiarato nella funzione
			user.username = username;
			user.socket = clientSocket;
			users.push(user); //e poi faccio la push nel vettore globale 
			clientSocket.emit("loginAck", "OK") //emit evento OK
			log('User ' + colors.yellow(user.username) +
						" (sockID=" + user.socket.id + ') connected!');
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function(msg) {
		log('User ' + colors.yellow(user.username) + 
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg))
		// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
		let response = {
			'from': user.username, //utente che ha mandato il mex
			'message': msg, //messaggio scritto
			'date': new Date() //data e ora di quando è stato scritto il mex 
		}
		io.sockets.emit('message_notify', JSON.stringify(response)); //spedisice a tutti compreso il mittente se avessi usato clientSocket il mittente non avrebbe ricevuto il mittente
	});

    // 3) disconnessione dell'utente
    clientSocket.on('disconnect', function() {
		//questo findIndex non mi restituisce l'utente completo ma solo il suo indice
        // ritorna -1 se non lo trova
		let index = users.findIndex(function(item){
			return (item.username == user.username)
		})
		users.splice(index, 1) //fa lo splice poichè se c'è -1 non fa nulla 
		log(' User ' + user.username + ' disconnected!');
    });
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " +msg)
}