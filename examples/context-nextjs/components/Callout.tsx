import React from "react";
import Image from "next/image";
import { Test } from "@uniformdev/context-react";
import { TestVariant } from "@uniformdev/context";

export const LoadingSkeleton = () => {
  return (
    <div
      className="container mx-auto flex flex-wrap pt-4 pb-12"
      style={{ minHeight: 515 }}
    ></div>
  );
};

enum CalloutVariant {
  Left = "left",
  Right = "right",
}

type CalloutProps = {
  title: string;
  description: string;
  image: {
    url: string;
    alt?: string;
  };
};

type Variant = TestVariant & CalloutProps;

const variants: Variant[] = [
  {
    id: CalloutVariant.Left,
    title: "Why to attend UniformConf?",
    description: "Variant id: 'left'",
    image: {
      url: "https://images.unsplash.com/photo-1550305080-4e029753abcf?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Left Callout Image",
    },
  },
  {
    id: CalloutVariant.Right,
    title: "You you must attend.",
    description: "Variant id: 'right'",
    image: {
      url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Right Callout Image",
    },
  },
];

export const CalloutTest = () => {
  return (
    <Test
      name="whyAttendTest"
      variations={variants}
      loadingMode={LoadingSkeleton}
      component={(props) => <Callout {...props} />}
    />
  );
};

export const Callout = ({ title, description, image, id }: Variant) => (
  <section className="bg-white border-b py-8">
    <div className="container max-w-5xl mx-auto m-8">
      <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        {title}
      </h1>
      <div className="w-full mb-4">
        <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
      </div>
      {id === CalloutVariant.Left ? (
        <div className="flex flex-wrap">
          <div className="w-5/6 sm:w-1/2 p-6">
            <p
              className="text-gray-600 mb-8"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <div className="w-full sm:w-1/2 p-6">
            <Image
              src={image?.url}
              alt={image?.alt ?? "callout"}
              width="500"
              height="500"
              layout="responsive"
              loading="lazy"
              className="w-full sm:h-64 mx-auto"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap flex-col-reverse sm:flex-row">
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <Image
              src={image?.url}
              alt={image?.alt ?? "callout"}
              width="500"
              height="500"
              layout="responsive"
              loading="lazy"
              className="w-5/6 sm:h-64 mx-auto"
            />
          </div>
          <div className="w-full sm:w-1/2 p-6 mt-6">
            <div className="align-middle">
              <p
                className="text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
);
