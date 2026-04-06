import { SERVICES } from '../../config/services';
import { type ModelOption } from '../../types/services';
import {
  callGemini, callOpenAI, callAnthropic, callOpenRouter, callOpenAICompatible,
  fetchGeminiModels, fetchOpenAIModels, fetchAnthropicModels, fetchOpenRouterModels, fetchOpenAICompatibleModels,
} from './providers';

const getBaseUrl = async (serviceId: string): Promise<string> => {
  const service = SERVICES[serviceId];
  if (!service?.baseUrlStorageKey) return '';
  const result = await chrome.storage.local.get([service.baseUrlStorageKey]);
  return (result[service.baseUrlStorageKey] as string | undefined) ?? '';
};

export const fetchModelsForProvider = async (
  serviceId: string,
  apiKey: string
): Promise<ModelOption[]> => {
  switch (serviceId) {
    case 'google':
      return fetchGeminiModels(apiKey);
    case 'openai':
      return fetchOpenAIModels(apiKey);
    case 'anthropic':
      return fetchAnthropicModels(apiKey);
    case 'openrouter':
      return fetchOpenRouterModels(apiKey);
    case 'openai-compatible': {
      const baseUrl = await getBaseUrl(serviceId);
      if (!baseUrl) throw new Error('Base URL is required for OpenAI-compatible servers');
      return fetchOpenAICompatibleModels(apiKey, baseUrl);
    }
    default:
      throw new Error(`Unsupported service: ${serviceId}`);
  }
};

export const getApiKey = async (serviceId: string): Promise<string> => {
  const service = SERVICES[serviceId];
  if (!service) {
    throw new Error(`Unknown service: ${serviceId}`);
  }

  const storageResult = await chrome.storage.local.get([service.storageKey]);
  const apiKey = storageResult[service.storageKey];

  if (!apiKey && !service.allowEmptyKey) {
    throw new Error(`No API key found for ${service.name}`);
  }

  return apiKey ?? '';
};

export const callProvider = async (
  serviceId: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  model: string,
  maxTokens?: number
): Promise<string> => {
  switch (serviceId) {
    case 'google':
      return callGemini(apiKey, systemPrompt, userPrompt, model, maxTokens);
    case 'openai':
      return callOpenAI(apiKey, systemPrompt, userPrompt, model, maxTokens);
    case 'anthropic':
      return callAnthropic(apiKey, systemPrompt, userPrompt, model, maxTokens);
    case 'openrouter':
      return callOpenRouter(apiKey, systemPrompt, userPrompt, model, maxTokens);
    case 'openai-compatible': {
      const baseUrl = await getBaseUrl(serviceId);
      if (!baseUrl) throw new Error('Base URL is required for OpenAI-compatible servers');
      return callOpenAICompatible(apiKey, baseUrl, systemPrompt, userPrompt, model, maxTokens);
    }
    default:
      throw new Error(`Unsupported service: ${serviceId}`);
  }
};
