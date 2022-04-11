import React, { useEffect } from "react";
import { ActiveLink } from "raviger";

import logo from "../assets/logo.svg";
import { me } from "../utils/APIMethods";

const BaseRouteLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const Header = () => {
  const [routeLinks, setRouteLinks] = React.useState(BaseRouteLinks);
  useEffect(() => {
    me().then((_) => {
      if (!_.username){
        setRouteLinks(BaseRouteLinks.concat([{ name: "Login", path: "/login" }]));
      }
    });
  }, [])

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
              exactActiveClass="text-blue-600 font-semibold"
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
