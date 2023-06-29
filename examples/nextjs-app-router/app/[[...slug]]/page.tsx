import { UniformComposition, GoogleTagManagerAnalytics, UniformCompositionProps } from '@uniformdev/canvas-next-rsc';

export default function SlugPage(props: Pick<UniformCompositionProps, 'params' | 'searchParams'>) {
  return (
    <UniformComposition {...props}>
      <GoogleTagManagerAnalytics />
    </UniformComposition>
  )
}