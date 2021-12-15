using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Net;
using System.Net.Sockets;

namespace SOCKETS
{
    public class clsAddress
    {
        public static List<IPAddress> ipList;

        static clsAddress()
        {
            ipList = new List<IPAddress>();
            
        }

        public static void cercaIP()
        {
			ipList.Clear(); //svuoto la lista... se quel genio di azuni chiama due
			//volte cercaIP, non mi trovo tutti gli indirizzi duplicati.....
            ipList.Add(IPAddress.Parse("127.0.0.1"));
            IPHostEntry hostInfo = Dns.GetHostEntry(Dns.GetHostName());
            foreach (IPAddress ip in hostInfo.AddressList)
            {
				//se la famiglia dell'IP è InterNetwork...
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                    ipList.Add(ip);
            }
            

        }
    }
}
