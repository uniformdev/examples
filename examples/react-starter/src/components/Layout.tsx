import { Link, Outlet } from "react-router-dom";
import QurksSetter from "./uniform/QuirksSetter";
import QuirksGetter from "./uniform/QuirksGetter";

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
            <Link to="/support">Support</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
      <QurksSetter />
      {/* <QuirksGetter /> */}
    </div>
  );
}
