import { type ServiceConfig } from '../types/services';

export type { ServiceConfig };

export const SERVICES: Record<string, ServiceConfig> = {
  google: {
    id: 'google',
    name: 'Google',
    label: 'Gemini API Key',
    storageKey: 'geminiApiKey',
    placeholder: 'Enter your Gemini API key',
    helpLink: 'https://aistudio.google.com/apikey',
    helpLinkText: 'Google AI Studio',
    freeTierNote: 'Free tier has rate limits. Some models (e.g. Pro) may require a paid plan or have very low daily quotas.',
    validateKey: (key: string) => key.startsWith('AI') && key.length >= 30,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    label: 'OpenAI API Key',
    storageKey: 'openaiApiKey',
    placeholder: 'Enter your OpenAI API key',
    helpLink: 'https://platform.openai.com/api-keys',
    helpLinkText: 'OpenAI Platform',
    validateKey: (key: string) => key.startsWith('sk-') && key.length >= 30,
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    label: 'Anthropic API Key',
    storageKey: 'anthropicApiKey',
    placeholder: 'Enter your Anthropic API key',
    helpLink: 'https://console.anthropic.com/settings/keys',
    helpLinkText: 'Anthropic Console',
    validateKey: (key: string) => key.startsWith('sk-ant-') && key.length >= 30,
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    label: 'OpenRouter API Key',
    storageKey: 'openrouterApiKey',
    placeholder: 'Enter your OpenRouter API key',
    helpLink: 'https://openrouter.ai/keys',
    helpLinkText: 'OpenRouter Dashboard',
    validateKey: (key: string) => key.startsWith('sk-or-') && key.length >= 30,
  },
  'openai-compatible': {
    id: 'openai-compatible',
    name: 'OpenAI Compatible',
    label: 'API Key (optional)',
    storageKey: 'openaiCompatibleApiKey',
    placeholder: 'Enter your API key (leave empty if not required)',
    helpLink: 'https://platform.openai.com/docs/api-reference',
    helpLinkText: 'OpenAI API Reference',
    freeTierNote: 'Connect any server that speaks the OpenAI API format — e.g. Ollama, LM Studio, vLLM, or a custom proxy.',
    validateKey: () => true,
    baseUrlStorageKey: 'openaiCompatibleBaseUrl',
    baseUrlLabel: 'Base URL',
    baseUrlPlaceholder: 'https://your-server/v1',
    allowEmptyKey: true,
  },
};

export const DEFAULT_SERVICE_ID = 'google';
export const SELECTED_SERVICE_STORAGE_KEY = 'selectedService';
export const SELECTED_MODEL_STORAGE_KEY = 'selectedModel';
export const MODELS_CACHE_KEY_PREFIX = 'cachedModels_';

export const EMPTY_SERVICE: ServiceConfig = {
  id: '',
  name: '',
  label: '',
  storageKey: '',
  placeholder: '',
  helpLink: '',
  helpLinkText: '',
  validateKey: () => false,
};

export const getService = (serviceId: string): ServiceConfig => {
  return SERVICES[serviceId] || SERVICES[DEFAULT_SERVICE_ID];
};

export const getServiceIds = (): string[] => {
  return Object.keys(SERVICES);
};
