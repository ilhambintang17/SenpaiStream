import errorinCuy from "./errorinCuy.js";
import sanitizeHtml from "sanitize-html";
export const userAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
export default async function getHTML(baseUrl, pathname, ref, sanitize = false) {
    const url = new URL(pathname, baseUrl);
    const headers = {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Connection": "keep-alive"
    };
    if (ref) {
        headers.Referer = ref.startsWith("http") ? ref : new URL(ref, baseUrl).toString();
    }
    const response = await fetch(url, { headers, redirect: "follow" });
    if (!response.ok) {
        response.status > 399 ? errorinCuy(response.status) : errorinCuy(404);
    }
    const html = await response.text();
    if (!html.trim())
        errorinCuy(404);
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
    return html;
}
