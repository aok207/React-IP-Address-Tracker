import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line react/prop-types
const LocationInfo = ({ label, data }) => {
  return (
    <div
      className={`flex flex-col ml-4 pr-8 max-md:pr-0 max-md:ml-0 flex-1 max-md:text-center gap-1 max-md:mb-2 ${
        label !== "ISP" && "border-r border-r-slate-300 max-md:border-none"
      }`}
    >
      <p className="font-rubik text-sm font-semibold leading-tight text-dark-gray">
        {label}
      </p>
      <h2 className="font-rubik text-2xl font-bold text-black">{data}</h2>
    </div>
  );
};

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [infoData, setData] = useState(null);

  const getDetails = () => {
    fetch(
      "https://geo.ipify.org/api/v2/country,city?apiKey=" + import.meta.env.VITE_API_KEY + "&ipAddress=" +
        ipAddress
    )
      .then((res) => res.json())
      .then((data) => {
        setLatLng([data.location.lat, data.location.lng]);

        setData([
          { label: "IP ADDRESS", data: data.ip },
          {
            label: "LOCATION",
            data: data.location.city + data.location.country,
          },
          { label: "TIMEZONE", data: "UTC " + data.location.timezone },
          { label: "ISP", data: data.isp },
        ]);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    // Get the user's ip when the component mount
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => alert("Error fetching IP address: " + error));

    getDetails();
  }, []);

  // Function to place the info div exactly between the top and bottom part if the window width is 768 or above
  const onResize = () => {
    const element = document.getElementById("info-div");
    element.style.top = `calc(${
      window.innerWidth < 768 ? (1 / 3) * 100 + 7 : (1 / 3) * 100
    }% - ${parseFloat(element.clientHeight / 2)}px)`;
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (infoData) {
      onResize();
    }
  }, [infoData]);

  const formOnSubmit = (e) => {
    e.preventDefault();
    setIpAddress(e.target.ip.value);
    getDetails();
  };

  // Custom Marker Icon
  const customMarkerSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z" className="w-8"/></svg>';

  const customMarkerIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(customMarkerSvg)}`,
    iconSize: [30, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return (
    <>
      <div className="h-1/3 bg-desktop-pattern max-md:bg-mobile-pattern bg-no-repeat bg-center bg-cover pt-10 flex flex-col gap-4 items-center max-md:pt-4">
        <h2 className="font-semibold font-rubik text-white text-3xl">
          IP Address Tracker
        </h2>
        <form onSubmit={(e) => formOnSubmit(e)}>
          <div className="flex items-center">
            <input
              placeholder="Search for any IP address or domain"
              className="font-rubik py-3 text-[15px] focus:border-none focus:outline-none rounded-l-lg px-4 bg-white w-96 max-md:w-[300px]"
              value={ipAddress}
              name="ip"
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-very-dark-gray h-[48px] w-11 rounded-r-lg hover:bg-neutral-700 border-very-dark-gray flex justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                <path
                  fill="none"
                  stroke="#FFF"
                  strokeWidth="3"
                  d="M2 1l6 6-6 6"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {latLng !== null ? (
        <MapContainer
          key={`${latLng[0]}_${latLng[1]}`}
          center={latLng}
          zoom={13}
          scrollWheelZoom={true}
          className="h-2/3"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={latLng} icon={customMarkerIcon}>
            <Popup>Current Location</Popup>
          </Marker>
        </MapContainer>
      ) : null}

      {infoData !== null && (
        <div
          className="absolute top-1/3 right-1/2 transform translate-x-1/2 bg-white flex p-4 gap-3 py-8 rounded-lg w-4/5 max-md:w-[342px] max-md:block"
          style={{ zIndex: 1000 }}
          id="info-div"
        >
          {infoData.map((i) => (
            <LocationInfo key={i.label} label={i.label} data={i.data} />
          ))}
        </div>
      )}
      <div className="text-center mt-4">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noreferrer" className="font-rubik font-semibold">
          Frontend Mentor
        </a>
        . Coded by <a href="https://aungookhant-portfolio.onrender.com/" target="_blank" rel="noreferrer" className="font-rubik font-semibold">Aung Oo Khant</a>.
      </div>
    </>
  );
}

export default App;
