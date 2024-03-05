
import getConfig from "next/config";

import { KlevuInit } from "@klevu/ui-react";

import { ComponentProps, UniformSlot, registerUniformComponent } from "@uniformdev/canvas-react";

import ErrorPropertyCallout from "../components/ErrorPropertyCallout";
import { getFallbackTranslation } from "@/translations";
import { UniformKlevuTranslationProvider } from "@/components/UniformKlevuTranslationProvider";

const {
    publicRuntimeConfig: { klevuSearchUrlHost, klevuSearchApiKey },
} = getConfig();

export type CanvasKlevuInitProps = ComponentProps<{
    fallbackTranslationLanguage?: string;
}>;

const CanvasKlevuInit = (componentProps: CanvasKlevuInitProps) => {
    const { fallbackTranslationLanguage } = componentProps;

    if (!klevuSearchUrlHost || !klevuSearchApiKey) {
        return <ErrorPropertyCallout title="Klevu Init" text="Missing Klevu connection details. Please check your environment variables." />;
    }

    const fallbackTranslation = getFallbackTranslation(fallbackTranslationLanguage);

    return (
        <KlevuInit
            url={`https://${klevuSearchUrlHost}/cs/v2/search`}
            apiKey={klevuSearchApiKey}
            kmcLoadDefaults={true}
            translation={fallbackTranslation}
            assetsPath="/klevu"
        >
            <UniformKlevuTranslationProvider fallbackTranslation={fallbackTranslation}>
                <UniformSlot name="content" />
            </UniformKlevuTranslationProvider>
        </KlevuInit>
    );
};

export default CanvasKlevuInit;

registerUniformComponent({
    type: 'klevu-init',
    component: CanvasKlevuInit,
});