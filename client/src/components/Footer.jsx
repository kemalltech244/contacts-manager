import React from "react";

const Footer = () => {
  return (
    <div className=" place-items-center">
      <p className=" font-bold">
        Ke<span className=" text-red-700">Mall</span> &copy;{" "}
        {new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
