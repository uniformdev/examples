import { useMeshLocation } from "@uniformdev/mesh-sdk-react";
import { useAsync } from "react-use";
import JiraComments from "../components/JiraComments";
import { useState } from "react";

const CanvasEditorTools = () => {
  const { value, metadata } = useMeshLocation("canvasEditorTools");
  const compositionId = value.rootEntity._id;
  const [loaded, setLoaded] = useState(false);

  const { value: comments } = useAsync(async () => {
    const response = await fetch(
      `/api/get-issue-comments?compositionId=${compositionId}`
    );
    setLoaded(true);
    return response.json();
  }, [compositionId]);

  console.log({ comments });
  return (
    <main className="container mx-auto py-10 px-4">
      <h3 className="text-l font-bold text-gray-800 mb-8">Comments</h3>
      {loaded ? <JiraComments comments={comments} /> : <div>Loading...</div>}
    </main>
  );
};

export default CanvasEditorTools;
