import { NextApiRequest, NextApiResponse } from "next";
import { getIssueByExternalId, getIssueComments } from "../../utils/jira";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get composition id from query params
  const { compositionId } = req.query;

  if (!compositionId) {
    return res.status(400).json({ error: "Composition ID is required" });
  }

  const jiraIssue = await getIssueByExternalId(compositionId as string);
  if (!jiraIssue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const comments = await getIssueComments(jiraIssue.key);

  res.status(200).json(comments);
}
