import { ProjectMapClient } from "@uniformdev/project-map";

export async function getStaticParams() {
    const client = getProjectMapClient();
    const { nodes } = await client.getNodes({});
    console.log({ nodes });
    const resolvedPaths: string[] = [];

    if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            resolvedPaths.push(node.path.replace("/:locale", "/"));
        }
    }

    const paths: any = [];

    resolvedPaths?.forEach((path) => {
        paths.push({
            path: path.split('/').filter(Boolean),
            locale: "en"
        });
        paths.push({
            path: path.split('/').filter(Boolean),
            locale: "de"
        });
    });

    return paths;
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
