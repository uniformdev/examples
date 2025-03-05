import React from "react";
import { YOUR_CMS } from "../lib/constants";

// This is the main page of the integration.
// It is shown when someone directly navigates to the integration in their browser.
// Nobody should see this page, as the integration is meant to be used within the Uniform UI.

const Index = () => (
  <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center px-6 py-12">
    <div className="max-w-3xl text-center space-y-8">
      <h1 className="text-5xl font-extrabold text-blue-900">
        {YOUR_CMS} API Integration for Uniform
      </h1>
      <p className="text-lg text-gray-700">
        Seamlessly connect data from {YOUR_CMS}&apos;s API with Uniform&apos;s
        composable DXP for an engaging and dynamic experience.
      </p>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-blue-800">Key Features</h2>
        <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>Simple setup with user-friendly configuration</li>
          <li>Access {YOUR_CMS} data and images</li>
          <li>Support for filtering and dynamic selection</li>
          <li>Effortless integration with Uniform&apos;s Canvas</li>
        </ul>
      </div>
      <p className="text-sm text-gray-500">
        Need assistance? Check out the{" "}
        <a
          href="https://docs.uniform.app/"
          className="text-blue-600 hover:underline"
        >
          official documentation
        </a>{" "}
        or contact our support team.
      </p>
    </div>
  </main>
);

export default Index;
