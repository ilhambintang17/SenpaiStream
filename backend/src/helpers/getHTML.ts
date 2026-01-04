import errorinCuy from "./errorinCuy.js";
import sanitizeHtml from "sanitize-html";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";

// Auto-configure Proxy if environment variable is set (e.g. from WARP)
let fetchAgent: any = undefined;
if (process.env.HTTPS_PROXY || process.env.SOCKS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.SOCKS_PROXY;
  if (proxyUrl && proxyUrl.startsWith("socks")) {
    fetchAgent = new SocksProxyAgent(proxyUrl);
    console.log(`[Proxy] Agent set to: ${proxyUrl}`);
  }
}

// Full Chrome 120 on Windows 10 Headers
export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export default async function getHTML(
  baseUrl: string,
  pathname: string,
  ref?: string,
  sanitize = false
): Promise<string> {
  const url = new URL(pathname, baseUrl);
  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "Connection": "keep-alive"
  };

  // If no referer provided, pretend we came from Google
  headers.Referer = ref ? (ref.startsWith("http") ? ref : new URL(ref, baseUrl).toString()) : "https://www.google.com/";

  // @ts-ignore - node-fetch types mismatch with native fetch types in strict mode
  const response = await fetch(url.toString(), {
    headers,
    redirect: "follow",
    agent: fetchAgent
  });

  if (!response.ok) {
    response.status > 399 ? errorinCuy(response.status) : errorinCuy(404);
  }

  const html = await response.text();

  if (!html.trim()) errorinCuy(404);

  if (sanitize) {
    return sanitizeHtml(html, {
      allowedTags: [
        "address",
        "article",
        "aside",
        "footer",
        "header",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "main",
        "nav",
        "section",
        "blockquote",
        "div",
        "dl",
        "figcaption",
        "figure",
        "hr",
        "li",
        "main",
        "ol",
        "p",
        "pre",
        "ul",
        "a",
        "abbr",
        "b",
        "br",
        "code",
        "data",
        "em",
        "i",
        "mark",
        "span",
        "strong",
        "sub",
        "sup",
        "time",
        "u",
        "img",
      ],
      allowedAttributes: {
        a: ["href", "name", "target"],
        img: ["src"],
        "*": ["class", "id"],
      },
    });
  }

  return html as string;
}
