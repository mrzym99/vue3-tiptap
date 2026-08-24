/**
 * Custom image uploader.
 * Configured through the `image` extension (`Image.configure({ upload })`),
 * so the image dialog can offer an "upload" tab.
 */
export type ImageUploader = (file: File) => Promise<string>;
