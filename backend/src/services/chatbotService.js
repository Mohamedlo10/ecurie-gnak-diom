// chatbotService.js
import axios from "axios";
import { OLLAMA_API_URL, MODEL_NAME } from "../config/ollamaConfig.js";

export const askChatbot = async (prompt, context = []) => {
  const data = {
    model: MODEL_NAME,
    prompt,
    context, // pour maintenir la continuité de la discussion
    stream: false
  };

  const response = await axios.post(OLLAMA_API_URL, data);
  
  return {
    response: response.data.response,
    context: response.data.context
  };
};
