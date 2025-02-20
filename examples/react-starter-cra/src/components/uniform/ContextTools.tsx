import { useUniformContext } from "@uniformdev/context-react";

export default function ContextTools() {
  const { context } = useUniformContext();
  const fetchNearestArea = async () => {
    await context.update({
      quirks: {
        latitude: "48.4647",
        longitude: "35.0462",
      },
    });
    window.location.reload();
  };
  const forgetMe = async () => {
    await context.forget(true);
    window.location.reload();
  };

  return (
    <div>
      <h2>Context Tools</h2>
      Current quirks:
      <pre>{JSON.stringify(context.quirks, null, 2)}</pre>
      <br />
      Current scores:
      <pre>{JSON.stringify(context.scores, null, 2)}</pre>
      <hr />
      <button onClick={fetchNearestArea}>Load Lat/Long Quirks</button>
      <button onClick={forgetMe}>Forget me</button>
    </div>
  );
}
