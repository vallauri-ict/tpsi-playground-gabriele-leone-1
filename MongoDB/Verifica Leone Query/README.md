# ISTITUTO TECNICO INDUSTRIALE STATALE "G. VALLAURI"

## Via S. Michele, 68 – 12045 Fossano

## Indirizzo INFORMATICA 24 / 11 /20 21

# Verifica di Tecnologie

Eseguire le seguenti query sul database mongodb allegato denominato facts.

1) Scrivere una applicazione client –server che:
- All’avvio, richiede al server l’elenco di tutti i facts memorizzati nel DB (id e value). Gli ID vengono
visualizzati all’interno di una apposita lista.
-In corrispondenza della scelta di un id dalla lista, l’applicazione visualizza il value corrispondente
all’interno di una text-area sottostante avente dimensione 350px x 120px
- L’utente può modificare il fact e, in corrispondenza del pulsante salva, richiede al server di salvare il
nuovo fact nel DB.
- Insieme al fact, il server aggiorna anche il campo updated_at inserendo la data corrente

2 ) Visualizzare i facts che appartengono alla categoria **music** oppure che presentano uno **score** maggiore di
620. Visualizzare _id, categories e score

3 ) Inserire un nuovo fact con testo “I'm inserting a new chuck norris's fact”
I rimanenti campi sono impostati nel modo seguente:
-data di creazione e data di aggiornamento = data corrente
-id generato casualmente tramite una sequenza casuale di 22 caratteri base64 (riportati di seguito)
eventualmente anche ripetuti. Non è richiesto il controllo dell’univocità dell’_id generato
- icon_url = valore fisso (come in tutti gli altri record)
- url = valore fisso (come in tutti gli altri record) seguito dall’ID generato dinamicamente:
 score =
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
"Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
"m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

4 ) Cancellare tutti i facts creati successivamente al 15 novembre 2021 e con score = 0

5 ) Visualizzare, per ogni singola categoria, la media degli score di tutti i facts che trattano quella categoria.
Ordinare i risultati sulla base della mediaScore decrescente e, in caso di eventuale parità, ordinare sul nome
crescente della categoria Le mediaScore devono essere arrotondate a due cifre dopo la virgola
{ _id: 'sport', mediaScore: 628 },
{ _id: 'religion', mediaScore: 616.94 },
{ _id: 'food', mediaScore: 543.09 },
{ _id: 'money', mediaScore: 538.06 },
{ _id: 'political', mediaScore: 535.43 },
{ _id: 'explicit', mediaScore: 531.11 },
{ _id: 'celebrity', mediaScore: 528.04 },
{ _id: 'movie', mediaScore: 512.48 },
{ _id: 'travel', mediaScore: 487.12 },
{ _id: 'music', mediaScore: 480.42 },
{ _id: 'science', mediaScore: 470.17 },
{ _id: 'fashion', mediaScore: 466.62 },
{ _id: 'history', mediaScore: 431.07 },
{ _id: 'dev', mediaScore: 429 },
{ _id: 'animal', mediaScore: 421.44 },
{ _id: 'career', mediaScore: 378.62 }


6 a) Visualizzare l’elenco delle categorie contenute nel database, ogni categoria riportata una sola volta
6 b) Ripetere l’esercizio precedente visualizzando le categorie in ordine alfabetico crescente

```
{ _id: 'animal' },
{ _id: 'career' },
{ _id: 'celebrity' },
{ _id: 'dev' },
{ _id: 'explicit' },
{ _id: 'fashion' },
{ _id: 'food' },
{ _id: 'history' },
{ _id: 'money' },
{ _id: 'movie' },
{ _id: 'music' },
{ _id: 'political' },
{ _id: 'religion' },
{ _id: 'science' },
{ _id: 'sport' },
{ _id: 'travel' }
```
