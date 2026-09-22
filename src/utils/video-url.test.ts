import { describe, expect, it } from "vitest";
import { isVideoUrl, toEmbedUrl, VIDEO_URL_REGEX } from "./video-url";

describe("VIDEO_URL_REGEX", () => {
  // tiptap's paste rules consume `find` via String.prototype.matchAll, which
  // throws a TypeError on a non-global regex — the bug this guards against.
  it("is global (matchAll-safe), as tiptap paste rules require", () => {
    expect(VIDEO_URL_REGEX.global).toBe(true);
    expect(() => "https://www.bilibili.com/video/BV1xx411c7mD".matchAll(VIDEO_URL_REGEX)).not.toThrow();
  });

  it("matches supported platform URLs", () => {
    const urls = [
      "https://www.bilibili.com/video/BV1xx411c7mD",
      "https://v.qq.com/x/page/u0322h706y2.html",
      "https://v.youku.com/v_show/id_XNTgxMzU0NzY0NA==.html",
      "https://www.iqiyi.com/v_19rrok4nt0.html",
      "https://www.ixigua.com/7234567890123456789",
      "https://www.mgtv.com/b/435466.html",
      "https://www.douyin.com/video/7234567890123456789",
      "https://open.163.com/newview/movie/free?pid=M8AUID",
    ];
    for (const url of urls) {
      expect(url.match(VIDEO_URL_REGEX), url).toBeTruthy();
    }
  });

  it("does not match plain text or non-video URLs", () => {
    expect("just some text".match(VIDEO_URL_REGEX)).toBeNull();
    expect("https://example.com/page".match(VIDEO_URL_REGEX)).toBeNull();
  });
});

describe("toEmbedUrl", () => {
  it("converts platform URLs to embed players", () => {
    expect(toEmbedUrl("https://www.bilibili.com/video/BV1xx411c7mD")).toBe(
      "https://player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1",
    );
    expect(toEmbedUrl("https://www.bilibili.com/video/av170001")).toBe(
      "https://player.bilibili.com/player.html?aid=170001&page=1",
    );
    expect(toEmbedUrl("https://v.qq.com/x/page/u0322h706y2.html")).toBe(
      "https://v.qq.com/txp/iframe/player.html?vid=u0322h706y2",
    );
    expect(toEmbedUrl("https://v.youku.com/v_show/id_XNTgxMzU0NzY0NA==.html")).toBe(
      "https://player.youku.com/embed/XNTgxMzU0NzY0NA==",
    );
    expect(toEmbedUrl("https://www.ixigua.com/7234567890123456789")).toBe(
      "https://www.ixigua.com/iframe/7234567890123456789",
    );
  });

  it("passes embed/player URLs through as-is", () => {
    expect(toEmbedUrl("https://player.bilibili.com/player.html?bvid=BV1xx&page=1")).toBe(
      "https://player.bilibili.com/player.html?bvid=BV1xx&page=1",
    );
  });

  it("accepts generic http(s) URLs and rejects junk", () => {
    expect(toEmbedUrl("https://example.com/media.mp4")).toBe("https://example.com/media.mp4");
    expect(toEmbedUrl("not a url")).toBeNull();
    expect(toEmbedUrl("")).toBeNull();
  });
});

describe("isVideoUrl", () => {
  it("mirrors toEmbedUrl", () => {
    expect(isVideoUrl("https://www.bilibili.com/video/BV1xx411c7mD")).toBe(true);
    expect(isVideoUrl("https://example.com/page")).toBe(true); // generic http(s) still counts
    expect(isVideoUrl("javascript:alert(1)")).toBe(false);
  });
});
