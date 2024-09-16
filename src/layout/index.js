import React from "react";
import logo from "../assets/main_logo1.png";
function AuthLayouts({ children }) {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img src={logo} alt="logo" width={90} height={60} className="py-2" />
      </header>
      {children}
    </>
  );
}

export default AuthLayouts;
