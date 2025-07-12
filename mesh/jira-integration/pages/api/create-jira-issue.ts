import { NextApiRequest, NextApiResponse } from "next";
import { CompositionPayloadSchema, WorkflowTransitionPayloadSchema } from "@uniformdev/webhooks";
import { getIssueByExternalId } from "../../utils/jira";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = WorkflowTransitionPayloadSchema.safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { entity, initiator } = payload.data;
  const { id, name, url: edit_url } = entity || {};
  const { email } = initiator || {}
  const issue = await getIssueByExternalId(id);

  if (issue) {
    return res.status(200).json({ message: "Issue already exists" });
  }

  const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(
        `${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_ACCESS_TOKEN}`
      )}`,
    },
    body: JSON.stringify({
      fields: {
        project: {
          key: process.env.ATLASSIAN_PROJECT_KEY,
        },
        summary: `${name} composition needs review`,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `${email} has requested composition review. `,
                },
                {
                  type: "text",
                  text: "Edit this composition in Uniform: ",
                },
                {
                  type: "text",
                  text: "Click here",
                  marks: [
                    {
                      type: "link",
                      attrs: {
                        href: edit_url,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        issuetype: {
          name: "Task", // Or "Bug", "Story", etc.
        },
        ["customfield_10039"]: `https://dxj30oo703yg0.cloudfront.net/en${name.toLocaleLowerCase()}`,
        ["customfield_10038"]: id,
      },
    }),
  });

  const data = await response.json();

  res.status(200).json(data);
}
