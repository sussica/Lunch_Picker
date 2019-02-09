

// helper function for updatePosition because that sorry little ass cant do shit by itself
function updatePositionHelper(successCallback, errorCallback) {
    successCallback = successCallback || function () {
        console.log("empty");
    };
    errorCallback = errorCallback || function () {
        console.log("empty1");
    };

    // Try HTML5-spec geolocation.
    var geolocation = navigator.geolocation;

    if (geolocation) {

        // We have a real geolocation service.
        try {
            function handleSuccess(position) {
                console.log(7);
                successCallback(position.coords);  // YAAYYYYY!!
            }
          
            geolocation.watchPosition(handleSuccess, errorCallback, {
                enableHighAccuracy: true, // high accuracy because idk how but this fixes its problems with mobiles
                maximumAge: 0  // 0 sec. ask for new object everytime user moves.
            });

        } catch (err) {
            errorCallback();  // NOOOOOO ;_;
        }
    } else {
        errorCallback();  // NOOOOOO T_T
    }
};


function handleGetPlaceSuccess(placeInformation){
    var placeJSON = placeInformation;
    var placeID = placeJSON.place_id;
    var url = "https://www.google.com/maps/embed/v1/place?key="+
    "AIzaSyAaQDVhgRZ-jKBkqQBBpGemUDfdrSrkxrs&q=place_id:"+placeID;
    $("#map").prop('src', url);
    
    console.log(placeJSON);
    $("#paraRestaurantName").html("Hello: "+placeJSON.name);
};

function handleGetPlaceFailure(errorInformation) {
    alert("Guess what, " + errorInformation.responseText);
}


$(document).ready(function(){   
    var lat;
    var lon;

    console.log(10);

    updatePositionHelper(
        (coords) => {
            lat = coords.latitude;
            lon = coords.longitude;
            console.log(coords);
            $("#errorPara").css("visibility", "hidden");
        },
        () => {
            console.log("error");
        }
    );

    console.log(2);

    $("#btnSendPosition").click(function(){
        if(lat === undefined || lon === undefined){
            console.log([lat, lon]);
            $("#errorPara").css("visibility", "visible");

            lat = 43;
            lon = -78;
        }
        var category = $("#category").val();
        var distance = $("#distance").val();
        var pricelevel = $("#priceLevel").val();
        var rating = $("#rating").val();

        $.ajax({
            type: "POST",
            url: "/",
            data: { "latitude": lat, "longitude": lon, 
                    "category": category, "distance": distance,
                    "pricelevel": pricelevel, "rating":rating },
            success: handleGetPlaceSuccess, 
            error: handleGetPlaceFailure
        });
    });
    }
);