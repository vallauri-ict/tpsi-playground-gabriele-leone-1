using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace SOCKETS
{
    //firma della procedura di evento datiRicevutiEvent
    public delegate void datiRicevutiEventHandler(clsMessaggio message);
    public class clsServerUDP
    {
        private const int MAX_BYTE = 1024; //MASSIMA LUNGHEZZA BYTE RICEVUTI
        private Socket _socketID; //socket principale del nostro server
        private EndPoint _endpointServer; //"socket"=ip/port associato al server
        private EndPoint _endpointClient; //"socket"=ip/port associato al client che invia
        private Thread _threadAscolta;
        private volatile bool threadRun = true; //x fermare il thread
        //evento che scateno quando ricevo i dati
        public event datiRicevutiEventHandler datiRicevutiEvent;

        public clsServerUDP(IPAddress ip, int port)
        {
            _socketID = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Unspecified);
            _endpointServer = new IPEndPoint(ip, port);
            //apro la connessione
            _socketID.Bind(_endpointServer);
        }

        public void avvia()
        {
            if (_threadAscolta == null)
            {
                _threadAscolta = new Thread(ricevi);
                _threadAscolta.Start();
                while (!_threadAscolta.IsAlive) ; //blocca l'esecuzione finchè il thread non è partito
            }
        }

        private void ricevi()
        {
            //metodo del thread
            int nBytesRicevuti;
            string _message;
            byte[] bufferRx;

            bufferRx = new byte[MAX_BYTE]; //buffer per la ricezione

			//inizializzo endpointclient a qualcosa a caso.
            _endpointClient = new IPEndPoint(IPAddress.Parse("127.0.0.1"), 5555);

            while (threadRun)
            {
                try
                {
                    //ricevo i dati
                    nBytesRicevuti = _socketID.ReceiveFrom(bufferRx, MAX_BYTE, SocketFlags.None, ref _endpointClient); //ref -> ce lo carica il metodo
                    //li parsifico come stringa del messaggio
                    _message = Encoding.ASCII.GetString(bufferRx);
                    clsMessaggio mex = new clsMessaggio(_message, ';');
                    mex.ip = (_endpointClient as IPEndPoint).Address.ToString();
                    mex.port = (_endpointClient as IPEndPoint).Port.ToString();
                    
                    //generare l'evento di ricezione
                    datiRicevutiEvent(mex);

                } catch (SocketException ex)
                {
                    if(ex.ErrorCode != 10004)
                        System.Windows.Forms.MessageBox.Show(ex.Message);
                }
            }

        }
        public void chiudi()
        {
            //uccido il thread
            threadRun = false;
            //_threadAscolta.Join(); //attende la morte del thread
            //chiudo il socket
            _socketID.Close();
            
        }
    }
}
