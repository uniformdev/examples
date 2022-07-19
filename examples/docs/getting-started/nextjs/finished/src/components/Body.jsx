import Navigation from "./Navigation";

import content from "../../lib/content.json";

export default function Body(props) {
  const { fields } = props;
  const title = fields?.title;
  const description = fields?.description;
  return (
    <main className="main">
      <Navigation content={content} />
      <h1 className="title">{title}</h1>
      <p className="description">{description}</p>
    </main>
  );
}
