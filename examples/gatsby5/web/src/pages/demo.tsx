import React from "react";
import { Test } from "@uniformdev/context-react";
import { UniformContext } from "@uniformdev/context-react";
import { createUniformContext } from "../lib/uniformContext";
import { Hero } from "../components/Hero";

const clientContext = createUniformContext();

const variants: Array<any> = [
  {
    content: {
      system: {
        id: "7398aaf1-113a-408f-b97d-73dac8bc920a",
        name: "We are live!",
        codename: "we_are_live_",
        language: "default",
        type: "hero",
        collection: "default",
        sitemap_locations: [],
        last_modified: "2023-08-02T01:58:54.6634643Z",
        workflow_step: "published",
      },
      elements: {
        title: {
          type: "text",
          name: "Title",
          value: "We are live!",
        },
        description: {
          type: "rich_text",
          name: "Description",
          images: {},
          links: {},
          modular_content: [],
          value:
            "<p>You are seeing this because Uniform tracker identified active signal Launch Campaign</p>",
        },
        image: {
          type: "asset",
          name: "Image",
          value: [
            {
              name: "photo-1473655587843-eda8944061e8.jpeg",
              description: null,
              type: "image/jpeg",
              size: 196436,
              url: "https://assets-us-01.kc-usercontent.com:443/c62763fd-db52-0065-d217-cfbead2ff385/ab9ddb5f-f41f-4fff-a247-c8c3e207568b/photo-1473655587843-eda8944061e8.jpeg",
              width: 1744,
              height: 1161,
              renditions: {},
            },
          ],
        },
        cta_title: {
          type: "text",
          name: "CTA Title",
          value: "Get a demo",
        },
        cta_link: {
          type: "text",
          name: "CTA Link",
          value: "https://uniform.dev/demo",
        },
        personalization_criteria: {
          type: "custom",
          name: "Personalization Criteria",
          value: "",
        },
      },
    },
  },
  {
    content: {
      system: {
        id: "3d314409-4725-486f-a515-c1b6eda9c54e",
        name: "Let’s Take a Ride",
        codename: "let_s_take_a_ride",
        language: "default",
        type: "hero",
        collection: "default",
        sitemap_locations: [],
        last_modified: "2023-08-02T01:59:49.077157Z",
        workflow_step: "published",
      },
      elements: {
        title: {
          type: "text",
          name: "Title",
          value: "Let’s Take a Ride",
        },
        description: {
          type: "rich_text",
          name: "Description",
          images: {},
          links: {},
          modular_content: [],
          value:
            "<p>Wherever you want to be, let's take you there. Superfast. We put the Joy in Joyride.</p>",
        },
        image: {
          type: "asset",
          name: "Image",
          value: [
            {
              name: "photo-1597893503977-e51f98d178e1.jpeg",
              description: null,
              type: "image/jpeg",
              size: 300157,
              url: "https://assets-us-01.kc-usercontent.com:443/c62763fd-db52-0065-d217-cfbead2ff385/a15719b5-0181-46e7-9301-f84e92c28d13/photo-1597893503977-e51f98d178e1.jpeg",
              width: 1740,
              height: 1160,
              renditions: {},
            },
          ],
        },
        cta_title: {
          type: "text",
          name: "CTA Title",
          value: "Get a Ride",
        },
        cta_link: {
          type: "text",
          name: "CTA Link",
          value: "/get-a-ride",
        },
        personalization_criteria: {
          type: "custom",
          name: "Personalization Criteria",
          value: null,
        },
      },
    },
  },
];

export default function Home() {
  return (
    <UniformContext
      context={clientContext}
      outputType={
        process.env.NODE_ENV === "development"
          ? "standard"
          : process.env.UNIFORM_OUTPUT_MODE
      }
      includeTransferState="always"
    >
      <Test name="homepageCards" variations={variants} component={Hero} />
    </UniformContext>
  );
}
