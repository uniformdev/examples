import { DefaultNotImplementedComponent } from "@uniformdev/canvas-react"

import { Hero } from "./Hero"
import TalkList from "./TalkList"
import { WhyAttend } from "./WhyAttend"
import { Talk } from "./Talk"
import { RegisterForm } from "./RegisterForm"
import Navbar from "./Navbar"
import Footer from "./Footer"

const mappings = {
  hero: Hero,
  talklist: TalkList,
  talk: Talk,
  whyattend: WhyAttend,
  registrationForm: RegisterForm,
  header: Navbar,
  footer: Footer,
}

export function resolveRenderer(component) {
  const componentImpl = mappings[component.type]
  return componentImpl ? componentImpl : DefaultNotImplementedComponent
}

export default mappings
