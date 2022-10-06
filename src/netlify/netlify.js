import fetch from "node-fetch";

/**
 * @template T
 * @param {string} path
 * @returns {Promise<T>}
 */
export async function netlify(path, options) {
  const response = await fetch(`https://api.netlify.com/api/v1/${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Netlify API error: ${response.status} ${response.statusText}`);
  }

  if (response.status !== 204) {
    // @ts-ignore
    return await response.json();
  }
}