import { CanvasClient } from '@uniformdev/canvas';
import { ProjectMapClient } from '@uniformdev/project-map';

export const canvasClient = new CanvasClient({
  apiHost: process.env.UNIFORM_API_HOST ?? process.env.UNIFORM_CLI_BASE_URL,
  edgeApiHost: process.env.UNIFORM_EDGE_API_HOST ?? process.env.UNIFORM_CLI_BASE_EDGE_URL,
  apiKey: process.env.UNIFORM_API_KEY,
  projectId: process.env.UNIFORM_PROJECT_ID,
  disableSWR: true,
});

export const projectMapClient = new ProjectMapClient({
  apiHost: process.env.UNIFORM_API_HOST ?? process.env.UNIFORM_CLI_BASE_URL,
  apiKey: process.env.UNIFORM_API_KEY,
  projectId: process.env.UNIFORM_PROJECT_ID,
});
