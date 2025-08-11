import { HeroTest } from "@/components/HeroTest";
import { PersonalizedHero } from "@/components/PersonalizedHero";

// This is a mock function to fetch the hero data from the Uniform API
const fetchContentWithTest = async (): Promise<any> => {
  return Promise.resolve([
    {
      id: "variant-a",
      title: "Variant A",
      distribution: 30,
    },
    {
      id: "variant-b",
      title: "Variant B",
      distribution: 70,
    }
  ]);
};

// This is a mock function to fetch the hero data from the Uniform API
const fetchPersonalizedContent = async (): Promise<any> => {
  return Promise.resolve([
    {
      id: "developers-variant",
      title: "Personalized for Developers!",
      pz: {
        crit: [
          {
            l: "developers",
            op: ">=",
            r: 50,
          },
        ],
      },
    },
    {
      id: "registrationComplete-variant",
      title: "Registration Complete!",
      pz: {
        crit: [
          {
            l: "registrationComplete",
            op: ">=",
            r: 50,
          },
        ],
      },
    },
    {
      id: "variant-default",
      title: "Default Content for everyone!",
      pz: undefined,
    },
  ]);
};

export default async function Home() {
  const content = await fetchContentWithTest();
  const personalizedContent = await fetchPersonalizedContent();
  return (
    <div>
      <HeroTest content={content} />
      <hr />
      <PersonalizedHero content={personalizedContent} />
    </div>
  );
}
