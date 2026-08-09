import { createOpenAI } from "@ai-sdk/openai";

export function getAIModel(modelId?: string) {
  // Support both generic AI_* env vars and legacy OLLAMA_* env vars
  const apiKey = process.env.AI_API_KEY || process.env.OLLAMA_API_KEY || "dummy";
  const baseURL = process.env.AI_BASE_URL || process.env.OLLAMA_BASE_URL || "https://api.openai.com/v1";

  const openai = createOpenAI({
    apiKey,
    baseURL,
  });

  const defaultModel = process.env.AI_MODEL_NAME || process.env.NEXT_PUBLIC_AI_MODEL_NAME || process.env.NEXT_PUBLIC_OLLAMA_MODELS?.split(",")[0]?.trim() || "gpt-4o-mini";
  const selectedModelId = modelId && modelId !== "default" ? modelId : defaultModel;
  
  return openai.chat(selectedModelId);
}
