export interface ModelOption {
  id: string;
  name: string;
  maxOutputTokens?: number;
}

export interface ServiceConfig {
  id: string;
  name: string;
  label: string;
  storageKey: string;
  placeholder: string;
  helpLink: string;
  helpLinkText: string;
  freeTierNote?: string;
  validateKey: (key: string) => boolean;
  /** Storage key used to persist the custom base URL (e.g. for OpenAI-compatible servers). */
  baseUrlStorageKey?: string;
  /** Label shown above the base URL input field. */
  baseUrlLabel?: string;
  /** Placeholder text for the base URL input field. */
  baseUrlPlaceholder?: string;
  /** When true the API key field may be left empty (e.g. local servers with no auth). */
  allowEmptyKey?: boolean;
}
