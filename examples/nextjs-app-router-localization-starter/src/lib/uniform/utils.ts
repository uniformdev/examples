import { LocaleClient, LocalesGetResponse } from "@uniformdev/canvas";
import { ProjectMapClient } from "@uniformdev/project-map";

export async function getLocales(): Promise<string[]> {
    const client = new LocaleClient({
        apiKey: process.env.UNIFORM_API_KEY,
        projectId: process.env.UNIFORM_PROJECT_ID,
    });

    const localeResponse: LocalesGetResponse = await client.get();

    const { results: localeDefinitions } = localeResponse;
    return localeDefinitions.map((locale) => locale.locale);
}

export async function getStaticParams() {
    const client = getProjectMapClient();
    const { nodes } = await client.getNodes({});
    const resolvedPaths: { path: string[], locale: string }[] = [];
    const locales = await getLocales();
    if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const path = node.path.replace("/:locale", "/");
            if (path !== "/") {
                const nodeLocales = node.locales;
                locales.forEach((locale: string) => {
                    // if there are any locales defined for the node
                    if (nodeLocales && Object.keys(nodeLocales).indexOf(locale) !== -1) {
                        const nodePath = nodeLocales[locale].pathSegment.split('/').filter(Boolean);
                        resolvedPaths.push({ path: nodePath, locale: locale });
                    } else {
                        resolvedPaths.push({ path: path.split('/').filter(Boolean), locale: locale });
                    }
                }
                );
            }
        }
    };

    return resolvedPaths;
}


export const getProjectMapClient = () => {
    const manifestClient = new ProjectMapClient({
        apiHost: process.env.UNIFORM_API_HOST || process.env.UNIFORM_CLI_BASE_URL,
        apiKey: process.env.UNIFORM_API_KEY,
        projectId: process.env.UNIFORM_PROJECT_ID,
        bypassCache: true,
    });

    return manifestClient;
};
