import { GoogleGenerativeAI, GenerativeModel, ChatSession, Content } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (): GoogleGenerativeAI => {
  if (genAI) return genAI;
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Set EXPO_PUBLIC_GEMINI_API_KEY in your environment.');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getModel = (): GenerativeModel => {
  const ai = initializeGemini();
  return ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

export const startChat = (history: Content[], systemInstruction: string): ChatSession => {
  // In the newer SDK versions, systemInstruction can be passed during model init.
  const modelWithSystemInstruction = initializeGemini().getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
  });
  return modelWithSystemInstruction.startChat({
    history,
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (chat: ChatSession, message: string, retries = 3): Promise<string> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error: any) {
      attempt++;
      if (attempt >= retries || error?.status === 400) {
        throw error;
      }
      // Exponential backoff
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
  throw new Error('Failed to send message after retries');
};

export const sendMessageStream = async (chat: ChatSession, message: string, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const result = await chat.sendMessageStream(message);
      return result.stream;
    } catch (error: any) {
      attempt++;
      if (attempt >= retries || error?.status === 400) {
        throw error;
      }
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
  throw new Error('Failed to send message stream after retries');
};
