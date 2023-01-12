import * as React from "react";

export const Header = () => {
  return (
    <div className="px-5 py-2 grid gap-2 content-center grid-cols-12 text-[#fff4ec] bg-[#2d2d34] font-light text-sm">
      <div className="col-span-4 items-center">
        <p className="font-bold text-lg">Joyride</p>
      </div>

      <div className="flex space-x-10 col-span-8 justify-end items-center">
        <p>Get a ride</p>
        <p>Drive with us</p>
        <p>About us</p>
        <p>Safety</p>
        <button className="px-2 py-1 bg-[#c98686] rounded">Log in</button>
      </div>
    </div>
  );
};
