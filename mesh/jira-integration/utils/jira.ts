export async function getIssueByExternalId(externalId: string) {
  const CUSTOM_FIELD_ID = process.env.JIRA_CUSTOM_FIELD_ID!;

  const jql = `cf[${CUSTOM_FIELD_ID.replace(
    "customfield_",
    ""
  )}]~"${externalId}"`;
  const url = `${
    process.env.JIRA_BASE_URL
  }/rest/api/3/search?jql=${encodeURIComponent(jql)}`;

  console.log("url", url);
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(
        `${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_ACCESS_TOKEN}`
      )}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const json = await response.json();
    console.error(json);
    throw new Error(`Failed to search issue: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.issues.length === 0) {
    return undefined;
  }

  return data.issues[0]; // Return the first matching issue
}

export async function getIssueComments(issueId: string) {
  const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueId}/comment`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(
        `${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_ACCESS_TOKEN}`
      )}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const json = await response.json();
    console.error(json);
    throw new Error(`Failed to get issue comments: ${response.statusText}`);
  }

  const data = await response.json();

  return data.comments;
}
