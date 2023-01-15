using System;
using System.Diagnostics;


namespace airbnbServerDB.Models
{
    public class Flat
    {
        int flatId;
        string city;
        string address;
        float numbeRoom;
        double price;

        static List<Flat> FlatsList = new List<Flat>();

        public int FlatId { get => flatId; set => flatId = value; }
        public string City { get => city; set => city = value; }
        public string Address { get => address; set => address = value; }
        public float NumbeRoom { get => numbeRoom; set => numbeRoom = value; }
        public double Price { get => price; set => price = Discount(value); }
       

        public int Insert()
        {
            DBservices tmp = new DBservices();
            return tmp.InsertFlat(this);
        }

        public static List<Flat> Read()
        {
            DBservices tmp = new DBservices();
            return tmp.ReadFlats();
        }

        public double Discount(double price)
        {
            double flag = price;

            if (price > 100 && this.NumbeRoom > 1)
            {
                flag = price * 0.9;
            }

            return flag;
        }

        static public List<Flat> GetByCityPrice(string city, double maxPrice)
        {
            List<Flat> tmpsList = new List<Flat>();

            foreach (Flat flat in FlatsList)
            {
                if (flat.City == city && flat.Price <= maxPrice)
                    tmpsList.Add(flat);
            }

            return tmpsList;
        }

        public Object getAvgBy(int month)
        {
            DBservices tmp = new DBservices();
            return tmp.getAvgBy(month);
        }
    }
}
