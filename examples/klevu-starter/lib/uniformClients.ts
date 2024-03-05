import { ProjectMapClient } from "@uniformdev/project-map";
import getConfig from "next/config";

const {
    serverRuntimeConfig: { projectId, apiKey,  apiHost, edgeApiHost},
} = getConfig();

export const getProjectMapClient = () => {
  if (!apiHost) {
    throw new Error(
        "apiHost is not specified. Project Map client cannot be instantiated"
      );
  }


  if (!projectId) {
    throw new Error(
        "projectId is not specified. Project Map client cannot be instantiated"
      );
  }

  if (!apiKey) {
    throw new Error(
        "apiKey is not specified. Project Map client cannot be instantiated"
      );
  }

  return new ProjectMapClient({
    apiKey,
    apiHost,
    projectId,
  });
};
