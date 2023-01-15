let API;
let userName;

$(document).ready(function () {
    chooseAPI();

    logStatusName();

    setDefault();

    setFlatID();

    $("#startDate").on("blur", checkStart);

    $("#endDate").on("blur", checkEnd);

    $("#myForm").submit(submitVacationToTheServer);
})

/*return today date*/
function todayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return today = mm + '/' + dd + '/' + yyyy;
}

/*validation that checks the end date is bigger then the start date*/
function checkStart() {
    const today = new Date(todayDate());
    const startDate = new Date($("#startDate").val());

    if (startDate < today) {
        this.validity.valid = false; // must set it to false to prevent the submit to the server
        this.setCustomValidity('Start date must be greater then today, please enter a valid date');
    }
    else {
        this.validity.valid = true;
        this.setCustomValidity('');
    }
}

/*validation that checks the end date is bigger then the start date*/
function checkEnd() {
    const endDate = new Date($("#endDate").val());
    const startDate = new Date($("#startDate").val());

    if (endDate < startDate) {
        this.validity.valid = false; // must set it to false to prevent the submit to the server
        this.setCustomValidity('End date must be greater then the start date, please enter a valid date');
    }
    else {
        this.validity.valid = true;
        this.setCustomValidity('');
    }
}

/*set the flat id that we choose from the flat page as a default to the vacation order*/
function setFlatID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('flatId')) {
        const flatID = urlParams.get('flatId');
        $("#idFlat").val(flatID);
        $("#userId").val(userName.userEmail);
    }
    else {
        flatID = "";
    }
}

/*set the correct api to run on*/
function chooseAPI() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        API = "https://localhost:7039/api/Orders";
    else
        API = "https://proj.ruppin.ac.il/cgroup47/test2/tar1/api/Orders";
}

/*set a default parameters for the navbar*/
function logStatusName() {
    let tmpObj = checkLogin();
    userName = JSON.parse(tmpObj);
    if (userName == null) {
        $('#name').text("Guet");
        $('#Update').hide();
        $('#Logout').hide();
        $('#Login').show();
        $('#Signup').show();
        $('#dbUsers').hide();
    }
    else {
        $("#name").text(`${userName.firstName}`);
        $('#Update').show();
        $('#Logout').show();
        $('#Login').hide();
        $('#Signup').hide();
        if (userName.firstName == 'admin') {
            $('#dbUsers').show();
        }
    }
}

/*after the user press submit it collecting all the values of the new flat and try to post it to the server using ajaxCall*/
function submitVacationToTheServer(event) {
    if (userName == null) {
        Swal.fire({
            html: "You Have to login first",
            confirmButtonText: "<u>back</u>",
        });
    }
    else {

        const email = $("#userId").val();
        const flatId = parseInt($("#idFlat").val());
        const startDateStr = $("#startDate").val();
        const endDateStr = $("#endDate").val();
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        const Vacation = {
            startDate: startDate,
            endDate: endDate,
            userEmail: email,
            flatId: flatId,
        }

        ajaxCall("POST", API, JSON.stringify(Vacation), postSCB, postECB);
    }
    event.preventDefault();
}

/*in case of success posting the Vaction to the server cleaning the values of the form*/
function postSCB(data) {
    $("#myForm")[0].reset();
    Swal.fire({
        html: "Vacation inserted succesfully",
        confirmButtonText: "<u>back</u>",
    });
}

/*in case of an error after posting the flat to the server*/
function postECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "Something prevent us to enter the vaction, please try again",
        confirmButtonText: "<u>back</u>",
    });
}

/*try and get all the flats from the server using ajaxCall*/
function getVacations() {
    ajaxCall("GET", API, "", getSCB, getECB);
}

/*in case of success getting the flats from the server rendering it to the place holder*/
function getSCB(data) {
    const VacationArray = data;
    let str = `<div class='allCars'>`;
    for (var i = 0; i < VacationArray.length; i++) {
        str += `<div class='cards card'>`;
        str += `<img src='https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666' alt='home image'>`;
        str += `<div class='cardContainer'>`;
        str += `<p>Vacation ID: ${VacationArray[i].vacationId} </p>`;
        str += `<p>User Email: </br> ${VacationArray[i].userEmail} </p>`;
        str += `<p>Flat Id: ${VacationArray[i].flatId} </p>`;
        str += `<p>Start Date: ${(VacationArray[i].startDate).split('T')[0]} </p>`;
        str += `<p>End Date: ${(VacationArray[i].endDate).split('T')[0]} </p>`;
        str += `</div>`;
        str += `</div>`;
    }
    str += `</div>`;

    document.getElementById("ph").innerHTML = str;
}

/*in case of an error after trying to get the flats from the server*/
function getECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "Something prevent us to show all the vactions",
        confirmButtonText: "<u>back</u>",
    });
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

/*checks if someone is loged in*/
function checkLogin() {
    if (sessionStorage.length == 0 || sessionStorage.getItem('Current user') == undefined || sessionStorage.getItem('Current user') == "null") {
        return null;
    }
    else {
        return sessionStorage.getItem('Current user');
    }
}

function backHome() {
    window.location = 'flatsPage.html';
}