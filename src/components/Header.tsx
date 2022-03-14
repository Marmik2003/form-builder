import React from "react";
import { ActiveLink } from "raviger";

import logo from "../assets/logo.svg";

const routeLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const Header = () => {
  return (
    <div className="flex justify-between gap-2 items-center">
      <img
        src={logo}
        alt="React Logo"
        className="animate-spin h-16 w-16"
        style={{ animation: "spin 3s linear infinite" }}
      />
      <div className="flex gap-3">
        {routeLinks.map((link) => (
          <div className="flex-1" key={link.name}>
            <ActiveLink
              className="text-center block border-white rounded-full text-black"
              href={link.path}
              exactActiveClass="text-blue-500"
            >
              {link.name}
            </ActiveLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
