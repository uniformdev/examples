import type { UniformCompositionNextPage } from "@uniformdev/canvas-next";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { UniformComposition } from "@uniformdev/canvas-react";

import "@/components/uniformComponents";

export const getServerSideProps = withUniformGetServerSideProps({
  handleComposition: async ({ compositionApiResponse }) => {
    const composition = compositionApiResponse?.composition;
    return {
      props: {
        data: composition ?? null,
      },
    };
  },
});

const Page: UniformCompositionNextPage = ({ data }) => {
  if (!data) {
    return (
      <div className="container main">
        <h1 className="title">Page not found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  }
  return <UniformComposition data={data} />;
};

export default Page;
