import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ollamaAPI, handleApiError } from '../api/api';
import { fetchOllamaModels, pullOllamaModel } from '../redux/slices/modelsSlice';
import { selectOllamaApiUrl } from '../redux/slices/settingsSlice';
import ChatSidebar from '../components/ChatSidebar';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const { selectedModel, models } = useSelector((state) => state.models);
  const apiUrl = useSelector(selectOllamaApiUrl);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeModels = async () => {
      try {
        // First fetch available models
        await dispatch(fetchOllamaModels()).unwrap();
        
        // Then check and load TinyLlama if needed
        const modelName = 'tinyllama:latest';
        if (!models.some(m => m.name === modelName)) {
          await dispatch(pullOllamaModel(modelName)).unwrap();
        }
      } catch (error) {
        console.error('Error initializing models:', error);
        setError('Failed to initialize models. Please try again.');
      }
    };

    if (models.length === 0) {
      initializeModels();
    }
  }, [dispatch, models]);

  const handleNewChat = useCallback(() => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    setConversations(prevConversations => [newConversation, ...prevConversations]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (conversations.length === 0) {
      handleNewChat();
    }
  }, [conversations.length, handleNewChat]);

  const handleSelectConversation = (conversation) => {
    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
    setError(null);
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prevConversations => {
      const newConversations = prevConversations.filter(c => c.id !== conversationId);
      if (activeConversationId === conversationId) {
        const nextConversation = newConversations[0];
        if (nextConversation) {
          setActiveConversationId(nextConversation.id);
          setMessages(nextConversation.messages);
        } else {
          handleNewChat();
        }
      }
      return newConversations;
    });
  };

  const updateConversation = useCallback((newMessages) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: newMessages,
            title: newMessages[0]?.content.slice(0, 30) + '...' || 'New Chat'
          };
        }
        return conv;
      })
    );
  }, [activeConversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!activeConversationId) {
      handleNewChat();
    }

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateConversation(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await ollamaAPI.chat(
        selectedModel?.name || 'tinyllama:latest',
        newMessages
      );
      const updatedMessages = [...newMessages, response.data];
      setMessages(updatedMessages);
      updateConversation(updatedMessages);
    } catch (error) {
      console.error('Error:', error);
      setError(handleApiError(error).message);
      setMessages(messages);
      updateConversation(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
      />

    
      <div className="flex-1 flex flex-col h-full bg-black-200 lg:pl-64">  
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-700 max-w-[80%]">
              <p className="text-sm font-semibold mb-1">Error</p>
              <p>{error}</p>
            </div>
          )}
          {messages.length === 0 && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white-500">
                <p className="text-xl text-white font-semibold mb-2">Start a conversation</p>
                <p className="text-sm text-white">Type a message below to begin chatting</p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user' ? 'bg-blue-500 ml-auto' : 'bg-blue'
              } max-w-[80%]`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <p className="text-white-800 whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg bg-blue max-w-[90%]">
              <p className="text-sm text-white font-semibold mb-1">Assistant</p>
              <p className="text-white-500">Thinking...</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex space-x-4 ">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 text-black"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-blue-500 focus:outline-none disabled:bg-white-400"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
