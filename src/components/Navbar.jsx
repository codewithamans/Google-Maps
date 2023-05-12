import React from "react";
import Logo from "./images/gravity.png";

const Navbar = () => {
  return (
    <>
      <div className="w-full my-4">
        <img src={Logo} alt="" srcset="" className="ml-4 md:ml-12 lg:ml-20" />
      </div>
    </>
  );
};

export default Navbar;
