import { getEnrichmentVectorKey } from "@uniformdev/context";
import { ComponentType, Page } from "../../lib/models";

const indexPage: Page = {
  title: "Home",
  slug: "/",
  components: [
    {
      type: ComponentType.PersonalizedHero,
      variations: [
        {
          title: "Thank you for joining!",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "See sessions",
          description:
            "Now check out the conference sessions and add them to your agenda",
          image:
            "//images.ctfassets.net/qefyoudbvm9s/26T6EMvuCgohcpN4uacXTc/83576ffec18a5aba6903a1df98b1ccee/success.svg",
          id: "registered",
          pz: {
            crit: [
              {
                l: "registrationComplete",
                op: ">",
                r: 0,
              },
            ],
          },
        },
        {
          title: "Developer Hero",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "Whoa, I am a developer!",
          description:
            "Hey, we think you may be a developer. This might be of interest to you!",
          image:
            "//images.ctfassets.net/qefyoudbvm9s/5y9i3cZVJslNZOY7Is0UEh/c0c53b561e81092f279fb6cccb2cd415/developer.svg",
          id: "dev",
          pz: {
            crit: [
              {
                l: getEnrichmentVectorKey("interest", "dev"),
                op: "+",
              },
            ],
          },
        },
        {
          title: "Marketer Hero",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "Whoa, I am a marketer!",
          description:
            "Hey, we think you may be a marketer. This might be of interest to you!",
          image:
            "//images.ctfassets.net/qefyoudbvm9s/2HquYLn9LDf6yqxmQ2525o/8fea360afc9f55883e3866a853c26503/marketer.svg",
          id: "mktg",
          pz: {
            crit: [
              {
                l: getEnrichmentVectorKey("interest", "mktg"),
                op: "+",
              },
            ],
          },
        },
        {
          title: "Call for papers open now!",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "Submit your talk",
          description: "We can't wait to receive your talk submission!",
          image:
            "//images.ctfassets.net/qefyoudbvm9s/61CDPV29br6sNo9wwH2VRg/49bbfdbb5e192bdcae7dec41b9342078/registered.svg",
          id: "utmCampaign",
          pz: {
            crit: [
              {
                l: "callForPapers",
                op: ">",
                r: 0,
              },
            ],
          },
        },
        {
          title: "Welcome to UniformConf",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "Button Text",
          description:
            "Whether you are a developer or a marketer, we got great content for you.",
          image:
            "//images.ctfassets.net/qefyoudbvm9s/1SvhzHGTcZUWO0J92wzBWq/868898caff791fa28b83f3108ff26b91/default.svg",
          id: "default",
        },
      ],
    },
  ],
};

const developersPage: Page = {
  title: "Developers!",
  components: [
    {
      type: ComponentType.Hero,
      title: "Developer Content",
      buttonLinkSlug: "https://uniform.dev/",
      buttonText: "Developers, developers, developers, developers",
      description: "This page is for developers!",
      image: null,
      enrichments: {
        cat: "interest",
        key: "dev",
        str: 50,
      },
    },
  ],
};

const marketersPage: Page = {
  title: "Marketers!",
  components: [
    {
      type: ComponentType.Hero,
      title: "Marketer Content",
      buttonLinkSlug: "https://uniform.dev/",
      buttonText: "Find your audience",
      description: "This content is for marketers!",
      image: null,
      enrichments: {
        cat: "interest",
        key: "mktg",
        str: 50,
      },
    },
  ],
};

const registrationPage: Page = {
  title: "Registration",
  components: [
    {
      type: ComponentType.RegistrationForm,
      buttonText: "Complete Registration",
      heading: "Register Now!",
      registeredText:
        "Thanks for registering for UniformConf! We'll see you there!",
    },
  ],
};

const _pages: Record<string, Page> = {
  "/": indexPage,
  "/developers": developersPage,
  "/marketers": marketersPage,
  "/registration": registrationPage,
};

export const getPage = async (path: string): Promise<Page> => {
  const pageComponents = _pages[path];
  return pageComponents || [];
};
