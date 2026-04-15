import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { callLLM } from '../api/llmClient';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Settings2 } from 'lucide-react';
import ChatSettingsModal from './ChatSettingsModal';

export default function ChatInterface() {
  const { activeChat, addMessage, settings } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgDesc = input.trim();
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: userMsgDesc };
    addMessage(activeChat.id, userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const { provider, model, systemPrompt, temperature, topK, topP } = activeChat.config;
      const apiKey = provider === 'gemini' ? settings.geminiKey : settings.openaiKey;
      
      const assistantResponse = await callLLM({
        provider, model, systemPrompt, temperature, topK, topP,
        messages: [...activeChat.messages, userMsg],
        apiKey
      });

      addMessage(activeChat.id, { id: crypto.randomUUID(), role: 'assistant', content: assistantResponse });
    } catch (error) {
      addMessage(activeChat.id, { id: crypto.randomUUID(), role: 'assistant', content: `**Erro**: ${error.message}. Por favor, verifique sua API Key nas configurações.` });
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header Info */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span><strong>Modelo:</strong> {activeChat.config.model}</span>
          <span><strong>Temp:</strong> {activeChat.config.temperature}</span>
          <span><strong>Top P:</strong> {activeChat.config.topP || 0.95}</span>
        </div>
        <button className="btn-icon" onClick={() => setShowSettings(true)} title="Editar Configurações da Conversa" style={{ padding: '0.25rem' }}>
          <Settings2 size={18} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeChat.messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Bot size={48} style={{ color: 'var(--accent-color)', marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Pronto para conversar!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                System Prompt: "{activeChat.config.systemPrompt}"
              </p>
            </div>
          )}
          
          {activeChat.messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div className="animate-fade-in" style={{
                maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '1rem',
                backgroundColor: msg.role === 'user' ? 'var(--accent-color)' : 'var(--bg-secondary)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '1rem',
                boxShadow: 'var(--shadow-sm)',
                lineHeight: '1.6'
              }}>
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', borderBottomLeftRadius: '0' }}>
                <span className="pulsing-dots">Pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            placeholder="Digite sua mensagem ao modelo..."
            style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '2rem', backgroundColor: 'var(--bg-secondary)', paddingRight: '4rem' }}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="btn btn-primary" 
            style={{ borderRadius: '50%', padding: '0.75rem', position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', minWidth:'40px', height:'40px' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {showSettings && <ChatSettingsModal chat={activeChat} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
