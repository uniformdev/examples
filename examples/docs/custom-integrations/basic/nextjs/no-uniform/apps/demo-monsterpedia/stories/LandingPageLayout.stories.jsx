import React from "react";
import { Composition } from "@uniformdev/canvas-react";
import LandingPageLayout from "../components/LandingPageLayout";
import resolveRenderer from "../lib/resolveRenderer";

export default {
  title: "Basic Integration/Landing Page Layout",
  component: LandingPageLayout,
  argTypes: {
  },
  parameters: { controls: { sort: "requiredFirst" } },
};

export const Default = Template.bind({});
Default.args = {
  composition: {
    _id: "13b8cc7d-614a-4b28-9e9d-933b483277d0",
    type: "landingPage",
    _name: "Home Page",
    _slug: "/",
    slots: {
      body: [
        {
          type: "dragonDetails",
          parameters: {
            dragon: {
              type: "monster-list",
              value: {
                index: "ancient-gold-dragon",
              },
            },
          },
        },
      ],
    },
    parameters: {
      pageName: {
        type: "text",
        value: "Welcome to the site!",
      },
    },
  },
};

function Template(args) {
  const { composition } = args;
  return (
    <Composition data={composition} resolveRenderer={resolveRenderer}>
      <LandingPageLayout {...args} />
    </Composition>
  );
}
