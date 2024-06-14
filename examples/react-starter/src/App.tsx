import React, { useEffect } from "react";
import { parse } from "cookie";
import "./App.css";
import { UniformContext, useUniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "./uniform/uniformContext";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Support from "./components/Support";

const clientContext = createUniformContext();

function App() {
  return (
    <UniformContext context={clientContext}>
      <h1>Uniform React starter</h1>
      <Container />
    </UniformContext>
  );
}

function Container() {
  const { context } = useUniformContext();
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    // Important: updating Uniform Context on route change with the latest route and cookies so the signals can evaluate based on that
    context.update({
      url: new URL(
        `${document.location.protocol}//${document.location.host}${location.pathname}${location.search}`
      ),
      cookies: parse(document.cookie ?? ""),
    });
  }, [location, context]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
