import config from "../config";

class AgentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  async sendStreamingMessage(
    userInput: string,
    imageFilename?: string,
    abortController?: AbortController,
    onChunk?: (content: string) => void,
    onError?: (error: string) => void,
    onComplete?: () => void
  ): Promise<void> {
    const endpoint = imageFilename
      ? `${this.baseUrl}/agent/chat-with-image-stream`
      : `${this.baseUrl}/agent/chat-stream`;

    const requestBody = imageFilename
      ? JSON.stringify({ message: userInput, filename: imageFilename })
      : JSON.stringify({ message: userInput });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
      signal: abortController?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const text = decoder.decode(value);
        const lines = text.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6);
              const data = JSON.parse(jsonStr);

              if (data.content) {
                onChunk?.(data.content);
              }

              if (data.error) {
                onError?.(data.error);
              }

              if (data.done) {
                onComplete?.();
              }
            } catch (err) {
              onError?.(err instanceof Error ? err.message : String(err));
            }
          }
        }
      }
    }
  }

  async sendRegularMessage(
    userInput: string,
    imageFilename?: string
  ): Promise<string> {
    const endpoint = imageFilename
      ? `${this.baseUrl}/agent/chat-with-image`
      : `${this.baseUrl}/agent/chat`;

    const requestBody = imageFilename
      ? JSON.stringify({ message: userInput, filename: imageFilename })
      : JSON.stringify({ message: userInput });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }
}

export const agentService = new AgentService(); 