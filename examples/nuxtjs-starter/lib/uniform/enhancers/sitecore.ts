import { createItemEnhancer } from "@uniformdev/canvas-sitecore";

export const sitecoreItemEnhancer = (
  pageId: string = "00000000-0000-0000-0000-000000000000"
) => {
  const config = useRuntimeConfig();
  const { sitecoreApiUrl, sitecoreSiteName, sitecoreApiKey } = config;

  if (!sitecoreApiKey || !sitecoreSiteName || !sitecoreApiKey) {
    throw "Sitecore connection details are not configured";
  }
  return createItemEnhancer({
    pageId,
    config: {
      SITECORE_API_URL: sitecoreApiUrl,
      SITECORE_SITENAME: sitecoreSiteName,
      env: {
        SITECORE_API_KEY: sitecoreApiKey,
      },
    },
    logger: consoleLogger,
    isPreview: false,
    modelOnly: false, // enable modelOnly after configuring model builders in Sitecore for all components and parameters
  });
};

// This converter drops off all Item* properties from SSC output, removes spaces, and lowercasing the first letter of property name
export const sitecoreModelConverter = ({ parameter }: any) => {
  const value = parameter.value;
  if (!value) {
    return value;
  }
  let model: any = {};
  Object.keys(value).map((key) => {
    if (!key.startsWith("Item") && !excludeFields.includes(key)) {
      const newPropertyKey = lowercaseFirstLetter(key.replaceAll(" ", ""));
      model[newPropertyKey] = value[key];
    }
  });
  return model;
};

function lowercaseFirstLetter(string: string) {
  if (!string) {
    return string;
  }
  return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}

const excludeFields = [
  "ParentID",
  "TemplateID",
  "TemplateName",
  "CloneSource",
  "DisplayName",
  "HasChildren",
];

const consoleLogger = {
  // eslint-disable-next-line
  trace: (...message: any[]) => console.log(message.join("\r")),
  // eslint-disable-next-line
  debug: (...message: any[]) => console.log(message.join("\r")),
  // eslint-disable-next-line
  info: (...message: any[]) => console.log(message.join("\r")),
  // eslint-disable-next-line
  warn: (...message: any[]) => console.log(message.join("\r")),
  // eslint-disable-next-line
  error: (...message: any[]) => console.log(message.join("\r")),
};
