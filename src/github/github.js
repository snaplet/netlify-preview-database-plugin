import fetch from "node-fetch";

const [OWNER, REPOSITORY] = new URL(process.env.REPOSITORY_URL).pathname.slice(1).split("/");

/**
 * @template T
 * @param {string} path
 * @returns {Promise<T>}
 */
export async function github(path, options) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPOSITORY}/${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  // @ts-ignore
  return await response.json();
}