import localforage from 'localforage';

localforage.config({
  name: 'CustomAI_DB'
});

export const saveChats = async (chats) => {
  await localforage.setItem('chats', chats);
};

export const loadChats = async () => {
  return (await localforage.getItem('chats')) || [];
};

export const saveSettings = async (settings) => {
  await localforage.setItem('settings', settings);
};

export const loadSettings = async () => {
  return (await localforage.getItem('settings')) || {
    openaiKey: '',
    geminiKey: '',
    language: 'pt'
  };
};
