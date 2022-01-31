import type { GetStaticProps, NextPage } from 'next'
import { getPage } from '@cms'
import { ComponentType } from '../lib/models'

import { ComponentPage, PageProps } from '../components/ComponentPage';
import { RegisterForm } from '../components/RegistrationForm';

const componentMapping: Partial<Record<ComponentType, React.ComponentType<any>>> = {
  [ComponentType.RegistrationForm]: RegisterForm
}

const Registration: NextPage<PageProps> = (props) => {
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
      page: await getPage('/registration')
    }
  }
}

export default Registration;
