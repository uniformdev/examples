import type { InferHydratedState, InferStaticState, SearchCompletedAction } from "@coveo/headless/ssr";
import {
  type Controller,
  type ControllerDefinitionsMap,
  defineContext,
  defineFacet,
  definePager,
  defineQuerySummary,
  defineResultList,
  defineSearchBox,
  defineSearchParameterManager,
  defineSort,
  getSampleSearchEngineConfiguration,
  loadPipelineActions,
  type SearchEngine,
  type SearchEngineDefinitionOptions,
} from "@coveo/headless/ssr";
import { defineSearchEngine } from "@coveo/headless-react/ssr";

function getEngineConfiguration() {
  const organizationId = process.env.COVEO_ORGANIZATION_ID;
  const accessToken = process.env.COVEO_ACCESS_TOKEN;
  const searchHub = process.env.COVEO_SEARCH_HUB;

  if (organizationId && accessToken) {
    return {
      organizationId,
      accessToken,
      ...(searchHub && { search: { searchHub } }),
      analytics: {
        analyticsMode: "next" as const,
        trackingId: "coveo-ssr-example",
      },
    };
  }
  return {
    ...getSampleSearchEngineConfiguration(),
    analytics: {
      analyticsMode: "next" as const,
      trackingId: "coveo-ssr-example",
    },
  };
}

const config = {
  configuration: getEngineConfiguration(),
  controllers: {
    context: defineContext(),
    searchBox: defineSearchBox(),
    resultList: defineResultList(),
    sort: defineSort(),
    pager: definePager(),
    querySummary: defineQuerySummary(),
    authorFacet: defineFacet({
      options: {
        facetId: "author-1",
        field: "author",
      },
    }),
    searchParameterManager: defineSearchParameterManager(),
  },
} satisfies SearchEngineDefinitionOptions<
  ControllerDefinitionsMap<SearchEngine, Controller>
>;

export const engineDefinition = defineSearchEngine(config);

export type SearchStaticState = InferStaticState<typeof engineDefinition>;
export type SearchHydratedState = InferHydratedState<typeof engineDefinition>;

export const {
  useResultList,
  useSearchBox,
  useAuthorFacet,
  useSearchParameterManager,
  useQuerySummary,
  useSort,
  usePager,
} = engineDefinition.controllers;

async function getBuildResult(pipeline?: string) {
  const buildResult = await engineDefinition.build({
    controllers: {
      context: { initialState: { values: {} } },
      searchParameterManager: {
        initialState: {
          parameters: {},
        },
      },
    },
  });

  if (pipeline && typeof pipeline === 'string') {
    const pipelineActions = loadPipelineActions(buildResult.engine);
    buildResult.engine.dispatch(pipelineActions.setPipeline(pipeline));
  }

  return buildResult;
}

export async function fetchStaticState(pipeline?: string) {
  return engineDefinition.fetchStaticState.fromBuildResult({
    buildResult: await getBuildResult(pipeline),
  });
}

export async function hydrateStaticState(options: { searchAction: SearchCompletedAction; pipeline?: string }) {
  return engineDefinition.hydrateStaticState.fromBuildResult({
    buildResult: await getBuildResult(options.pipeline),
    searchAction: options.searchAction,
  });
}
