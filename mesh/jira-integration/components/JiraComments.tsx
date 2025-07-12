import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { JiraComment } from "../types/jira";

// Helper function to extract plain text from Jira's document structure
function extractTextFromJiraDoc(body: any): string {
  if (!body || !body.content) return "";

  return body.content
    .map((block: any) => {
      if (block.type === "paragraph" && block.content) {
        return block.content.map((item: any) => item.text || "").join("");
      }
      return "";
    })
    .join("\n");
}

// Helper function to format the date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
}

interface JiraCommentsProps {
  comments: JiraComment[];
}

export default function JiraComments({ comments }: JiraCommentsProps) {
  return (
    <div className="space-y-6 text-red-900">
      {comments?.length > 0 ? (
        comments?.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-none">
                <Image
                  src={comment.author.avatarUrls["48x48"] || "/placeholder.svg"}
                  alt={comment.author.displayName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-medium text-zinc-900">
                    {comment.author.displayName}
                  </h3>
                  <span className="text-sm text-zinc-500">
                    {formatDate(comment.created)}
                  </span>
                </div>
                <div className="text-zinc-700 whitespace-pre-line">
                  {extractTextFromJiraDoc(comment.body)}
                </div>
                {comment.updated !== comment.created && (
                  <div className="mt-2 text-xs text-zinc-400">
                    Edited {formatDate(comment.updated)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-black">No comments yet, come back later.</div>
      )}
    </div>
  );
}
