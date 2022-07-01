import type { GetStaticProps, NextPage } from 'next'
import { getPage } from '@cms'
import { ComponentType } from '../lib/models'

import { ComponentPage, PageProps } from '../components/ComponentPage';
import { Hero } from '../components/Hero';

const componentMapping: Partial<Record<ComponentType, React.ComponentType<any>>> = {
  [ComponentType.Hero]: Hero
}

const Marketers: NextPage<PageProps> = (props) => {
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
      page: await getPage('/marketers')
    }
  }
}

export default Marketers;
