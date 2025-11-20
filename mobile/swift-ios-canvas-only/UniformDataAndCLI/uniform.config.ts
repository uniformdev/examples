import { uniformConfig } from "@uniformdev/cli/config";

export default uniformConfig({
    preset: 'none',
    config: {
        serialization: {
            directory: './uniform-data',
            entitiesConfig: {
                component: {},
                componentPattern: {},
                composition: {},
                compositionPattern: {},
                projectMapNode: {},
                projectMapDefinition: {},
                previewViewport: {},
            },
        },
    },
});
