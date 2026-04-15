import { createContext, useState, useEffect } from 'react';
import { loadChats, saveChats, loadSettings, saveSettings } from './utils/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [settings, setSettings] = useState({ openaiKey: '', geminiKey: '' });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedChats = await loadChats();
      const storedSettings = await loadSettings();
      setChats(storedChats);
      setSettings(storedSettings);
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isReady) saveChats(chats);
  }, [chats, isReady]);

  useEffect(() => {
    if (isReady) saveSettings(settings);
  }, [settings, isReady]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const createChat = (config) => {
    const newChat = {
      id: crypto.randomUUID(),
      title: 'Nova Conversa',
      config,
      messages: [],
      createdAt: Date.now()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const addMessage = (chatId, message) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const msgs = [...c.messages, message];
        const newTitle = c.messages.length === 1 && message.role === 'user' ? (message.content.slice(0, 30) + '...') : c.title;
        return { ...c, messages: msgs, title: newTitle };
      }
      return c;
    }));
  };

  const updateMessage = (chatId, msgId, newContent) => {
     setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const msgs = c.messages.map(m => m.id === msgId ? { ...m, content: newContent } : m);
        return { ...c, messages: msgs };
      }
      return c;
    }));
  };

  const updateChatConfig = (chatId, newConfig) => {
     setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, config: newConfig };
      }
      return c;
    }));
  };

  const deleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  return (
    <AppContext.Provider value={{
      chats, activeChatId, setActiveChatId, activeChat,
      createChat, addMessage, updateMessage, updateChatConfig, deleteChat,
      settings, setSettings, isReady
    }}>
      {children}
    </AppContext.Provider>
  );
};
