export {};

// https://developers.heap.io/reference/client-side-apis-overview
interface Heap {
  track: (event: string, properties?: Object) => void;
  identify: (identity: string) => void;
  resetIdentity: () => void;
  addUserProperties: (properties: Object) => void;
  addEventProperties: (properties: Object) => void;
  removeEventProperty: (property: string) => void;
  clearEventProperties: () => void;
  appid: string;
  userId: string;
  identity: string | null;
  config: any;
}

declare global {
  interface Window {
    heap?: Heap;
  }
}
