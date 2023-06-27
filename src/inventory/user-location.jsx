import React, { useEffect, useState } from "react";

const UserLocation = () => {
  const [loginLocation, setLoginLocation] = useState(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      const locationCookieName = "bahmni.user.location"; // Replace with the actual cookie name

      const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
      const locationCookie = cookies.find((cookie) =>
        cookie.startsWith(`${locationCookieName}=`)
      );

      if (locationCookie) {
        const locationValue = locationCookie.split("=")[1];
        const decodedLocation = decodeURIComponent(locationValue);

        try {
          const locationObject = JSON.parse(decodedLocation);
          const locationName = locationObject.name;
          setLoginLocation(locationName);
        } catch (error) {
          console.error("Failed to parse login location JSON", error);
          setLoginLocation(null);
        }
      } else {
        setLoginLocation(null);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <div>
      <h5>Login Location: {loginLocation}</h5>
    </div>
  );
};
export default UserLocation;
