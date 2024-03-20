

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

import Link from "next/link";

type ProjectMapLink = {
    path: string;
    dynamicInputValues?: Record<string, string>;
};

export type CanvasPageLinkProps = ComponentProps<{
    link?: ProjectMapLink;
}>;


const CanvasPageLink = (componentProps: CanvasPageLinkProps) => {
    const { link } = componentProps;

    const href = link?.path || '#';

    return (
        <div style={{margin: '20px auto'}}>
            <Link href={href} target="_blank">
                {href}
            </Link>
        </div>
    )
};

export default CanvasPageLink;

registerUniformComponent({
    type: 'pageLink',
    component: CanvasPageLink,
});