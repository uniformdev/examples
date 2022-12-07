import { GetStaticPropsContext } from 'next';
import PageComposition from '@/components/PageComposition';
import { getCompositionBySlug } from 'lib/uniform/canvasClient';
import { RootComponentInstance } from '@uniformdev/canvas';

interface CanvasPageProps {
  composition: RootComponentInstance;
}

const CanvasPage = (props: CanvasPageProps) => PageComposition(props);

export async function getServerSideProps(
  context: GetStaticPropsContext
): Promise<{ props: CanvasPageProps }> {
  const { preview = false } = context;
  const composition = await getCompositionBySlug('/algolia-demo', preview);
  return {
    props: {
      composition,
    },
  };
}

export default CanvasPage;
