// TODO: npm install contentful, @uniformdev/canvas-contentful, @contentful/rich-text-html-renderer and uncomment

// import contentful from "contentful";
// import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

// import {
//   createContentfulEnhancer,
//   createContentfulQueryEnhancer,
//   ContentfulClientList,
// } from "@uniformdev/canvas-contentful";

// export {
//   CANVAS_CONTENTFUL_PARAMETER_TYPES,
//   CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
// } from "@uniformdev/canvas-contentful";

// export const contentfulEnhancer = () => {
//   return createContentfulEnhancer({
//     client: getContentfulClient(),
//     createQuery: ({ defaultQuery }) => {
//       return {
//         ...defaultQuery,
//         select: "fields,metadata.tags",
//       };
//     },
//   });
// };

// export const contentfulQueryEnhancer = () => {
//   const clientList = new ContentfulClientList({
//     client: getContentfulClient(),
//   });

//   return createContentfulQueryEnhancer({
//     clients: clientList,
//     createQuery: ({ defaultQuery }) => {
//       return {
//         ...defaultQuery,
//         select: "fields,metadata.tags",
//       };
//     },
//   });
// };


// export function getContentfulClient() {
//   const {
//     public: {
//       contentfulSpaceId,
//       contentfulDeliveryApiKey,
//       contentfulEnvironment,
//     },
//   } = useRuntimeConfig();

//   return contentful.createClient({
//     space: contentfulSpaceId,
//     environment: contentfulEnvironment,
//     accessToken: contentfulDeliveryApiKey,
//     adapter: async (config) => {
//       const url = new URL(`${config.baseURL}/${config.url}`);
//       if (config.params) {
//         for (const key of Object.keys(config.params)) {
//           url.searchParams.append(key, config.params[key]);
//         }
//       }

//       const request = new Request(url.href, {
//         method: config.method ? config.method.toUpperCase() : "GET",
//         body: config.data,
//         redirect: "manual",
//         headers: config.headers ? config.headers : {},
//       });

//       const response = await fetch(request);

//       return {
//         data: await response.json(),
//         status: response.status,
//         statusText: response.statusText,
//         headers: response.headers,
//         config: config,
//         request: request,
//       };
//     },
//   });
// }

// export function enhanceContentfulItem(item) {
//   const entry = contentfulModelConverter({
//     parameter: { value: item },
//   });

//   return entry;
// }

// export const contentfulModelConverter = ({ parameter }) => {
//   const entries = parameter.value;
//   let result = null;

//   if (entries.fields) {
//     result = transformContentfulFields(entries);
//   } else {
//     result = [];
//     entries.forEach((entry) => {
//       result.push(transformContentfulFields(entry));
//     });
//   }

//   parameter.value = result;

//   return parameter.value;
// };

// function transformContentfulFields(entry) {
//   if (entry) {
//     const content = { ...entry.fields };

//     Object.keys(content).map((fieldKey) => {
//       if (
//         Array.isArray(content[fieldKey]) &&
//         content[fieldKey].length > 0 &&
//         content[fieldKey][0]?.sys?.type === "Asset"
//       ) {
//         const transformedImages = content[fieldKey].map((asset) =>
//           transformContentfulImage(asset)
//         );
//         content[fieldKey] = transformedImages;
//       } else if (Array.isArray(content[fieldKey])) {
//         const flattenedFields = content[fieldKey].map((entry) => {
//           return { ...entry.fields };
//         });
//         content[fieldKey] = flattenedFields;
//       } else if (content[fieldKey]?.sys?.type === "Asset") {
//         content[fieldKey] = transformContentfulImage(content[fieldKey]);
//       } else if (content[fieldKey]?.nodeType === "document") {
//         const html = documentToHtmlString(content[fieldKey]);
//         content[fieldKey] = html.replace(/\n/g, "<br />");
//       }
//     });

//     const metadata = [...entry.metadata.tags];

//     content.tags = metadata.map((tag) => {
//       return tag.sys.id;
//     });

//     return content;
//   }
// }

// function transformContentfulImage(imageField) {
//   let imageUrl = imageField?.fields?.file?.url;
//   if (imageUrl.startsWith("//")) {
//     imageUrl = imageUrl.replace("//", "https://");
//   }
//   return {
//     src: imageUrl,
//     alt: imageField?.fields?.title,
//     width: imageField?.fields?.file?.details?.image?.width,
//     height: imageField?.fields?.file?.details?.image?.height,
//   };
// }
