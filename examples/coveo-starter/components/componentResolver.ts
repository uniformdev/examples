import { ComponentType } from 'react';
import { ComponentInstance } from '@uniformdev/canvas';
import { DefaultNotImplementedComponent, ComponentProps } from '@uniformdev/canvas-react';
import Sort from "@/components/Sort";
import Facet from "@/components/Facet";
import FacetBreadcrumbs from "@/components/FacetBreadcrumbs";
import SearchBox from "@/components/SearchBox";
import QuerySummary from "@/components/QuerySummary";
import Pager from "@/components/Pager";
import ResultList from "@/components/ResultList";
import ResultsPerPage from "@/components/ResultsPerPage";
import InitialContainer from "@/components/Containers/InitialContainer";
import CoveoContainer from "@/components/Containers/CoveoContainer";
import ResultsContainer from "@/components/Containers/ResultsContainer";
import SummaryContainer from "@/components/Containers/SummaryContainer";
import {capitalizeFirstLetter} from "../utils";


const componentMappings: Record<string, ComponentType<ComponentProps<any>>> = {
  'coveo-sort': Sort,
  'coveo-facet': Facet,
  'coveo-facetBreadcrumbs': FacetBreadcrumbs,
  'coveo-searchBox': SearchBox,
  'coveo-querySummary': QuerySummary,
  'coveo-pager': Pager,
  "coveo-resultList": ResultList,
  "coveo-resultsPerPage": ResultsPerPage,
  "coveo-initial": InitialContainer,
  "coveo-container": CoveoContainer,
  "coveo-results-container": ResultsContainer,
  "coveo-summary-container": SummaryContainer,
};

export function componentResolver(component: ComponentInstance): ComponentType<ComponentProps<any>> | null {
  const { variant } = component;
  const componentName = variant ? `${component.type}${capitalizeFirstLetter(variant)}` : component.type;
  return componentMappings[componentName] || DefaultNotImplementedComponent;
}

export default componentResolver;
