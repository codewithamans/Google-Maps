import React, { useEffect, useRef, useState } from "react";
import Destination from "./images/Destination.png";
import Ellipse from "./images/Ellipse.png";
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
  const destinationref = useRef();
  const isLoaded = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const addStop = () => {
    const newStop = stopsRef.current.value;
    if (newStop !== "" && !stops.includes(newStop)) {
      setStops([...stops, newStop]);

      // Update the map with the new stops
      // calculateDistance();
    }
    stopsRef.current.value = "";
  };

  const removeStop = (index) => {
    setStops((prevStops) => prevStops.filter((_, i) => i !== index));
    calculateDistance();
  };
  useEffect(() => {
    calculateDistance();
  }, [stops]);
  const calculateDistance = async () => {
    if (!originref.current || !destinationref.current) {
      return;
    }
    if (originref.current.value === "" || destinationref.current.value === "") {
      return;
    }
    setstopState(true);
    const direction = new window.google.maps.DirectionsService();
    const waypoints = stops.map((stop) => ({ location: stop, stopover: true }));
    const results = await direction.route({
      origin: originref.current.value,
      destination: destinationref.current.value,
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
    destinationref.current.value = "";
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
            <div className="w-full font-sans hidden md:block text-[#1B31A8] text-center my-8">
              Let's calculate <span className="font-bold">distance</span> from
              Google maps
            </div>
            <div className="w-full  grid lg:grid-cols-2 md:gap-12">
              <div className=" order-2 lg:order-1">
                <div className="grid md:grid-cols-2">
                  <div className="">
                    <div className="my-12 md:my-4 mx-4 md:mx-0">
                      <h1 className="my-1 font-sans hidden md:block">Origin</h1>
                      <Autocomplete>
                        <div class="relative mb-6">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <div className="w-3 h-3 rounded-full bg-green-400 p-[6px] border border-black"></div>
                          </div>
                          <input
                            type="text"
                            ref={originref}
                            class="w-full md:w-[250px] h-[45px] bg-white border font-bold border-gray-300 text-black text-sm rounded-lg f block  pl-8 p-2.5  "
                            placeholder="Origin"
                          />
                        </div>
                      </Autocomplete>
                    </div>
                    {stopState && (
                      <Autocomplete>
                        <div className="my-4 mx-4 md:mx-0">
                          <h1 className="my-1 font-sans font-semibold hidden md:block">
                            Stop
                          </h1>
                          {stops.map((stop, index) => (
                            <div key={index} className=" mb-2 ">
                              <div class="relative ">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <div>
                                    <img
                                      src={Ellipse}
                                      alt=""
                                      srcset=""
                                      width="15"
                                      height="15"
                                    />
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={stop}
                                  class="w-full md:w-[250px] h-[45px] bg-white border font-bold border-gray-300 text-black text-sm rounded-lg f block  pl-8 p-2.5  "
                                  placeholder="Stop"
                                />
                              </div>
                              <div className="flex  items-center ml-[14rem] md:ml-[8rem]">
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
                            <div class="relative ">
                              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <div>
                                  <img
                                    src={Ellipse}
                                    alt=""
                                    srcset=""
                                    width="15"
                                    height="15"
                                  />
                                </div>
                              </div>
                              <input
                                type="text"
                                ref={stopsRef}
                                class="w-full md:w-[250px] h-[45px] bg-white border font-bold border-gray-300 text-black text-sm rounded-lg f block  pl-8 p-2.5  "
                                placeholder="Stop"
                              />
                            </div>
                            <div className="flex  items-center ml-[14rem] md:ml-[8rem]">
                              <AiOutlinePlusCircle
                                size={20}
                                className=" m-2"
                                onClick={() => {
                                  addStop();
                                  calculateDistance();
                                }}
                              />
                              <p> Add Stop </p>
                            </div>
                          </div>
                        </div>
                      </Autocomplete>
                    )}

                    <div className="my-4 mx-4 md:mx-0">
                      <h1 className="my-1 font-sans hidden md:block">
                        Destination
                      </h1>
                      <Autocomplete>
                        <div class="relative mb-6">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <div>
                              <img
                                src={Destination}
                                alt=""
                                srcset=""
                                width="15"
                                height="15"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            ref={destinationref}
                            class="w-full md:w-[250px] h-[45px] bg-white border font-bold border-gray-300 text-black text-sm rounded-lg f block  pl-8 p-2.5  "
                            placeholder="Destination"
                          />
                        </div>
                      </Autocomplete>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 md:mt-0 items-center">
                    <button
                      className="bg-[#1B31A8] md:ml-20 text-white rounded-full py-2 px-8  md:py-4"
                      onClick={() => {
                        calculateDistance();
                      }}
                    >
                      Calculate
                    </button>
                    <button
                      className="bg-[#1B31A8] mx-2 text-white rounded-full py-2 px-8  md:py-4"
                      onClick={clearRoutes}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div>
                  <div className="border-gray-300 border m-4 rounded-[8px] mt-12">
                    <div className="flex   justify-between px-8 items-center    h-20 bg-white">
                      <div className="text-black font-bold text-2xl">
                        Distance
                      </div>
                      <div className="text-[#0079FF] text-2xl md:text-3xl font-bold">
                        {(distance / 1000).toFixed(2)} km
                      </div>
                    </div>

                    {state && (
                      <div className="w-full text-sm p-8">
                        <p>
                          The distance between
                          <span className="font-bold">{` ${originref.current.value} `}</span>
                          and
                          <span className="font-bold">{` ${destinationref.current.value} `}</span>
                          via the selected route is
                          <span className="font-bold">
                            {` ${(distance / 1000).toFixed(2)}`} km
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
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
              <div className="w-full h-[20rem] lg:h-[40rem] lg:order-2">
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
