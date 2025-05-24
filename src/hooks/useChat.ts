import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types/chat';
import { agentService } from '../services/agentService';
import { imageService } from '../services/imageService';


export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleStreamingResponse = async (userInput: string, tempId: string, imageFilename?: string) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setDebugInfo('Starting streaming response...');

      await agentService.sendStreamingMessage(
        userInput,
        imageFilename,
        abortControllerRef.current,
        (content) => {
          setDebugInfo(prev => prev + '\nProcessing content: ' + content);
          setMessages(prev => prev.map(msg =>
            msg.id === tempId
              ? { ...msg, content: msg.content + content }
              : msg
          ));
        },
        (error) => {
          console.error('Streaming error:', error);
          setDebugInfo(prev => prev + '\nError: ' + error);
        },
        () => {
          setDebugInfo(prev => prev + '\nStream complete');
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to set up streaming:', error);
      setDebugInfo(prev => prev + '\nSetup error: ' + (error instanceof Error ? error.message : String(error)));
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  };


  const sendMessage = async (userInput: string, imageFilename?: string) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput.trim(),
      imageUrl: imageFilename ? imageService.getImageUrl(imageFilename) : undefined
    };
    
    addMessage(userMessage);
    setInput("");
    setIsLoading(true);
    setDebugInfo('');

    const tempId = (Date.now() + 1).toString();
    addMessage({
        id: tempId,
        role: 'assistant',
        content: ''
      });
      
    await handleStreamingResponse(userInput, tempId, imageFilename);
  };

  return {
    messages,
    input,
    isLoading,
    debugInfo,
    chatContainerRef,
    handleInputChange,
    sendMessage,
    setDebugInfo
  };
} 