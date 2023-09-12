$(document).ready(function() {
    //Set geo location  of lat and long
    navigator.geolocation.getCurrentPosition(function(position, html5Error) {

        geo_loc = processGeolocationResult(position);
        currLatLong = geo_loc.split(",");
        initializeCurrent(currLatLong[0],currLatLong[1]);

   });

   //Get geo location result

  function processGeolocationResult(position) {
        html5Lat = position.coords.latitude; //Get latitude
        html5Lon = position.coords.longitude; //Get longitude
        html5TimeStamp = position.timestamp; //Get timestamp
        html5Accuracy = position.coords.accuracy; //Get accuracy in meters
        return (html5Lat).toFixed(8) + "," + (html5Lon).toFixed(8);
  }

   //Check value is present or not & call google api function

   function initializeCurrent(latcurr,longcurr) {
        // currgeocoder = new google.maps.Geocoder();
        var path=location.protocol

        if(path == 'http:'){
           var url=`http://api.geonames.org/findNearbyPostalCodes?lat=${latcurr}&lng=${longcurr}&username=demo`
        }else{
          var url= `https://secure.geonames.org/findNearbyPostalCodes?lat=${latcurr}&lng=${longcurr}&username=demo`
        }
        $.ajax({
           url: url,
           type: "GET",
           success: function (data) {
               var xml = data; // Your XML response
       
               if (typeof xml === 'object' && xml !== null) {
                   var xmlStr = new XMLSerializer().serializeToString(xml);

                   function getXmlValue(xmlStr, elementName) {
                       var regex = new RegExp("<" + elementName + ">(.*?)<\/" + elementName + ">", "i");
                       var match = xmlStr.match(regex);

                       if (match && match.length > 1) {
                           // Extract the value of the element
                           return match[1];
                       } else {
                           return null; // Element not found in the XML
                       }
                   }

                   var $locationText = $(".location");
                   var $locationText1 = $(".getcurrentlocation");

                   var postalCode = getXmlValue(xmlStr, 'postalcode');
                   var district = getXmlValue(xmlStr, 'adminName2');
                   var country_code = getXmlValue(xmlStr, 'countryCode');
                   var state = getXmlValue(xmlStr, 'adminName1');
                   var name=getXmlValue(xmlStr, 'name');
                       
                 $locationText1.empty();
                       $locationText1.append(name);

                       setCookie(state,country_code, postalCode, name, district);

                       function setCookie(state, country_code, postalCode, name, district) {
                       
                       var d = new Date();
                       d.setTime(d.getTime() + (1*24*60*60*1000));
                       var expires = "expires=" + d.toGMTString();
                       $.cookie("state_code", state);
                       $.cookie("country_code", country_code);
                       $.cookie("city_code", name);
                       $.cookie("postal_code", postalCode);
                       $.cookie("state_district", district);
                   }

               } else {
                   console.log("XML data is not in a recognized object format.");
               }   


           }
       });
  }

});
