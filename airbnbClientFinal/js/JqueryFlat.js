let API;
let userName;

$(document).ready(function () {
    chooseAPI();

    logStatusName();

    setDefault();

    $("#myForm").submit(submitflatToTheServer);

    getFlats();
})

/*set the correct api to run on*/
function chooseAPI() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        API = "https://localhost:7039/api/Flat";
    else
        API = "https://proj.ruppin.ac.il/cgroup47/test2/tar1/api/Flat";
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
        $('#adminReport').hide();
    }
    else { 
        $("#name").text(`${userName.firstName}`);
        $('#Update').show();
        $('#Logout').show();
        $('#Login').hide();
        $('#Signup').hide();
        if (userName.firstName=='admin') {
            $('#dbUsers').show();
            $('#adminReport').show();
        }        
    }
}

/*after the user press submit it collecting all the values of the new flat and try to post it to the server using ajaxCall*/
function submitflatToTheServer(event) {
    if (userName == null) {
        Swal.fire({
            html: "You Have to login first",
            confirmButtonText: "<u>back</u>",
        });
    }
    else {

        const city = $("#cityFlat").val();
        const address = $("#addressFlat").val();
        const numbeRoom = parseFloat($("#numbeRoomFlat").val());
        const price = parseFloat($("#priceFlat").val());

        const Flat = {
            City: city,
            Address: address,
            NumbeRoom: numbeRoom,
            Price: price
        }

        ajaxCall("POST", API, JSON.stringify(Flat), postSCB, postECB);

    }
    event.preventDefault();
}

/*in case of success posting the flat to the server cleaning the values of the form*/
function postSCB(data) {
    $("#myForm")[0].reset();
    Swal.fire({
        html: "Flat inserted succesfully",
        confirmButtonText: "<u>back</u>",
    });
    getFlats();
}

/*in case of an error after posting the flat to the server*/
function postECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "Something prevent us to enter the flat, please try again",
        confirmButtonText: "<u>back</u>",
    });
}

/*try and get all the flats from the server using ajaxCall*/
function getFlats() {
    ajaxCall("GET", API, "", getSCB, getECB);
}

/*in case of success getting the flats from the server rendering it to the place holder*/
function getSCB(data) {
    const flatArray = data;
    let str = `<div class='allCars'>`;
    for (var i = 0; i < flatArray.length; i++) {
        str += `<div class='cards card'>`;
        str += `<img src='https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666' alt='home image'>`;
        str += `<div class='cardContainer'>`;
        str += `<p>Flat ID: ${flatArray[i].flatId} </p>`;
        str += `<p>City: ${flatArray[i].city} </p>`;
        str += `<p>Address: ${flatArray[i].address} </p>`;
        str += `<p>Number of rooms: ${flatArray[i].numbeRoom} </p>`;
        str += `<p>Price: ${flatArray[i].price} </p>`;
        str += `<button onClick='orderFlat(${flatArray[i].flatId})' class="button">order</button>`;
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
        html: "Something prevent us to show all the flats",
        confirmButtonText: "<u>back</u>",
    });
}

/*after pressing order button moving to the vacations page and send the flat id*/
function orderFlat(flatId) {
    if (userName == null) {
        Swal.fire({
            html: "You Have to login first",
            confirmButtonText: "<u>back</u>",
        });
    }
    else {
        window.location = `VacationsPage.html?flatId=${flatId}`;
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

/*checks if someone is loged in*/
function checkLogin() {
    if (sessionStorage.length == 0 || sessionStorage.getItem('Current user') == undefined || sessionStorage.getItem('Current user') == null) {
        return null;
    }
    else {
        return sessionStorage.getItem('Current user');
    }
}

function backHome() {
    window.location = 'flatsPage.html';
}

function calcAvg() {
    let month = $('#monthAvg').val();
    let APImonth = API + '/' + month;
    ajaxCall("GET", APImonth , "", getAvgSCB, getAvgECB);
}

/*in case of success getting the places from the server rendering it to the place holder*/
function getAvgSCB(data) {
    const flatArray = data;
    if (flatArray.length>0) {
        let str = ``;
        for (var i = 0; i < flatArray.length; i++) {
            str += `<div class='cards card col'>`;
            str += `<p id='space'>${flatArray[i].city}: ${flatArray[i].avgPrice}</p>`;
            str += `</div>`;
        }

        document.getElementById("pha").innerHTML = str;
    }
    else {
        Swal.fire({
            html: "there is no bookings on this month",
            confirmButtonText: "<u>back</u>",
        });
    }
}


/*in case of an error after trying to get the flats from the server*/
function getAvgECB(err) {
    console.log(`An Error was occured: ${err}`);
    Swal.fire({
        html: "Something prevent us to continue",
        confirmButtonText: "<u>back</u>",
    });
}