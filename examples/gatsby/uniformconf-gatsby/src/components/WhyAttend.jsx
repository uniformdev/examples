import React from "react"

export const WhyAttendLoading = () => {
  return (
    <div
      className="container mx-auto flex flex-wrap pt-4 pb-12"
      style={{ minHeight: 515 }}
    ></div>
  )
}

export const WhyAttend = ({ title, text, image, component }) => (
  <section className="bg-white border-b py-8">
    <div
      className="container mx-auto flex flex-wrap pt-4 pb-12"
      style={{
        flexDirection:
          component.variant === "whyattendleft" ? "row" : "row-reverse",
      }}
    >
      {image ? (
        <div className="w-1/2">
          <img
            src={image}
            alt={title}
            width={400}
            height={400}
            loading="lazy"
            className="p-10"
          />
        </div>
      ) : null}
      <div className="w-1/2">
        <div className="p-10">
          <h2
            className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <hr />
          <p
            className="text-gray-800 p-10 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </div>
  </section>
)
