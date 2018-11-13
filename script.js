function initialize() {
  var address = (document.getElementById('my-address'));
  var autocomplete = new google.maps.places.Autocomplete(address);
  autocomplete.setTypes(['geocode']);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
          return;
      }

  var address = '';
  if (place.address_components) {
      address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
  }
});
}

function codeAddress() {
  var latitut;
  var longitut
  var location;
  geocoder = new google.maps.Geocoder();
  var address = document.getElementById("my-address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

    latitut= results[0].geometry.location.lat();
    longitut= results[0].geometry.location.lng();
    } 

    else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    location = latitut + ", " +longitut;
    setCity(location);
    getURL(location);
  });
}
google.maps.event.addDomListener(window, 'load', initialize);


function setCity(latLon) {
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLon + "&sensor=true";
  url = url.replace(/\s/g, "");
  $.ajax({
    format: "json",
    dataType: "json",
    url: url,
    success: function(data) {
      $('#weather-location').html(data.results[0].address_components[2].long_name);
    },
    method: "GET"
  });
}

function getURL(location, tempSetting) {
  var url = ("https://api.darksky.net/forecast/d0008617a32ab7c3cae043cb95a96db9/" + location);
  //console.log(url);
  getJson(url);
}

function getJson(url) {
  //console.log("started getJson with this url: " + url);

  $.ajax({
      format: "jsonp",
      dataType: "jsonp",
      url: url,
      success: function(json) {
        //console.log("great success");
        $("#weather-current").html(Math.round(json.currently.temperature) + "°");
        $("#weather-high").html("High: " + Math.round(json.daily.data[0].temperatureMax) + "°");
        $("#weather-low").html("Low: " + Math.round(json.daily.data[0].temperatureMin) + "°");
        setBackground(json.currently.icon);
      }

    })
    .error(function(jqXHR, textStatus, errorThrown) {
      alert("error: " + JSON.stringify(jqXHR));
    })
}

$("#temp-type").on("click", function() {
  var currentTemp = $("#weather-current").html().replace(/°/g, "");
  var highTemp = $("#weather-high").html().replace(/°/g, "");
  var lowTemp = $("#weather-low").html().replace(/°/g, "");
  lowTemp = lowTemp.replace("Low: ", "");
  highTemp = highTemp.replace("High: ", "");

  if ($("#temp-type").html() == "Fahrenheit") {
    $("#weather-current").html(toCelsius(currentTemp) + "°");
    $("#weather-high").html("High: " + toCelsius(highTemp) + "°");
    $("#weather-low").html("Low: " + toCelsius(lowTemp) + "°");
    $("#temp-type").html("Celsius");

  } else if ($("#temp-type").html() == "Celsius") {
    $("#weather-current").html(toFahrenheit(currentTemp) + "°");
    $("#weather-high").html("High: " + toFahrenheit(highTemp) + "°");
    $("#weather-low").html("Low: " + toFahrenheit(lowTemp) + "°");
    $("#temp-type").html("°F");

  }

  function toCelsius(num) {
    var newNum = (parseInt(num) - 32) * 5 / 9;
    return Math.round(newNum);
  }

  function toFahrenheit(num) {
    var newNum = (parseInt(num) * 9 / 5) + 32;
    return Math.round(newNum);
  }

})

function setBackground(weatherIcon) {
  //console.log(weatherIcon);
  switch (weatherIcon) {
    case "clear-day":
      document.getElementById("body").style.backgroundImage = 'url("http://feelgrafix.com/data_images/out/15/899301-sunny-day.jpg")';
      break;
    case "clear-night":
      document.getElementById("body").style.backgroundImage = 'url("https://tcklusman.files.wordpress.com/2014/05/tumblr_static_dark-starry-night-sky-226736.jpg")';
      break;
    case "rain":
      document.getElementById("body").style.backgroundImage = 'url("http://wearechange.org/wp-content/uploads/2015/03/1_See_It.jpg")';
      break;
    case "cloudy":
      document.getElementById("body").style.backgroundImage = 'url("http://www.tripwire.com/state-of-security/wp-content/uploads/cache//shutterstock_106367810/4261234929.jpg")';
      break;
    case "partly-cloudy-day":
      document.getElementById("body").style.backgroundImage = 'url("http://www.sturdyforcommonthings.com/wp-content/uploads/2013/03/wind_blowing.jpg")';
      break;
    case "partly-cloudy-night":
      document.getElementById("body").style.backgroundImage = 'url("http://scienceblogs.com/startswithabang/files/2013/04/night-sky-stars.jpeg")';
      break;
    case "snow":
      document.getElementById("body").style.backgroundImage = 'url("http://www.vancitybuzz.com/wp-content/uploads/2015/12/shutterstock_315123593-984x500.jpg")';
      break;
    default:
      break;

  }

}