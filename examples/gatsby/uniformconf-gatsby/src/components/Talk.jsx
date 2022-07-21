import React from "react"

export const Talk = ({ title, description, audience }) => (
  <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow space-y-2 pt-2">
    <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden">
      <div className="mt-3 mb-3 flex items-center justify-start">
        <AudienceLabel audienceName={audience} />
      </div>
    </div>
    <a href="#" className="flex flex-wrap no-underline hover:no-underline">
      <div
        className="w-full font-bold text-xl text-gray-800 px-6"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
    </a>
    <div
      className="text-gray-800 px-6 pb-6 text-sm"
      dangerouslySetInnerHTML={{
        __html: description,
      }}
    />
  </div>
)

const AudienceLabel = ({ audienceName }) => (
  <span
    className={
      audienceName === "Developers"
        ? "ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
        : "ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800"
    }
  >
    {audienceName}
  </span>
)
