# ISTITUTO TECNICO INDUSTRIALE STATALE "G. VALLAURI"

## Via S. Michele, 68 – 12045 Fossano

## Indirizzo INFORMATICA 11 /10/20 20

#Esercizio 08

Si vuole realizzare una applicazione relativa alle web radio italiane basata sui 2 seguenti files:
states.json contenente sotto forma di json array l’elenco delle 20 regioni italiane
radios.json contenente sotto forma di json array l’elenco delle principali 1 2 0 web radio italiane, in cui la
regione di appartenenza è indicata dal campo state

Esercizio 1

Realizzare una utility lato server scritta in node,js che :
 legga il file states.json
sulla base dl contenuto del file radios.json provveda ad aggiornare il campo stationcount di states.json
conteggiando il numero di stazioni esistenti per ciascuna regione
provveda a salvare su disco il file states.json

Esercizio 2

Realizzare un web server nodejs che, in corrispondenza di una richiesta **/elenco** invii al client l’elenco delle
regioni italiane andando a leggere il file aggiornato dall’utility precedente.

Il client invia la richiesta **/elenco** all’avvio, in corrispondenza del ricevimento della pagina html.
Ricevuti i dati, li visualizza all’interno di un apposito ListBox avente come prima voce la voce **tutti**

In corrispondenza della scelta di una regione all’interno del ListBox, il client invia al server una richiesta POST
**/radios** passando come parametro il nome della regione selezionata.

Il server risponde con un elenco contenente SOLTANTO le web radio di quella regione, che verranno visualizzate
all’interno di una apposita tabella come indicato in figura, in cui all’inizio viene visualizzato il logo della web radio indicato all’interno del campo **favicon** con una larghezza fissa pari a 40px. In coda viene aggiunto un pulsante di LIKE che consente all’utente di esprimere un apprezzamento per
quella web radio

In corrispondenza del click sul pulsante di like, il client invia al server una richiesta POST **/like** contenente l’ID
della web radio scelta. In corrispondenza della richiesta il server legge il file delle web radios, incrementa di 1 il
campo **votes,** risalva il file e restituisce al client l’elenco completo aggiornato delle web radio (oppure anche il
solo valore aggiornato del campo votes della web radio scelta)


