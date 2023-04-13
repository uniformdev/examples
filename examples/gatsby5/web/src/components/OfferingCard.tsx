import { registerUniformComponent } from "@uniformdev/canvas-react";
import * as React from "react";

export const OfferingCard = ({
  offering: { offeringName, offeringImage, offeringSummary },
}: {
  offering: any;
}) => {
  return (
    <div className="text-center rounded-md border-2 p-3 h-full flex flex-col justify-between">
      <p className="text-lg font-semibold">{offeringName}</p>

      <div className="min-h-150">
        <img
          src={offeringImage}
          width="100px"
          className="mx-auto"
          height={300}
        />
      </div>
      <p className="text-sm">{offeringSummary}</p>
    </div>
  );
};

registerUniformComponent({
  type: "offeringCard",
  component: OfferingCard,
});
