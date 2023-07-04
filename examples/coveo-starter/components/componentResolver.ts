import { ComponentType } from 'react';
import { ComponentInstance } from '@uniformdev/canvas';
import { DefaultNotImplementedComponent, ComponentProps } from '@uniformdev/canvas-react';
import Sort from "@/components/Sort";
import Facet from "@/components/Facet";
import FacetBreadcrumbs from "@/components/FacetBreadcrumbs";
import SearchBox from "@/components/SearchBox";
import QuerySummary from "@/components/QuerySummary";


const componentMappings: Record<string, ComponentType<ComponentProps<any>>> = {
  'coveo-sort': Sort,
  'coveo-facet': Facet,
  'coveo-facetBreadcrumbs': FacetBreadcrumbs,
  'coveo-searchBox': SearchBox,
  'coveo-querySummary': QuerySummary,
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function componentResolver(component: ComponentInstance): ComponentType<ComponentProps<any>> | null {
  const { variant } = component;
  const componentName = variant ? `${component.type}${capitalizeFirstLetter(variant)}` : component.type;
  return componentMappings[componentName] || DefaultNotImplementedComponent;
}

export default componentResolver;
