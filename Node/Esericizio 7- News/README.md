# ISTITUTO TECNICO INDUSTRIALE STATALE "G. VALLAURI"

## Via S. Michele, 68 – 12045 Fossano

## Indirizzo INFORMATICA

# Esercizio 07

Si vuole realizzare l’applicazione web indicata in figura che mostra all’utente le news dell’ultima ora:

Il database di riferimento è costituito da un file di testo denominato **notizie.json** così strutturato:
```
[ {"titolo":"aaa", "visualizzazioni":1180, "file":"charlie.txt"},
{"titolo":"bbb", "visualizzazioni":230, "file":"borsa.txt"},
{"titolo":"ccc", "visualizzazioni":854, "file":"vallauri.txt"}
]
```

Il campo file contiene il nome di un file di testo (memorizzato nella sottocartella /news) contenente la notizia
completa. Il campo nVisualizzazioni indica il numero di volta in cui la notizia è stata visualizzata.

Al ricevimento della pagina index.html il client invia una richiesta ajax denominata **/elenco** in corrispondenza
della quale il server risponde con uno stream JSON costituito dal vettore precedente letto dal file notizie.json

Il browser visualizza le informazioni ricevute aggiungendo all’interno del wrapper, per ogni notizia ricevuta, il
seguente codice html :

```
<span class='titolo'> Titolo Notizia </span>
<a href = ’#’> Leggi </a>
<span class='nVis'>[visualizzato 1180 volte]</span>
<br>
```

In corrispondenza del click sul pulsante Leggi, una apposita procedura invia al server una richiesta denominata
/dettagli passandogli in modalità post il nome del file contenente la news richiesta.

In corrispondenza della richiesta il server provvede a:
 leggere il file contente la notizia
 Incrementare il contatore delle visualizzazioni relativo alla notizia richiesta e ri-salvare il file notizie.json
inviare al client il contenuto del file tramite uno stream json del tipo :{“file” : “contenuto del file”}
 In corrispondenza della risposta, il client visualizza la notizia e aggiorna il numero di visualizzazioni di quella
notizia


