import errorinCuy from "./errorinCuy.js";
import sanitizeHtml from "sanitize-html";

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

  // GOOGLE TRANSLATE PROXY BYPASS (Fix for Render 403)
  // If we are scraping Otakudesu, route through Google Translate
  let fetchUrl = url.toString();
  if (url.hostname.includes("otakudesu")) {
    const origin = url.hostname; // e.g. otakudesu.best
    const proxiedHost = origin.replace(/\./g, "-") + ".translate.goog"; // otakudesu-best.translate.goog

    // Deconstruct original URL
    const originalPath = url.pathname;
    const originalSearch = url.search; // Keep existing query params if any

    // Construct Google Proxy URL
    // Format: https://otakudesu-best.translate.goog/path?original_query&_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=id
    fetchUrl = `https://${proxiedHost}${originalPath}${originalSearch}${originalSearch ? "&" : "?"}_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=id`;

    // Update Host header? No, fetch handles it.
    // console.log("Proxying via Google:", fetchUrl);
  }

  const response = await fetch(fetchUrl, { headers, redirect: "follow" });

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
