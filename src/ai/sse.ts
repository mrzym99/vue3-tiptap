/** One streamed delta from an OpenAI-compatible `stream: true` response. */
export interface RawDelta {
  content?: string;
  reasoning_content?: string;
  tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[];
}

export interface SseParser {
  /** Feed the next decoded network chunk into the parser. */
  push(chunk: string): void;
  /** Call after the stream ends to flush a trailing event missing its blank line. */
  end(): void;
}

/**
 * Incremental parser for `data: {...}\n\n` SSE frames. Buffer state lives here so
 * the agent loop stays testable: frame boundaries may split across network chunks.
 * Malformed JSON frames are skipped, not fatal.
 */
export function createSseParser(onDelta: (delta: RawDelta) => void): SseParser {
  let buffer = "";

  const handleFrame = (frame: string) => {
    const line = frame.split("\n").find((candidate) => candidate.startsWith("data:"));
    if (!line) return;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") return;
    let delta: RawDelta | undefined;
    try {
      delta = (JSON.parse(payload) as { choices?: { delta?: RawDelta }[] }).choices?.[0]?.delta;
    } catch {
      return; // malformed frame — skip rather than kill the whole stream
    }
    if (delta) onDelta(delta);
  };

  return {
    push(chunk) {
      buffer += chunk;
      const frames = buffer.split("\n\n");
      buffer = frames.pop()!; // last element may be an incomplete frame
      frames.forEach(handleFrame);
    },
    end() {
      if (buffer.trim()) handleFrame(buffer);
      buffer = "";
    },
  };
}
