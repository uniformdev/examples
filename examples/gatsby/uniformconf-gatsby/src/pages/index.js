import React from "react"
import { Link } from "gatsby"

export default function Home() {
  return (
    <>
      <h1 className="text-xxl">No other place like home.</h1>
      <p>
        Index route is not supported yet. Please open{" "}
        <Link to="/home" className="underline">
          this Home page
        </Link>{" "}
        instead.
      </p>
    </>
  )
}
