let APIUser;
let userNameSet;
let tempEmail;
let tempPsw;

$(document).ready(function () {
    chooseAPIUser();

    checkLoginStatus();
})

/*set the correct api to run on*/
function chooseAPIUser() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        APIUser = "https://localhost:7039/api/Users";
    else
        APIUser = "https://proj.ruppin.ac.il/cgroup47/test2/tar1/api/Users";
}

/*checks if someone is loged in*/
function checkLoginStatus() {
    if (sessionStorage.length == 0 || sessionStorage.getItem('Current user') == undefined || sessionStorage.getItem('Current user') == null) {
        userNameSet = null;
    }
    else {
        userNameSet = sessionStorage.getItem('Current user');
    }
}

/*after the user press submit it collecting all the values of the new user and try to post it to the server using ajaxCall*/
function signUpUser() {
    if (userNameSet != null) {
        Swal.fire({
            html: "You are already loged in",
            confirmButtonText: "<u>back</u>",
        });
    }
    else {
        const userEmail = $("#userMail").val();
        const firstName = $("#firstName").val();
        const familyName = $("#familyName").val();
        const password = $("#password").val();

        const User = {
            userEmail: userEmail,
            firstName: firstName,
            familyName: familyName,
            password: password
        }

        userNameSet = User;
        sessionStorage.setItem('Current user', JSON.stringify(userNameSet));

        ajaxCall("POST", APIUser, JSON.stringify(User), postUserSCB, postUserECB);

    }
    event.preventDefault();
}

/*in case of success posting the user to the server cleaning the values of the form*/
function postUserSCB(data) {
    $("#logForm")[0].reset();
    closeUpdate();
}

/*in case of an error after posting the flat to the server*/
function postUserECB(err) {
    console.log(`An Error was occured: ${err}`);
    $("#logForm")[0].reset();
    closeUpdate();
    //Swal.fire({
    //    html: "Your email is already exist in our system or somthing went wrong",
    //    confirmButtonText: "<u>back</u>",
    //});
}

function logInUser() {
    if (userNameSet != null) {
        Swal.fire({
            html: "You are already loged in",
            confirmButtonText: "<u>back</u>",
        });
    }
    else {

        tempEmail = $("#userMail").val();
        tempPsw = $("#password").val();

        getAllUsers();

    }
    event.preventDefault();
}

function getAllUsers() {
    ajaxCall("GET", APIUser, "", getUserSCB, getUserECB);
}

/*in case of success getting the flats from the server rendering it to the place holder*/
function getUserSCB(data) {
    const usersArray = data;
    var flagPass = -1;

    for (var i = 0; i < usersArray.length; i++) {
        if (usersArray[i].userEmail == tempEmail) {
            if (usersArray[i].password == tempPsw) {
                if (usersArray[i].isActive != true || usersArray[i].isActive != 1) {
                    flagPass = 0;
                    Swal.fire({
                        icon: 'error',
                        html: "this user is not active",
                        showCloseButton: false,
                        showCancelButton: false
                    });
                }
                else {
                    userNameSet = usersArray[i];
                    sessionStorage.setItem('Current user', JSON.stringify(userNameSet));
                    flagPass = 0;
                    $("#logForm")[0].reset();
                    closeUpdate();
                }
            }
            else {
                Swal.fire({
                    html: "Your password is incorect",
                    confirmButtonText: "<u>back</u>",
                });
                flagPass = 1;
            }
        }
    }

    if (flagPass == -1) {
        Swal.fire({
            html: "You need to sign up first",
            confirmButtonText: "<u>back</u>",
        });
    }

}


/*in case of an error after trying to get the flats from the server*/
function getUserECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "You need to sign up first or somthing went wrong",
        confirmButtonText: "<u>back</u>",
    });
}

function closeUpdate() {
    if (userNameSet != null) {
        $('#myModal').modal('toggle');
        location.reload(true);
    }
}

/*after the user press submit it collecting all the values of the user and try to change it to the server using ajaxCall*/
function updateUpUser() {

    const userEmail = $("#userMail").val();
    const firstName = $("#firstName").val();
    const familyName = $("#familyName").val();
    const password = $("#password").val();

    const User = {
        userEmail: userEmail,
        firstName: firstName,
        familyName: familyName,
        password: password
    }

    userNameSet = User;
    sessionStorage.setItem('Current user', JSON.stringify(userNameSet));

    ajaxCall("PUT", APIUser, JSON.stringify(User), putUserSCB, putUserECB);


    event.preventDefault();
}

/*in case of success posting the user to the server cleaning the values of the form*/
function putUserSCB(data) {
    $("#logForm")[0].reset();
    closeUpdate();
}

/*in case of an error after posting the flat to the server*/
function putUserECB(err) {
    console.log(`An Error was occured: ${err}`);
    $("#logForm")[0].reset();
    closeUpdate();
    //Swal.fire({
    //    html: "Your email is already exist in our system or somthing went wrong",
    //    confirmButtonText: "<u>back</u>",
    //});
}

/*clear session storage and update the name */
function logOutUser() {
    userNameSet == null;
    sessionStorage.clear();
    $('#myModal').modal('toggle');
    window.location = `flatsPage.html`;
}

function moveAdmin() {
    window.location = `admin.html`;
}
