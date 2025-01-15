import { HeroVariant } from "@/components/Hero";
import { PersonalizedHero } from "@/components/PersonalizedHero";

const fetchHeroData = async (): Promise<HeroVariant[]> => {
  const variations: HeroVariant[] = [
    {
      id: "variant-1",
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
      id: "variant-default",
      title: "Default Title",
      pz: undefined,
    },
  ];

  return Promise.resolve(variations);
};

export default async function Home() {
  const heroData = await fetchHeroData();
  return (
    <div>
      <PersonalizedHero variations={heroData} />
    </div>
  );
}
