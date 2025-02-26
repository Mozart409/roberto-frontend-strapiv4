export declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }

  interface ILocale {
    locale: string;
  }

  interface IMedia {
    data: Data;
  }

  interface Data {
    id: number;
    attributes: Attributes;
  }

  interface Attributes {
    name: string;
    alternativeText: any;
    caption: any;
    width: number;
    height: number;
    formats: Formats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: any;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  }

  interface Formats {
    thumbnail: Thumbnail;
  }

  interface Thumbnail {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: any;
    size: number;
    width: number;
    height: number;
  }
  interface ILink {
    url: string;
    id: string | number;
    text: string;
    newTab: boolean;
  }
  interface IButton {
    type: string;
    theme: string;
    text: string;
    newTab: boolean;
  }
}
