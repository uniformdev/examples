import React from "react"
import { Link } from "gatsby"

const NavMenu = () => (
  <ul className="list-reset lg:flex justify-end flex-1 items-center space-x-2 lg:mr-4">
    <li>
      <Link
        to="/"
        className="inline-block py-2 px-4 text-black font-bold no-underline"
      >
        Home
      </Link>
    </li>
    <li>
      <Link
        to="/developers"
        className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
      >
        For Developers
      </Link>
    </li>
    <li>
      <Link
        to="/marketers"
        className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
      >
        For Marketers
      </Link>
    </li>
    <li>
      <Link
        to="/registration"
        className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
      >
        Registration
      </Link>
    </li>
    <li>
      <Link
        to="/home?utm_campaign=unfrmconf"
        className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
      >
        Campaign
      </Link>
    </li>
  </ul>
)

export default NavMenu
