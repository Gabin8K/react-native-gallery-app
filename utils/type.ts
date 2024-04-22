export type File = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
  lastModified?: number;
  selected?: boolean;
}

export type Storage = File & {
  loading?: boolean;
}

export type Toast = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  clear: () => void;
}

