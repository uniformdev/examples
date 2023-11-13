import {
  Button,
  Heading,
  RequestBody,
  RequestHeaders,
  RequestMethodSelect,
  RequestParameters,
  RequestUrl,
  RequestUrlInput,
  useMeshLocation,
  useRequest,
  useRequestHeader,
  useRequestParameter,
} from '@uniformdev/mesh-sdk-react';

/*
  Within the context of Data Types and Data Sources,
  they receive a request object that stores your data connection information.

  This component illustrates patterns you can use to render and reuse parts of the
  Uniform UIs for editing requests. It is 100% optional to use any of these components,
  a UI can be built using the `useRequest()` hook alone, but this can help save time.
*/
export function HowToEditRequests() {
  const location = useMeshLocation();
  const { request } = useRequest();

  return (
    <div>
      <Heading level={4}>Request Editing Examples</Heading>

      {/* Note: only data types have a request method (since data sources are setting up a base URL, not a full HTTP request) */}
      {location.type === 'dataType' ? (
        <RequestMethodSelect label="Request Method" data-testid="method-select" />
      ) : null}

      <p>Request URL</p>
      <RequestUrlInput />

      <p>Edit Query Parameters</p>
      <RequestParameters />

      <p>Edit Headers</p>
      <RequestHeaders />

      {request.method === 'POST' ? (
        <>
          <p>Edit Body (applies to POST method and data types only)</p>
          <RequestBody />
        </>
      ) : null}

      <p>Computed full URL including any base URL and query parameters</p>
      <RequestUrl />

      <p>Edit a single query param</p>
      <QueryStringParamEditor paramName="q" />

      <p>Edit a single header</p>
      <HeaderEditor header="Cache-Control" />

      <p>Programmatic request access</p>
      <ResetUrl />
    </div>
  );
}

/** Example of how to make a text box to edit a specific query string parameter on a request */
function QueryStringParamEditor({ paramName }: { paramName: string }) {
  // note: for multi-valued parameters use `useRequest`
  const { value, update } = useRequestParameter(paramName);

  return (
    <div>
      <label htmlFor="qs">Text box sets query string parameter {paramName}</label>
      <br />
      <input type="text" id="qs" value={value} onChange={(e) => update(e.currentTarget.value)} />
    </div>
  );
}

/** Example of how to make a text box to edit a specific header on a request */
function HeaderEditor({ header }: { header: string }) {
  // note: for multi-valued headers use `useRequest`
  const { value, update } = useRequestHeader(header);

  return (
    <div>
      <label htmlFor="h">Text box sets header {header}</label>
      <br />
      <input type="text" id="h" value={value} onChange={(e) => update(e.currentTarget.value)} />
    </div>
  );
}

/** Example of using useRequest to dispatch events and update values */
function ResetUrl() {
  const { dispatch } = useRequest();

  return (
    <Button
      type="button"
      onClick={() => dispatch({ type: 'setRelativeUrl', relativeUrl: 'https://uniform.app' })}
    >
      Reset URL to https://uniform.app
    </Button>
  );
}
