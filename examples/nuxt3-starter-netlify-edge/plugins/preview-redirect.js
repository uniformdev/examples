export default defineNuxtPlugin(({ $router }) => {
  const { query, fullPath } = $router.currentRoute.value;
  if (query.preview && !query.redirected) {
    const { slug } = query;
    const url = `${fullPath.replace(
      "/?preview",
      `${slug}?preview`
    )}&redirected=true`;

    $router.push(url);
  }
});
