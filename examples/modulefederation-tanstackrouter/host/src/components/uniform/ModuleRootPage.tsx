import { UniformSlot } from "@uniformdev/canvas-react"
import { Outlet } from "@tanstack/react-router"

const ModuleRootPage = () => {
  return (
    <>
      <UniformSlot name="header" />
      <UniformSlot name="content" />
      <Outlet key="outlet" />
      <UniformSlot name="footer" />
    </>
  )
};

export default ModuleRootPage;
