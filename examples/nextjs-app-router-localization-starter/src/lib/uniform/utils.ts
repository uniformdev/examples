import { ProjectMapClient } from "@uniformdev/project-map";

export async function getStaticParams(defaultLocale: string = "en") {
    const client = getProjectMapClient();
    const { nodes } = await client.getNodes({});
    const resolvedPaths: { path: string[], locale: string }[] = [];

    if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const path = node.path.replace("/:locale", "/");
            if (path !== "/") {
                resolvedPaths.push({ path: path.split('/').filter(Boolean), locale: defaultLocale });

                // adding localized paths
                const locales = node.locales;
                if (locales) {
                    Object.keys(locales).forEach((locale) => {
                        resolvedPaths.push({ path: locales[locale].pathSegment.split('/').filter(Boolean), locale: locale });
                    })
                }
            }
        }
    }

    return resolvedPaths;
};

export const getProjectMapClient = () => {
    const manifestClient = new ProjectMapClient({
        apiHost: process.env.UNIFORM_API_HOST || process.env.UNIFORM_CLI_BASE_URL,
        apiKey: process.env.UNIFORM_API_KEY,
        projectId: process.env.UNIFORM_PROJECT_ID,
        bypassCache: true,
    });

    return manifestClient;
};
