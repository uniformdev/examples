import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";

type TestComponentProps = ComponentProps<{
  slidey: string;
}>;

const TestComponent: React.FC<TestComponentProps> = ({ slidey }) => (
  <div
    style={{
      paddingTop: 200,
      paddingBottom: 200,
      fontSize: 40,
      textAlign: "center",
    }}
  >
    <UniformText className="title" parameterId="title" as="h1" />
    slider:<pre>{slidey}</pre>
  </div>
);

registerUniformComponent({
  type: "testComponent",
  component: TestComponent,
});

export default TestComponent;
