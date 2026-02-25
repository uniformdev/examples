import { ComponentProps, UniformText } from "@uniformdev/canvas-react";
import type { LinkParamValue } from "@uniformdev/canvas";
import UiCtaButton from "../ui/CtaButton";
import { resolveLinkUrl } from "../../utils/uniform/projectMap.ts"

type CtaButtonProps = ComponentProps<{
  label?: string;
  link?: LinkParamValue;
  variant?: string;
}>;

const CtaButton: React.FC<CtaButtonProps> = ({
  link,
  variant,
}) => {
  return (
    <UiCtaButton
      label={
        <UniformText parameterId="label" placeholder="Button label"/>
      }
      link={resolveLinkUrl(link)}
      variant={variant}
    />
  )
};

export default CtaButton;
