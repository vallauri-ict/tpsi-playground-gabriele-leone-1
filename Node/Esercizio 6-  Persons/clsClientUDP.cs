using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Net;
using System.Net.Sockets;

namespace SOCKETS
{
    public class clsClientUDP
    {
        const int MAX_BYTE = 1024;
        private Socket _socketID;   //client!
        private EndPoint _endPointServer; //server

        public clsClientUDP(IPAddress ipServer, int portServer)
        {
            _socketID = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Unspecified);
            _endPointServer = new IPEndPoint(ipServer, portServer);
            
        }
        public void invia(clsMessaggio mex)
        {
            string messaggio = mex.toCSV(';');
            byte[] bufferTx;

            bufferTx = Encoding.ASCII.GetBytes(messaggio);
			
			if(bufferTx.Length > MAX_BYTE)
				throw new Exception("Messaggio Troppo Lungo");
            //apre il socket, invia, richiude
            _socketID.SendTo(bufferTx, bufferTx.Length, SocketFlags.None, _endPointServer);
        }



    }
}
