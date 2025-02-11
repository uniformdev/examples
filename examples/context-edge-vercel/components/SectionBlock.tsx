import React from "react";
import { Test } from "@uniformdev/context-react";

type TestVariant = {
  id: string;
  title: string;
  description: string;
};

const testVariants: TestVariant[] = [
  { id: "a", title: "Why Attend?", description: "variant A" },
  {
    id: "b",
    title: "Why should you attend?",
    description: "variant B",
  },
];

export const SectionBlockTest = () => {
  return (
    <Test
      name="whyAttendTest"
      variations={testVariants}
      component={(props) => <SectionBlock {...props} />}
    />
  );
};

export const SectionBlock = ({ title, description }: TestVariant) => {
  return (
    <section className="bg-white border-b py-8">
      <div className="container max-w-5xl mx-auto m-8">
        <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {title}
        </h1>
        <p
          className="text-gray-600 mb-8"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </section>
  );
};
