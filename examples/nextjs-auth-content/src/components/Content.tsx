import { ComponentParameter, ComponentProps, UniformText } from "@uniformdev/next-app-router/component"


export type ContentProps = {
  body: ComponentParameter<string>
}
export const Content = ({
  component,
  parameters: { body },
}: ComponentProps<ContentProps>) => {
  return <>
    <UniformText component={component} parameter={body} as='p' style={{ margin: '1rem 0' }}/>
  </>
}
