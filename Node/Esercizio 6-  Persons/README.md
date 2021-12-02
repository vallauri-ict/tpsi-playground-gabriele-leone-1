# ISTITUTO TECNICO INDUSTRIALE STATALE "G. VALLAURI"

## Via S. Michele, 68 – 12045 Fossano

## Indirizzo INFORMATICA

Esercizio 05 **“ Persons ”**

Il file persons.json contiene un elenco di persone scaricate da randomuser.me
Scrivere una applicazione Client Server di tipo SPA (Single Page Application) strutturata nel modo seguente:
All’avvio il server legge e mantiene in memoria il contenuto del file (semplice require)
All’avvio il client invia al server una richiesta **/nazioni** e visualizza una lista con tutte le nazioni ricevute.
Il server costruisce il vettore sulla base del campo location.country facendo attenzione a ripetere ogni nazione una
sola volta ed ordinando le nazioni in ordine alfabetico.
 In corrispondenza della scelta di una nazione, il client invia al server una richiesta /persone relativa alle
persone appartenenti alla nazione selezionata. Il server, in corrispondenza della richiesta, invia un vettore
enumerativo di oggetti aventi i seguenti campi:
name = title + " " + first + " " + last
city, state, cell
dove si suppone che la combinazione title + first + last sia univoca all’interno del database.
Il client visualizza tutti i campi ricevuti all’interno di una apposita tabella
 In corrispondenza del click sul pulsante Dettagli , il client richiede al server l’elenco di tutti i dettagli
relativi alla persona indicata (sulla base di title + first + last) e visualizza nella sezione Dettagli
(inizialmente nascosta) tutti i dettagli indicati in figura
 In corrispondenza del click sul pulsante Elimina , il client, dopo aver chiesto conferma, richiede al server
l’eliminazione della persona indicata (sempre sulla base di title + first + last).
In corrispondenza dell’OK esegue un refresh della pagina
I quattro pulsanti di navigazione consentono di scorrere i dettagli delle varie persone.
Fare attenzione a disabilitare FISRT e PREVIOUS quando si arriva sulla prima persona e disabilitare NEXT e LAST
quando si arriva sull’ultima persona.

Un pulsante AGGIUNGI apre una nuova sezione per l’inserimento di un nuovo studente.
Al termine del caricamento del nuovo studente sul server, l’applicazione ritorna alla sezione principale.


