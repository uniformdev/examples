/* eslint-disable no-console */
import { Button, Heading, useMeshLocation } from '@uniformdev/mesh-sdk-react';

/*
  Data Type and Data Resource editors may make requests for data from the same API as their
  parent Data Source. This lets them load data that is not part of a data resource to support
  their user interfaces.

  For example, an integration that pulls from a content management system might wish to let
  an author choose from a list of content items instead of having them copy and paste in
  a content item ID. The call to list available content items to choose from is a call to
  the same data source (API), but it has its own unique relative URL (resource) and parameters.

  This is accomplished by allowing the integration author to compose a temporary data type,
  which is fetched for you by Uniform and returned.
*/
export function HowToFetchData() {
  // note: both dataResource and dataType locations can do this
  const { getDataResource } = useMeshLocation<'dataType'>();

  return (
    <div>
      <Heading level={4}>Data Fetching Example</Heading>
      <p>
        Note: this example works if your data source URL is <code>https://pokeapi.co/api/v2</code>. Otherwise,
        it demonstrates error handling!
      </p>
      <Button
        onClick={() => {
          // fetch a data resource from an arbitrary data type definition
          // NOTE: you cannot escape the data source's base URL here (i.e. no ../)
          getDataResource({
            method: 'GET',
            path: '/pokemon/pikachu',
          })
            .then((r) => console.log('fetching data resource succeeded', r))
            .catch((e) => console.error('error fetching data resource', e));
        }}
      >
        Fetch /pokemon/pikachu from the data source API and log it to the browser console
      </Button>
    </div>
  );
}
