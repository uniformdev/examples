import { Slot } from "@uniformdev/canvas-react";
import * as React from "react";

export const GenericGrid = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
  return (
    <div className="border-t-2 py-[4em]">
      <h3 className="text-3xl text-center mb-10 font-medium">{title}</h3>
      <div className="grid grid-cols-3 gap-5">
        <Slot name="items" />
      </div>
    </div>
  );
};
