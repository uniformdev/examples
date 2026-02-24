import type { LinkParamValue } from "@uniformdev/canvas";
import projectMapDefinition from '../../../uniform-data/projectMapDefinition/db9671bf-b57a-40d6-a29f-4d6572d404c6.json'

const baseUrl = new URL(projectMapDefinition.baseUrl)
const basePath = baseUrl.pathname

export { projectMapDefinition, baseUrl, basePath }

export function resolveLinkUrl(link: LinkParamValue) {
  if (!link) return undefined
  if ('projectMapId' in link && link.projectMapId === projectMapDefinition.id) {
    const url = new URL(baseUrl)
    url.pathname = `${basePath}${link.path}`
    return `${url.pathname}${url.search}${url.hash}`
  } else {
    return link.path
  }
}
