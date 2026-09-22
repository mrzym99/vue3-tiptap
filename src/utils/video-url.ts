/**
 * Convert a video platform page URL to its embeddable player URL.
 * Returns null when the platform/URL is not recognized.
 *
 * Supported platforms (domestic + common):
 * - Bilibili     https://www.bilibili.com/video/BVxxxx  (BV / av id)
 * - Tencent      https://v.qq.com/x/page/xxx.html  /  x/cover/xxx/yyy.html
 * - Youku        https://v.youku.com/v_show/id_xxx.html
 * - iQIYI        https://www.iqiyi.com/v_xxx.html
 * - Xigua        https://www.ixigua.com/xxx
 * - MangoTV      https://www.mgtv.com/b/xxx.html
 * - Douyin       https://www.douyin.com/video/xxx
 * - NetEase      https://open.163.com/newview/movie/xxx.html
 * - generic      any http(s) URL (embedded as-is if it already looks like a player)
 */
export function toEmbedUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return null;

  // Bilibili: BV id
  let m = u.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+)/i);
  if (m) return `https://player.bilibili.com/player.html?bvid=${m[1]}&page=1`;
  // Bilibili: av id
  m = u.match(/bilibili\.com\/video\/av(\d+)/i);
  if (m) return `https://player.bilibili.com/player.html?aid=${m[1]}&page=1`;

  // Tencent video: /x/page/{vid}.html (single) or /x/cover/{cid}/{vid}.html
  m = u.match(
    /v\.qq\.com\/x\/(?:page\/([0-9a-zA-Z]+)|cover\/[^/]+\/([0-9a-zA-Z]+))\.html/i,
  );
  if (m) {
    const vid = m[1] ?? m[2];
    if (vid) return `https://v.qq.com/txp/iframe/player.html?vid=${vid}`;
  }

  // Youku: /v_show/id_{vid}.html
  m = u.match(/v\.youku\.com\/v_show\/id_([0-9a-zA-Z=]+)\.html/i);
  if (m) return `https://player.youku.com/embed/${m[1]}`;

  // iQIYI: /v_{vid}.html
  m = u.match(/iqiyi\.com\/[av]_([0-9a-zA-Z]+)\.html/i);
  if (m) return `https://player.video.iqiyi.com/${m[1]}/0/0/vid.swf`;

  // Xigua video: ixigua.com/{id} (embed via xigua player)
  m = u.match(/ixigua\.com\/(\d{10,})/i);
  if (m) {
    return `https://www.ixigua.com/iframe/${m[1]}`;
  }

  // MangoTV: mgtv.com/b/{sn}.html
  m = u.match(/mgtv\.com\/b\/(\d+)\.html/i);
  if (m) {
    return `https://www.mgtv.com/hz/vip/player/v6/player.swf?video_id=${m[1]}`;
  }

  // Douyin: douyin.com/video/{id}
  m = u.match(/douyin\.com\/video\/(\d+)/i);
  if (m) {
    return `https://www.iesdouyin.com/share/video/${m[1]}/`;
  }

  // NetEase open class: open.163.com/newview/movie/{id}.html
  m = u.match(/open\.163\.com\/newview\/movie\/(\w+)\.html/i);
  if (m) {
    return `https://open.163.com/newview/movie/free?pid=${m[1]}`;
  }

  // Already an embed / player URL — use as-is.
  if (/player\.|embed|iframe|iesdouyin/i.test(u)) return u;

  // Generic fallback: only accept http(s) pages.
  return /^https?:\/\//i.test(u) ? u : null;
}

/** True when the URL looks like a video from a supported platform. */
export function isVideoUrl(url: string): boolean {
  return toEmbedUrl(url) !== null;
}

/**
 * Paste-rule pattern matching supported video page URLs.
 *
 * Must carry the `g` flag: tiptap's paste rules consume it via
 * `String.prototype.matchAll`, which throws on a non-global regex
 * (the official URL extensions mark theirs global for the same reason).
 */
export const VIDEO_URL_REGEX =
  /(?:bilibili\.com\/video\/|v\.qq\.com\/x\/|v\.youku\.com\/v_show|iqiyi\.com\/[av]_|ixigua\.com\/|mgtv\.com\/b\/|douyin\.com\/video\/|open\.163\.com\/newview\/movie\/)[^\s<>]+/gi;
