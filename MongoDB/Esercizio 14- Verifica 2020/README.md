# ISTITUTO TECNICO INDUSTRIALE STATALE "G. VALLAURI"

## Via S. Michele, 68 – 12045 Fossano

## Indirizzo INFORMATICA 03 / 12 /20 20

# Esercizio 14
Eseguire le seguenti query sul database mongodb allegato denominato vallauri.

```
1) Trovare tutti gli studenti nati tra due date inserite da tastiera all’interno di appositi textbox di una pagina
client
L’applicazione, tramite una espressione regolare, deve controllare che le due siano state correttamente
inserite nei texbox nel formato YYYY-MM-DD. In caso di inserimento non valido segnalarlo tramite apposito
messaggio senza inviare richieste al server. Controllare inoltre che il campo MM sia compreso tra 1 e 12 e che
il campo GG sia compreso tra 1 e 31. Se tutti i controlli sono superati inviare la richiesta al server che
restituirà nome e classe di tutti gli studenti nati nel periodo indicato (da visualizzare all’interno di una tabella
priva di intestazioni).
```
```
2) Visualizzare l’elenco di tutte la classi ordinate in modo decrescente rispetto alla media dei voti. La media
dei voti di una classe viene calcolata in questo modo: Per ogni studente
 si calcola la media di ogni disciplina (italiano, matematica, informatica, sistemi)
 poi si calcola la media complessiva di ogni singolo studente (media delle medie precedenti)
 infine si valuta la media della classe come media fra le medie di tutti gli studenti della classe
Risultato:
[
{ _id: '5B', mediaClasse: 6.329166666666667 },
{ _id: '4B', mediaClasse: 6.291666666666667 },
{ _id: '5A', mediaClasse: 6.203472222222222 },
{ _id: '3B', mediaClasse: 6.190972222222222 },
{ _id: '4A', mediaClasse: 6.138888888888889 },
{ _id: '3A', mediaClasse: 6.076388888888889 }
]
```
```
3) Aggiungere un voto = 7 nella disciplina informatica per tutte le studentesse di genere femminile della 4A,
```
```
4) Cancellare tutti gli studenti della 3B che hanno preso un 3 in Sistemi
```
```
5) Per ciascuna classe calcolare il totale dei giorni di assenza.
Ordinare i risultati sul totale dei giorni di assenza in ordine decrescente. Risultato:
'3A' 74
'4A' 66
'4B' 53
'3B' 48
'5A' 43
'5B' 37
```
