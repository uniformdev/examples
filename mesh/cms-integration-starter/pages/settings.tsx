import React from "react";
import { Callout } from "@uniformdev/mesh-sdk-react";
import { YOUR_CMS } from "../lib/constants";

// This settings page is rendered when the user navigates to the Settings page in the Uniform UI. 
// It is also shown upon installation of the integration.

export default function Settings() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 rounded-lg shadow-lg">
      <Callout type="success">
        <p className="text-lg font-semibold text-green-700">
          The {YOUR_CMS} API integration has been installed successfully.
        </p>
      </Callout>

      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">
          Configuring the {YOUR_CMS} API Integration
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          To configure the integration and start using {YOUR_CMS} data in
          Uniform, please follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-4 pl-6 text-gray-800">
          <li className="leading-relaxed">
            Navigate to <strong>Experience &gt; Data Types</strong> in the main
            navigation above.
          </li>
          <li className="leading-relaxed">
            Click the <strong>Add data type</strong> button in the top-right
            corner of the page.
          </li>
          <li className="leading-relaxed">
            Select <strong>Akeneo PIM</strong> as the data source
            type.
          </li>
          <li className="leading-relaxed">
            Configure your {YOUR_CMS} API connection by providing the following
            information:
            <ul className="list-disc list-inside pl-6 space-y-2 text-gray-700">
              <li>
                {YOUR_CMS} Base URL (e.g., https://your-instance.cloud.akeneo.com)
              </li>
              <li>
                Bearer Token for API authentication
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Note: The API path (/api/rest/v1) will be automatically appended to your base URL.
            </p>
          </li>
          <li className="leading-relaxed">
            Choose between <strong>Single Product</strong> or <strong>Multiple Products</strong> 
            archetype based on your needs:
            <ul className="list-disc list-inside pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Single Product:</strong> Select one product at a time
              </li>
              <li>
                <strong>Multiple Products:</strong> Select multiple products with filters and search
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-300">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Need Help?
        </h3>
        <p className="text-gray-700 leading-relaxed">
          If you encounter any issues or have questions about the integration,
          please refer to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            documentation
          </a>
          , or contact our support team.
        </p>
      </div>
    </div>
  );
}
