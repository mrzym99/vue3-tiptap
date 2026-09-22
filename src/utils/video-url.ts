/** Convert a supported platform's page URL to its embed URL; generic http(s) URLs pass through, unknown → null. */
export function toEmbedUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return null;

  let m = u.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+)/i);
  if (m) return `https://player.bilibili.com/player.html?bvid=${m[1]}&page=1`;
  m = u.match(/bilibili\.com\/video\/av(\d+)/i);
  if (m) return `https://player.bilibili.com/player.html?aid=${m[1]}&page=1`;

  m = u.match(
    /v\.qq\.com\/x\/(?:page\/([0-9a-zA-Z]+)|cover\/[^/]+\/([0-9a-zA-Z]+))\.html/i,
  );
  if (m) {
    const vid = m[1] ?? m[2];
    if (vid) return `https://v.qq.com/txp/iframe/player.html?vid=${vid}`;
  }

  m = u.match(/v\.youku\.com\/v_show\/id_([0-9a-zA-Z=]+)\.html/i);
  if (m) return `https://player.youku.com/embed/${m[1]}`;

  m = u.match(/iqiyi\.com\/[av]_([0-9a-zA-Z]+)\.html/i);
  if (m) return `https://player.video.iqiyi.com/${m[1]}/0/0/vid.swf`;

  m = u.match(/ixigua\.com\/(\d{10,})/i);
  if (m) return `https://www.ixigua.com/iframe/${m[1]}`;

  m = u.match(/mgtv\.com\/b\/(\d+)\.html/i);
  if (m) return `https://www.mgtv.com/hz/vip/player/v6/player.swf?video_id=${m[1]}`;

  m = u.match(/douyin\.com\/video\/(\d+)/i);
  if (m) return `https://www.iesdouyin.com/share/video/${m[1]}/`;

  m = u.match(/open\.163\.com\/newview\/movie\/(\w+)\.html/i);
  if (m) return `https://open.163.com/newview/movie/free?pid=${m[1]}`;

  // Already an embed / player URL — use as-is.
  if (/player\.|embed|iframe|iesdouyin/i.test(u)) return u;

  // Generic fallback: only accept http(s) pages.
  return /^https?:\/\//i.test(u) ? u : null;
}

/** True when the URL looks like a video from a supported platform. */
export function isVideoUrl(url: string): boolean {
  return toEmbedUrl(url) !== null;
}

/** Paste-rule pattern for supported video page URLs. Must stay global: tiptap consumes it via String.matchAll, which throws on non-global regexes. */
export const VIDEO_URL_REGEX =
  /(?:bilibili\.com\/video\/|v\.qq\.com\/x\/|v\.youku\.com\/v_show|iqiyi\.com\/[av]_|ixigua\.com\/|mgtv\.com\/b\/|douyin\.com\/video\/|open\.163\.com\/newview\/movie\/)[^\s<>]+/gi;
