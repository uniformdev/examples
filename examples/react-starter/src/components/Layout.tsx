import { Link, Outlet } from "react-router-dom";
import ContextTools from "./uniform/ContextTools";

export default function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/developers">For Developers</Link>
          </li>
          <li>
            <Link to="/marketers">For Marketers</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
      <hr />
      <ContextTools />
    </div>
  );
}
