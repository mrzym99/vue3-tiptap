/** Custom image uploader, set via `Image.configure({ upload })`; returns the stored URL. */
export type ImageUploader = (file: File) => Promise<string>;
