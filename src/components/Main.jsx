import React, { useEffect, useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { AiFillDelete, AiOutlinePlusCircle } from "react-icons/ai";

const center = { lat: 26.85, lng: 80.949997 };
const Main = () => {
  const [distance, setdistance] = useState("");
  const [transitMode, setTransitMode] = useState("DRIVING");
  const [duration, setDuration] = useState("");

  const [direction, setdirection] = useState("");
  const [state, setstate] = useState(false);
  const [stopState, setstopState] = useState(false);
  const [stops, setStops] = useState([]);
  const originref = useRef();
  const stopsRef = useRef();
  const destinationnref = useRef();
  const isLoaded = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const addStop = () => {
    if (stopsRef.current.value === "") {
      return;
    }
    const newStop = stopsRef.current.value;
    setStops((prevStops) => [...prevStops, newStop]);
    stopsRef.current.value = "";
  };
  const removeStop = (index) => {
    setStops((prevStops) => prevStops.filter((_, i) => i !== index));
  };

  const calculateDistance = async () => {
    if (
      originref.current.value === "" ||
      destinationnref.current.value === ""
    ) {
      return;
    }
    setstopState(true);
    const direction = new window.google.maps.DirectionsService();
    const waypoints = stops.map((stop) => ({ location: stop, stopover: true }));
    const results = await direction.route({
      origin: originref.current.value,
      destination: destinationnref.current.value,
      travelMode: transitMode,
      waypoints: waypoints,
    });
    setdirection(results);
    setdistance(
      results.routes[0].legs.reduce(
        (total, leg) => total + leg.distance.value,
        0
      )
    );
    setDuration(results.routes[0].legs[0].duration.text);
    setstate(true);
  };
  const clearRoutes = () => {
    setdirection("");
    setdistance("");
    setstate(false);
    originref.current.value = "";
    destinationnref.current.value = "";
    setStops([]);
    setstopState(false);
  };

  return (
    <>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <div className="w-full flex justify-center bg-blue-50">
          <div className="w-full md:w-4/5 ">
            <div className="w-full font-sans text-[#1B31A8] text-center my-8">
              Let's calculate <span className="font-bold">distance</span> from
              Google maps
            </div>
            <div className="w-full  grid lg:grid-cols-2 md:gap-12">
              <div className=" order-2 lg:order-1">
                <div className="grid md:grid-cols-2">
                  <div className="">
                    <div className="my-4 mx-4 md:mx-0">
                      <h1 className="my-1 font-sans">Origin</h1>
                      <Autocomplete>
                        <input
                          type="text"
                          ref={originref}
                          class="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg   p-2.5"
                          placeholder="Origin"
                        />
                      </Autocomplete>
                    </div>
                    {stopState && (
                      <Autocomplete>
                        <div className="my-4 mx-4 md:mx-0">
                          <h1 className="my-1 font-sans">Stops</h1>
                          {stops.map((stop, index) => (
                            <div key={index} className=" mb-2 ">
                              <input
                                type="text"
                                value={stop}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mr-2"
                                readOnly
                              />
                              <div className="flex  items-center ml-20">
                                <AiFillDelete
                                  size={20}
                                  className=" m-2 "
                                  onClick={() => removeStop(index)}
                                />
                                <p> Delete Stop </p>
                              </div>
                            </div>
                          ))}
                          <div className="">
                            <input
                              type="text"
                              ref={stopsRef}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mr-2"
                              placeholder="Add a stop"
                            />
                            <div className="flex  items-center ml-20">
                              <AiOutlinePlusCircle
                                size={20}
                                className=" m-2"
                                onClick={addStop}
                              />
                              <p> Add Stop </p>
                            </div>
                          </div>
                        </div>
                      </Autocomplete>
                    )}

                    <div className="my-4 mx-4 md:mx-0">
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
                  <div className="flex justify-center mt-4 md:mt-0 items-center">
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
                  <div className="flex  border-gray-300 border rounded-lg justify-between px-8 items-center w-full mt-12 md:mt-20 h-20 bg-white">
                    <div className="text-black font-bold text-2xl">
                      Distance
                    </div>
                    <div className="text-[#0079FF] text-2xl md:text-3xl font-bold">
                      {(distance / 1000).toFixed(2)} km
                    </div>
                  </div>

                  {state && (
                    <div className="w-full border-gray-300 py-4 px-2 border rounded-lg">
                      <p>
                        The distance between
                        <span className="font-bold">{` ${originref.current.value} `}</span>
                        and
                        <span className="font-bold">{` ${destinationnref.current.value} `}</span>
                        via the selected route is {(distance / 1000).toFixed(2)}{" "}
                        km
                      </p>
                    </div>
                  )}
                </div>
                <div className="my-4 md:my-8 flex">
                  <div className="font-bold text-2xl md:text-3xl px-3">
                    Duration:{" "}
                  </div>
                  <div className="text-[#0079FF] text-3xl font-bold">
                    {duration}
                  </div>
                </div>
              </div>
              <div className="w-full h-[20rem] lg:h-full lg:order-2">
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
                    {stopState && <DirectionsRenderer directions={direction} />}
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
