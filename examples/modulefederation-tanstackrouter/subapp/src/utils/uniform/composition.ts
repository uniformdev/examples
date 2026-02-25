import { createCompositionApi } from "@repo/uniform-preview/api"

const { fetchComposition, fetchCompositionById } = createCompositionApi({
  apiBase: `http://localhost:5183`,
  transformPath: (path) => path.replace('/subapp', ''),
})

export { fetchComposition, fetchCompositionById }
