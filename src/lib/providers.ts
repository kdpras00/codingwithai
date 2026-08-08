export interface Provider {
  id: string;
  label: string;
  baseUrl: string;
  docs: string;
  models: { id: string; label: string }[];
  note?: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    docs: "platform.openai.com/api-keys",
    models: [
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini (hemat)" },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    baseUrl: "https://api.anthropic.com/v1",
    docs: "console.anthropic.com/settings/keys",
    models: [
      { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet (terbaik)" },
      { id: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku (hemat)" },
    ],
    note: "Browser access diizinkan oleh Anthropic untuk aplikasi BYOK.",
  },
  {
    id: "google",
    label: "Google (Gemini)",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    docs: "aistudio.google.com/app/apikey",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    ],
  },
  {
    id: "openrouter",
    label: "OpenRouter (semua model)",
    baseUrl: "https://openrouter.ai/api/v1",
    docs: "openrouter.ai/keys",
    models: [
      { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
      { id: "openai/gpt-4o", label: "OpenAI GPT-4o" },
      { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "deepseek/deepseek-chat", label: "DeepSeek V3 (hemat)" },
    ],
    note: "Satu key untuk semua model dari semua vendor.",
  },
  {
    id: "custom",
    label: "Custom (OpenAI-compatible)",
    baseUrl: "",
    docs: "Groq, DeepSeek, Ollama, LM Studio, vLLM, dll.",
    models: [],
    note: "Isi base URL & model sendiri, mis. http://localhost:11434/v1 (Ollama).",
  },
];

export interface LLMSettings {
  provider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export const DEFAULT_SETTINGS: LLMSettings = {
  provider: "openai",
  apiKey: "",
  baseUrl: "",
  model: "",
};

export function getProvider(id: string): Provider {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}

export function resolveBaseUrl(s: LLMSettings): string {
  if (s.baseUrl.trim()) return s.baseUrl.trim().replace(/\/+$/, "");
  return getProvider(s.provider).baseUrl;
}

export function resolveModel(s: LLMSettings): string {
  if (s.model.trim()) return s.model.trim();
  const p = getProvider(s.provider);
  return p.models[0]?.id ?? "";
}

export function isConfigured(s: LLMSettings): boolean {
  return Boolean(s.apiKey.trim() && resolveBaseUrl(s) && resolveModel(s));
}
