import React from "react";

const Main = () => {
  return (
    <>
      <div className="w-full flex justify-center bg-blue-50">
        <div className="container bg-red-300">
          <div className="w-full font-sans text-[#1B31A8] text-center my-8">
            Let's calculate <span className="font-bold">distance</span> from
            Google maps
          </div>
          <div className="w-full grid md:grid-cols-2 gap-12">
            <div>1</div>
            <div>1</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
