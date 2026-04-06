import { fetchWithTimeout, throwApiResponseError } from '../../../utils/helpers';
import { type ModelOption } from '../../../types/services';

const validateBaseUrl = (baseUrl: string): void => {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error('Invalid base URL provided for OpenAI-compatible server');
  }
  const isLocalhost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname === '::1';
  const allowedProtocols = ['https:', ...(isLocalhost ? ['http:'] : [])];
  if (!allowedProtocols.includes(parsed.protocol)) {
    throw new Error('OpenAI-compatible base URL must use https:// (or http:// for localhost)');
  }
};

export const fetchOpenAICompatibleModels = async (
  apiKey: string,
  baseUrl: string
): Promise<ModelOption[]> => {
  validateBaseUrl(baseUrl);
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetchWithTimeout(`${baseUrl}/models`, { headers });

  if (!response.ok) {
    await throwApiResponseError('OpenAI Compatible', response);
  }

  const data = await response.json();

  if (!Array.isArray(data?.data)) {
    throw new Error('Unexpected response from the models endpoint');
  }

  return data.data
    .map((model: Record<string, unknown>) => ({
      id: model.id as string,
      name: model.id as string,
    }))
    .sort((modelA: ModelOption, modelB: ModelOption) => modelA.id.localeCompare(modelB.id));
};

export const callOpenAICompatible = async (
  apiKey: string,
  baseUrl: string,
  systemPrompt: string,
  userPrompt: string,
  model: string,
  maxTokens?: number
): Promise<string> => {
  validateBaseUrl(baseUrl);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      ...(maxTokens !== undefined && { max_tokens: maxTokens }),
    }),
  });

  if (!response.ok) {
    await throwApiResponseError('OpenAI Compatible', response);
  }

  const data = await response.json();

  if (data?.choices?.[0]?.finish_reason === 'length') {
    throw new Error('Response was truncated — the model ran out of output tokens. Please try again.');
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response from the OpenAI-compatible server');
  }

  return text.trim();
};
