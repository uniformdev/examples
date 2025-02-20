import { ComponentProps, UniformRichText } from "@uniformdev/canvas-react";
import { Section, Text } from "@react-email/components";
import { RichTextParamValue } from "@uniformdev/canvas";
type SectionContainerProps = ComponentProps<{
  text: RichTextParamValue;
}>;

const SectionContainer: React.FC<SectionContainerProps> = () => {
  return (
    <Section>
      <Text>
        <UniformRichText parameterId="text" placeholder="Text goes here" />
      </Text>
    </Section>
  );
};

export default SectionContainer;
