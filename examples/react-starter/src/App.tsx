import React from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Support from "./components/Support";

function App() {
  return (
    <>
      <h1>Uniform React starter</h1>
      <Container />
    </>
  );
}

function Container() {
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
