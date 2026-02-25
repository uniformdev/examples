import { UniformSlot } from "@uniformdev/canvas-react";
import { SiteHeader } from "../ui/SiteHeader.tsx"
import { SiteFooter } from "../ui/SiteFooter.tsx"

const Page = () => {
  return (
    <div>
      <SiteHeader />
      <div className="p-4">
        <UniformSlot name="content" />
      </div>
      <SiteFooter />
    </div>
  )
};

export default Page;
