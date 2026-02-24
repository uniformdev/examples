import { Plans } from "../ui/Plans.tsx"
import { UniformText } from "@uniformdev/canvas-react"

export default function UniformPlans() {
  return (
    <Plans title={<UniformText parameterId="title" placeholder="Plans"  />} />
  )
}
