let APIUsers;
let userNameDetail;

// will run when the document is ready
$(document).ready(function () {
    chooseAPIUsers();

    logStatusNames();

    getAlltheUsers();

    setDefault();

});

/*set the correct api to run on*/
function chooseAPIUsers() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        APIUsers = "https://localhost:7039/api/Users";
    else
        APIUsers = "https://proj.ruppin.ac.il/cgroup47/test2/tar1/api/Users";
}


/*set a default parameters for the navbar*/
function logStatusNames() {
    let tmpObj = checkLogins();
    userNameDetail = JSON.parse(tmpObj);
    if (userNameDetail == null) {
        $('#name').text("Guet");
        $('#Update').hide();
        $('#Logout').hide();
        $('#Login').show();
        $('#Signup').show();
        $('#dbUsers').hide();
    }
    else {
        $("#name").text(`${userNameDetail.firstName}`);
        $('#Update').show();
        $('#Logout').show();
        $('#Login').hide();
        $('#Signup').hide();
        if (userNameDetail.firstName == 'admin') {
            $('#dbUsers').show();
        }
    }
}


// wire all the checkbox to their functions
function checkboxEvents() {
    $(document).on("change", ".checkboxs", function () {
        markSelected(this);
        var userEmail = this.getAttribute('data-userEmail');
        var checkStatus = this.checked;
        Swal.fire({ // this will open a dialouge
            title: "Are you sure ??",
            text: "",
            icon: "warning",
        })
            .then(function (willChange){
                if (willChange.isConfirmed) updateActive(userEmail, checkStatus);
                else {
                    if (checkStatus) {
                        $(`input[data-userEmail="${userEmail}"]`).prop('checked',false);
                    }
                    else $(`input[data-userEmail="${userEmail}"]`).prop('checked', true);
                    swal.fire("Not Changed!")
                };
            });
    });
}

// Delete a car from the server
function updateActive(userEmail, checkStatus) {
    const User = {
        userEmail: userEmail,
        isActive: checkStatus
    }
    let API = APIUsers + '/' + userEmail + '/' + checkStatus;
    ajaxCall("PUT", API, JSON.stringify(User), putUsersSCB, putUsersECB);
}

/*in case of success posting the user to the server */
function putUsersSCB(data) {
    console.log(data);
}

/*in case of an error after posting the user to the server*/
function putUsersECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "We couldnt change the active status",
        confirmButtonText: "<u>back</u>",
    });
}

function getAlltheUsers() {
    // once the document is ready we fetch a list of users from the server
    ajaxCall("GET", APIUsers, "", getUsersSCB, getUsersECB);
}

/*in case of success getting the flats from the server rendering it to the place holder*/
function getUsersSCB(userData) {
    usersArray = userData; // keep the users array in a global variable;
    try {
        tbl = $('#usersTable').DataTable({
            data: userData,
            pageLength: 10,
            columns: [
                { data: "userEmail" },
                { data: "firstName" },
                { data: "familyName" },
                { data: "password" },
                {
                    data: "isAdmin?",
                    render: function (data, type, row, meta) {
                        if (row.isAdmin == true)
                            return '<input type="checkbox" checked disabled="disabled" />';
                        else
                            return '<input type="checkbox" disabled="disabled"/>';
                    }
                },
                {
                    data: "isActive?",
                    render: function (data, type, row, meta) {
                        let dataUser = `data-userEmail="${row.userEmail}"`;
                        if (row.isActive == true)
                            return `<input type="checkbox" class="checkboxs" checked ${dataUser}/>`;
                        else
                            return `<input type="checkbox" class="checkboxs" ${dataUser}/>`;
                    }
                }
            ],
        });
        checkboxEvents();
    }

    catch (err) {
        alert(err);
    }
}


/*in case of an error after trying to get the flats from the server*/
function getUsersECB(err) {
    console.log(`An Error was occured: ${err}`);
}


// mark the selected row
function markSelected(btn) {
    $("#usersTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
    row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
}

/*checks if someone is loged in*/
function checkLogins() {
    if (sessionStorage.length == 0 || sessionStorage.getItem('Current user') == undefined || sessionStorage.getItem('Current user') == null) {
        return null;
    }
    else {
        return sessionStorage.getItem('Current user');
    }
}

/*set the modal parameter to show the sign up*/
function changeBtn() {
    $('#submitBTNsign').show();
    $('#userMail').prop("readonly", false);
    $('#left').hide();
    $('#submitBTNupdate').hide();
    $('#submitBTNlog').hide();
    $('.hideOnDefault').show();
    $('#modalHeadstl').text('Sign Up');
}

/*set the default modal parameter*/
function setDefault() {
    $('#submitBTNsign').hide();
    $('#submitBTNlog').show();
    $('#userMail').prop("readonly", false);
    $('.hideOnDefault').hide();
    $('#submitBTNupdate').hide();
    $('#modalHeadstl').text('Login');
}

function setUpdate() {
    $('#submitBTNupdate').show();
    $('#submitBTNsign').hide();
    $('#left').hide();
    $('#submitBTNlog').hide();
    $('.hideOnDefault').show();
    $('#userMail').val(userName.userEmail);
    $('#firstName').val(userName.firstName);
    $('#familyName').val(userName.familyName);
    $('#password').val(userName.password);
    $('#userMail').prop("readonly", true);
    $('#modalHeadstl').text('Update User');
}

function backHome() {
    window.location = 'flatsPage.html';
}
