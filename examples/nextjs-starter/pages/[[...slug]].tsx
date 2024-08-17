import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { getCompositionsForNavigation } from "@/lib/uniform/canvasClient";
import { enhance, EnhancerBuilder } from "@uniformdev/canvas";

const parameterEnhancer = async ({ component, parameter, parameterName }) => {
  console.log(
    `Enhancing ${component.type}::${parameterName} (${parameter.type}): ${parameter.value}`
  );
  const url = `https://pokeapi.co/api/v2/pokemon/${parameter.value}`;
  console.log({ url });
  const apiResult = await fetch(url);
  if (!apiResult.ok) {
    return null;
  }
  return await apiResult.json();
};

// IMPORTANT: this starter is using SSR mode by default for simplicity. SSG mode can be enabled, please check Uniform docs here: https://docs.uniform.app/docs/guides/composition/routing#project-map-with-uniform-get-server-side-props-and-with-uniform-get-static-props

export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  handleComposition: async (
    { compositionApiResponse },
    { preview },
    _defaultHandler
  ) => {
    const { composition } = compositionApiResponse || {};

    await enhance({
      composition: composition,
      enhancers: new EnhancerBuilder().parameterName(
        "articleId",
        parameterEnhancer
      ),
    });

    console.log(JSON.stringify(composition));

    const navLinks = await getCompositionsForNavigation(preview);
    return {
      props: {
        data: composition,
        navLinks,
      },
    };
  },
});

export default PageComposition;
