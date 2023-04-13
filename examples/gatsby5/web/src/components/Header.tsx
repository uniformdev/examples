import * as React from "react";
import { Link } from "gatsby";

export const Header = () => {
  return (
    <div className="px-5 py-2 grid gap-2 content-center grid-cols-12 text-[#fff4ec] bg-[#2d2d34] font-light text-sm">
      <div className="col-span-4 items-center">
        <Link className="font-bold text-lg" to="/">
          Joyride
        </Link>
      </div>

      <div className="flex space-x-10 col-span-8 justify-end items-center">
        <Link to="/get-a-ride">Get a ride</Link>
        <Link to="/drive-with-us">Drive with us</Link>
        <Link to="/get-a-ride">About us</Link>
        <Link to="/safety">Safety</Link>

        <Link to="/login" className="px-2 py-1 bg-[#c98686] rounded">
          Log in
        </Link>
      </div>
    </div>
  );
};
