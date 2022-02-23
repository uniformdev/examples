import { getEnrichmentVectorKey, ManifestInstance } from "@uniformdev/context"
import { ComponentType, Page, TalkData } from "../../lib/models"

const talkList: TalkData[] = [
  {
    id: '1',
    title: 'What\'s next in Next.js?',
    description: 'Find out what\'s new in the latest Next.js release.',
    tags: ['Developers'],
    pz: {
      crit: [{
        l: getEnrichmentVectorKey('interest', 'developer'),
        op: '+'
      }]
    }
  },
  {
    id: '2',
    title: 'Jamstack 101',
    description: 'Learn what Jamstack is in this introductory course for both developers and marketers.',
    tags: ['Developers', 'Marketers'],
    pz: {
      crit: [{
        l: getEnrichmentVectorKey('interest', 'developer'),
        op: '+'
      }, {
        l: getEnrichmentVectorKey('interest', 'marketer'),
        op: '+'
      }]
    }
  },
  {
    id: '3',
    title: 'Personalization the Jamstack way',
    description: 'Marketers can learn about the basics of personalization and how to do it the Jamstack way.',
    tags: ['Marketers'],
    pz: {
      crit: [{
        l: getEnrichmentVectorKey('interest', 'marketer'),
        op: '+'
      }]
    }
  },
  {
    id: '4',
    title: 'Jamstack for Enterprise Architects',
    description: 'Jamstack brings huge benefits to Enterprise use ca…arn about how to adopt Jamstack for your company.',
    tags: ['Developers'],
    pz: {
      crit: [{
        l: getEnrichmentVectorKey('interest', 'developer'),
        op: '+'
      }]
    }
  },
  {
    id: '5',
    title: 'What marketers need to know about 3rd party scripts',
    description: 'The effect of 3rd party scripts on performance can…mount of JavaScript you need to render your site.',
    tags: ['Marketers'],
    pz: {
      crit: [{
        l: getEnrichmentVectorKey('interest', 'marketer'),
        op: '+'
      }]
    }
  }
]

const indexPage: Page = {
  title: 'Home',
  slug: '/',
  components: [
    {
      type: ComponentType.PersonalizedHero,
      variations: [
        {
          title: 'Thank you for joining!',
          buttonLinkSlug: 'https://uniform.dev',
          buttonText: 'See sessions',
          description: 'Now check out the conference sessions and add them to your agenda',
          image: '//images.ctfassets.net/qefyoudbvm9s/26T6EMvuCgohcpN4uacXTc/83576ffec18a5aba6903a1df98b1ccee/success.svg',
          id: 'registered',
          pz: {
            crit: [{
              l: 'unfrmconfRegistered',
              op: ">",
              r: 0
            }]
          }
        },
        {
          title: 'Developer Hero',
          buttonLinkSlug: 'https://uniform.dev',
          buttonText: 'Whoa, I am a developer!',
          description: 'Hey, we think you may be a developer. This might be of interest to you!',
          image: '//images.ctfassets.net/qefyoudbvm9s/5y9i3cZVJslNZOY7Is0UEh/c0c53b561e81092f279fb6cccb2cd415/developer.svg',
          id: 'developer',
          pz: {
            crit: [{
              l: getEnrichmentVectorKey('interest', 'developer'),
              op: "+"
            }]
          }
        },
        {
          title: 'Marketer Hero',
          buttonLinkSlug: 'https://uniform.dev',
          buttonText: 'Whoa, I am a marketer!',
          description: 'Hey, we think you may be a marketer. This might be of interest to you!',
          image: '//images.ctfassets.net/qefyoudbvm9s/2HquYLn9LDf6yqxmQ2525o/8fea360afc9f55883e3866a853c26503/marketer.svg',
          id: 'marketer',
          pz: {
            crit: [{
              l: getEnrichmentVectorKey('interest', 'marketer'),
              op: "+"
            }]
          }
        },
        {
          title: 'Call for papers open now!',
          buttonLinkSlug: 'https://uniform.dev',
          buttonText: 'Submit your talk',
          description: 'We can\'t wait to receive your talk submission!',
          image: '//images.ctfassets.net/qefyoudbvm9s/61CDPV29br6sNo9wwH2VRg/49bbfdbb5e192bdcae7dec41b9342078/registered.svg',
          id: 'utmCampaign',
          pz: {
            crit: [{
              l: 'utmCampaign',
              op: "+"
            }]
          }
        },
        {
          title: 'Welcome to UniformConf',
          buttonLinkSlug: 'https://uniform.dev',
          buttonText: 'Button Text',
          description: 'Whether you are a developer or a marketer, we got great content for you.',
          image: '//images.ctfassets.net/qefyoudbvm9s/1SvhzHGTcZUWO0J92wzBWq/868898caff791fa28b83f3108ff26b91/default.svg',
          id: 'default'
        }
      ]
    },
    {
      type: ComponentType.TalkList,
      p13nTitle: 'Personalized talks for you',
      count: 3,
      title: 'Our conference talks',
      talks: talkList
    },
    {
      type: ComponentType.WhyAttend,
      description: 'This conference has something to offer developers and marketers alike. From basics to advanced, learn more about: 1. Enterprise JAMstack Personalization 2. Uniform Personalization with Contentful 3. Uniform DXP Expand your knowledge on these subjects and engage with professionals from all over the world.',
      image: '/pexels-luis-quintero-2774556.jpg',
      title: 'Why You Should Attend'
    },
    {
      type: ComponentType.CallToAction,
      buttonLink: 'https://uniform.dev',
      buttonText: 'Learn more',
      heading: 'Like what you see?',
      subheading: 'Get a demo of Uniform Optimize for Contentful and signup for early access.'
    }
  ]
}

const developersPage: Page = {
  title: 'Developers!',
  components: [{
    type: ComponentType.Hero,
    title: 'Developer Content',
    buttonLinkSlug: 'https://uniform.dev/',
    buttonText: 'Developers, developers, developers, developers',
    description: 'This page is for developers!',
    image: null,
    beh: {
      cat: 'interest',
      key: 'developer',
      str: 50
    }
  }]
}

const marketersPage: Page = {
  title: 'Marketers!',
  components: [{
    type: ComponentType.Hero,
    title: 'Marketer Content',
    buttonLinkSlug: 'https://uniform.dev/',
    buttonText: 'Find your audience',
    description: 'This content is for marketers!',
    image: null,
    beh: {
      cat: 'interest',
      key: 'marketer',
      str: 50
    }
  }]
}

const registrationPage: Page = {
  title: 'Registration',
  components: [{
    type: ComponentType.RegistrationForm,
    buttonText: 'Complete Registration',
    heading: 'Register Now!',
    registeredText: 'Thanks for registering for UniformConf! We\'ll see you there!'
  }]
}

const _pages: Record<string, Page> = {
  '/': indexPage,
  '/developers': developersPage,
  '/marketers': marketersPage,
  '/registration': registrationPage
}

export const getPage = async (path: string): Promise<Page> => {
  const pageComponents = _pages[path];
  return pageComponents || [];
}