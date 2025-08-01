import { FC } from "react";
import { UniformSlot, UniformText } from "@uniformdev/canvas-react";
import { PageProps } from ".";

const Page: FC<PageProps> = ({ backgroundColor }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <UniformText
        className="title"
        parameterId="pageTitle"
        as="h1"
        data-test-id="page-title"
        placeholder="Page title goes here"
      />
      <p>BackgroundColor: {backgroundColor}</p>
      <UniformSlot name="pageHeader" />

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <UniformSlot name="pageContent" />
      </div>
      <UniformSlot name="pageFooter" />
    </div>
  );
};

export default Page;
