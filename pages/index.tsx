import type { GetStaticProps, NextPage } from 'next'
import { getPage } from '@cms'
import { ComponentType } from '../lib/models'

import { CallToAction } from '../components/CallToAction';
import { PersonalizedHero } from '../components/PersonalizedHero';
import { WhyAttendTestPhotoLocation } from '../components/WhyAttend';
import { TalkList } from '../components/TalkList';
import { ComponentPage, PageProps } from '../components/ComponentPage';

const componentMapping: Partial<Record<ComponentType, React.ComponentType<any>>> = {
  [ComponentType.PersonalizedHero]: PersonalizedHero,
  [ComponentType.TalkList]: TalkList,
  [ComponentType.WhyAttend]: WhyAttendTestPhotoLocation,
  [ComponentType.CallToAction]: CallToAction
}

const Home: NextPage<PageProps> = (props) => {
  return (
    <ComponentPage
      {...props}
      componentMapping={componentMapping}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      page: await getPage('/')
    }
  }
}

export default Home;
