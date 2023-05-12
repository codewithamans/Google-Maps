import React, { useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsService,
  LoadScript,
} from "@react-google-maps/api";

const center = { lat: 26.85, lng: 80.949997 };
const Main = () => {
  const [distance, setdistance] = useState("");
  const [direction, setdirection] = useState("");
  const originref = useRef();
  const destinationnref = useRef();
  const isLoaded = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const calculateDistance = async () => {
    if (
      originref.current.value === "" ||
      destinationnref.current.value === ""
    ) {
      return;
    }
    const direction = new window.google.maps.DirectionsService();
    const results = await direction.route({
      origin: originref.current.value,
      destination: destinationnref.current.value,
      travelMode: "DRIVING",
    });
    setdirection(results);
    setdistance(results.routes[0].legs[0].distance.text);
  };
  const clearRoutes = () => {
    setdirection("");
    setdistance("");
    originref.current.value = "";
    destinationnref.current.value = "";
  };
  return (
    <>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <div className="w-full flex justify-center bg-blue-50">
          <div className="container bg-red-300">
            <div className="w-full font-sans text-[#1B31A8] text-center my-8">
              Let's calculate <span className="font-bold">distance</span> from
              Google maps
            </div>
            <div className="w-full grid md:grid-cols-2 gap-12">
              <div>
                <div className="grid md:grid-cols-2">
                  <div className="bg-gray-100">
                    <div className="my-4">
                      <h1 className="my-1 font-sans">Origin</h1>
                      <Autocomplete>
                        <input
                          type="text"
                          ref={originref}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   p-2.5"
                          placeholder="Origin"
                        />
                      </Autocomplete>
                    </div>
                    <div className="my-4">
                      <h1 className="my-1 font-sans">Destination</h1>
                      <Autocomplete>
                        <input
                          type="text"
                          ref={destinationnref}
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   p-2.5"
                          placeholder="Destination"
                        />
                      </Autocomplete>
                    </div>
                  </div>
                  <div className="bg-yellow-200 flex justify-center items-center">
                    <button
                      className="bg-[#1B31A8] text-white rounded-full px-8 py-4"
                      onClick={calculateDistance}
                    >
                      Calculate
                    </button>
                    <button
                      className="bg-[#1B31A8] mx-2 text-white rounded-full px-8 py-4"
                      onClick={clearRoutes}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex border-gray-300 rounded-lg justify-between px-8 items-center w-[35rem] mt-20 h-20 bg-white">
                    <div className="text-black font-bold text-2xl">
                      Distance
                    </div>
                    <div>{distance}</div>
                  </div>
                  <div>2</div>
                </div>
              </div>
              <div className="w-[100%] h-[40rem]">
                {isLoaded && (
                  <GoogleMap
                    center={center}
                    options={{
                      mapTypeControl: false,
                      mapTypeControlOptions: false,
                      fullscreenControl: false,
                      zoomControl: false,
                      streetViewControl: false,
                    }}
                    zoom={15}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                )}
              </div>
            </div>
          </div>
        </div>
      </LoadScript>
    </>
  );
};

export default Main;
