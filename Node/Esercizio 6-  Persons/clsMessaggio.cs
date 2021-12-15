using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SOCKETS
{
    public class clsMessaggio
    {
        private string _ip;
        private string _port;
        private string _messaggio;

        public clsMessaggio(string _ip = "", 
                            string _port = "",
                            string _messaggio = "")
        {
            this._ip = _ip;
            this._port = _port;
            this._messaggio = _messaggio;
        }
        public clsMessaggio(string csv, char separator)
        {
            fromCSV(csv, separator);
        }

        public string ip
        {
            get { return _ip; }
            set { _ip = value; }
        }
        public string port
        {
            get { return _port; }
            set { _port = value; }
        }
        public string messaggio
        {
            get { return _messaggio; }
            set { _messaggio = value; }
        }

        public string toCSV(char separator = ';')
        {
            return _ip + separator + _port + separator + _messaggio;

        }
        public void fromCSV(string csv, char separator = ';')
        {
            string[] param = csv.Split(separator);
            this._ip = param[0];
            this._port = param[1];
            this._messaggio = param[2];
        }

        public string[] toArray()
        {
            return new string[] { _ip, _port, _messaggio};
        }


    }
}
