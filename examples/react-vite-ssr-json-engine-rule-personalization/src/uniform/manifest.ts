import { ManifestV2 } from "@uniformdev/context";

export const manifest: ManifestV2 = {
  project: {
    pz: {
      sig: {
        launchCampaign: {
          str: 50,
          cap: 100,
          dur: "p",
          crit: {
            op: "&",
            type: "G",
            clauses: [
              {
                type: "QS",
                match: {
                  cs: false,
                  op: "=",
                  rhs: "launch",
                },
                queryName: "utm_campaign",
              },
            ],
          },
        },
      },
    },
    test: {},
  },
};
