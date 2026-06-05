import { ComponentType, Page } from "../../lib/models";

const indexPage: Page = {
  title: "Home",
  slug: "/",
  components: [
    {
      type: ComponentType.ABTestHero,
      variants: [
        {
          title: "control",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "See sessions",
          description:
            "content from the control",
          image:
            "https://images.ctfassets.net/qefyoudbvm9s/26T6EMvuCgohcpN4uacXTc/83576ffec18a5aba6903a1df98b1ccee/success.svg",
          id: "control",
        },
        {
          title: "variant",
          buttonLinkSlug: "https://uniform.dev",
          buttonText: "content from the variant",
          description:
            "Hey, we think you may be a developer. This might be of interest to you!",
          image:
            "https://images.ctfassets.net/qefyoudbvm9s/5y9i3cZVJslNZOY7Is0UEh/c0c53b561e81092f279fb6cccb2cd415/developer.svg",
          id: "variant"
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
        cat: "1",
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
        cat: "1",
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

export const pages: Record<string, Page> = {
  "/": indexPage,
  "/developers": developersPage,
  "/marketers": marketersPage,
  "/registration": registrationPage,
};

export const getPage = async (
  slug: string | string[] | undefined
): Promise<Page> => {
  const path = getPathFromSlug(slug);
  const pageComponents = pages[path];
  return pageComponents || [];
};

const getPathFromSlug = (slug?: string | string[] | null): string => {
  // home page fallback
  if (!slug) {
    return "/";
  }
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;
  return slugString.startsWith("/") ? slugString : `/${slugString}`;
};
