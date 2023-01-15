namespace airbnbServerDB.Models
{
    public class User
    {
        string userEmail;
        string firstName;
        string familyName;
        string password;
        bool isAdmin;
        bool isActive;

        public string UserEmail { get => userEmail; set => userEmail = value; }
        public string FirstName { get => firstName; set => firstName = value; }
        public string FamilyName { get => familyName; set => familyName = value; }
        public string Password { get => password; set => password = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }
        public bool IsActive { get => isActive; set => isActive = value; }

        public int Insert()
        {
            DBservices tmp = new DBservices();

            List<string> tmpList = tmp.ReadAllUsersEmails(); //read all existing Emails

            if (tmpList.Count > 0)
            {
                foreach (string email in tmpList)
                {
                    if (this.UserEmail == email)
                    {
                        Console.WriteLine("This Email is already exist");
                        return 0;
                    }
                }
            }

            return tmp.InsertUser(this);
        }

        public int Update()
        {
            DBservices tmp = new DBservices();

            return tmp.UpdateUser(this);

        }

        public int UpdateActive(string userEmail,bool isActive)
        {
            DBservices tmp = new DBservices();

            return tmp.UpdateUserActive(userEmail, isActive);
        }

        public static List<User> Read()
        {
            DBservices tmp = new DBservices();
            return tmp.ReadUsers();
        }
    }
}
