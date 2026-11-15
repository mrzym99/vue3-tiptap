/**
 * Custom image uploader, set via `ImageUpload.configure({ upload })`; resolves to the stored URL.
 * `onProgress` receives 0-100, `signal` aborts when the upload zone unmounts.
 */
export type ImageUploader = (
  file: File,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
) => Promise<string>;
