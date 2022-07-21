exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allCompositions {
        compositions: edges {
          node {
            name
            slug
            state
            slots
            componentType
            parameters
            composition {
              _id
              _name
              _slug
              type
            }
          }
        }
      }
    }
  `)
  data.allCompositions.compositions.forEach(c => {
    const slug = c.node.slug
    const composition = c.node.composition
    composition.slots = c.node.slots ? JSON.parse(c.node.slots) : {}
    composition.parameters = c.node.parameters
      ? JSON.parse(c.node.parameters)
      : {}
    actions.createPage({
      path: slug === "/" ? "/home" : slug,
      component: require.resolve(`./src/compositions/page.js`),
      context: { composition },
    })
  })
}
