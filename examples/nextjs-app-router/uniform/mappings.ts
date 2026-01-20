import { ResolveComponentResult } from "@uniformdev/canvas-next-rsc/component";
import { PageComponent } from "../components/page";
import { HeroComponent } from "@/components/hero";
import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";

export type ResolveComponentResultWithType = ResolveComponentResult & {
    type: string;
}

// components will be registered here
export const pageMapping: ResolveComponentResultWithType = {
    type: "page",
    component: PageComponent,
};


export const heroMapping: ResolveComponentResultWithType = {
    type: "hero",
    component: HeroComponent,
};

export const headerMapping: ResolveComponentResultWithType = {
    type: "header",
    component: HeaderComponent,
};

export const footerMapping: ResolveComponentResultWithType = {
    type: "footer",
    component: FooterComponent,
};

