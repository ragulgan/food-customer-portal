import React, { useEffect } from 'react';

function MyLocation(props) {
  const { setLocation, position, setPosition, drag, setDrag } = props
  const lat = sessionStorage.getItem("Lat")
  const long = sessionStorage.getItem("Long")
  const localLocation = sessionStorage.getItem("LocalLocation")

  useEffect(() => {
    if ("geolocation" in navigator) {
      if (lat === null && long === null) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sessionStorage.setItem("Lat", position.coords.latitude)
          sessionStorage.setItem("Long", position.coords.longitude)
        });
      } else if (localLocation === 'true') {
        navigator.geolocation.getCurrentPosition(function (position) {
          setPosition({
            latitude: lat ? lat : position.coords.latitude,
            longitude: long ? long : position.coords.longitude,
          });
          sessionStorage.setItem("Lat", position.coords.latitude)
          sessionStorage.setItem("Long", position.coords.longitude)
        });
        sessionStorage.removeItem('LocalLocation');
      }
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  useEffect(() => {
    // Fetch location details based on latitude and longitude
    if (position && position.longitude !== undefined && position.latitude !== null) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setDrag(data?.results[0]?.formatted_address)
          setLocation(data?.results[0]?.formatted_address);
          sessionStorage.setItem("LOCATION", data?.results[0]?.formatted_address)
        })
        .catch(error => {
          console.error('Error fetching location details:', error);
        });
    }
  }, [position.latitude]);

  return (
    <></>
  );
}

export default MyLocation;