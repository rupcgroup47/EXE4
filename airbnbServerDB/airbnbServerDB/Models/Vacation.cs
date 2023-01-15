using System;
using System.Diagnostics;

namespace airbnbServerDB.Models
{
    public class Vacation
    {
        int vacationId;
        string userEmail;
        int flatId;
        DateTime startDate = new DateTime();
        DateTime endDate = new DateTime();

        static List<Vacation> OrdersList = new List<Vacation>();

        public int VacationId { get => vacationId; set => vacationId = value; }
        public string UserEmail { get => userEmail; set => userEmail = value; }
        public int FlatId { get => flatId; set => flatId = value; }
        public DateTime StartDate { get => startDate; set => startDate = value.Date; }
        public DateTime EndDate { get => endDate; set => endDate = value.Date; }

        public int Insert()
        {
            DBservices tmp = new DBservices();

            List<Vacation> tmpList = tmp.ReadVacationSameFlatId(this.FlatId); //read all vacations with the same flat id

            if (tmpList.Count > 0)
            {
                foreach (Vacation vacation in tmpList)
                {
                    if ((vacation.StartDate <= this.StartDate && vacation.EndDate >= this.EndDate) || (vacation.StartDate >= this.StartDate && vacation.EndDate <= this.EndDate) || (vacation.StartDate < this.EndDate && vacation.EndDate >= this.EndDate) || (vacation.EndDate > this.StartDate && vacation.StartDate <= this.StartDate))
                    {
                        Console.WriteLine("This flat is already booked on those dates");
                        return 0;
                    }
                }
            }            

            return tmp.InsertVacation(this);
        }

        public static List<Vacation> Read()
        {
            DBservices tmp = new DBservices();
            return tmp.ReadVacations();
        }

        static public List<Vacation> getByDates(DateTime startDate, DateTime endDate)
        {
            List<Vacation> tmpList = new List<Vacation>();

            foreach (Vacation vacation in OrdersList)
            {
                if (vacation.StartDate >= startDate && vacation.EndDate <= endDate)
                    tmpList.Add(vacation);
            }

            return tmpList;
        }
    }
}
