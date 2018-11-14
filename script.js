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
    getURL(location);
  });
}
google.maps.event.addDomListener(window, 'load', initialize);



function getURL(location, tempSetting) {
  var url = ("https://api.darksky.net/forecast/e345c5612b0c3a56d17c25b067acdd1c/" + location +"?units=si");
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
        $("#weather-summary").html(json.currently.summary);
        $("#weather-current").html(Math.round(json.currently.temperature) + "°");
        $("#weather-high").html("High: " + Math.round(json.daily.data[0].temperatureMax) + "°");
        $("#weather-low").html("Low: " + Math.round(json.daily.data[0].temperatureMin) + "°");
      }

    })
    .error(function(jqXHR, textStatus, errorThrown) {
      alert("error: " + JSON.stringify(jqXHR));
    })
}


