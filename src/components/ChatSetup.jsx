import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { HelpCircle } from 'lucide-react';

const HelpTooltip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginLeft: '0.5rem' }}>
      <button 
        className="btn-icon" 
        style={{ padding: 0, color: 'var(--text-muted)' }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        type="button"
      >
        <HelpCircle size={16} />
      </button>
      {show && (
        <div className="animate-fade-in" style={{
          position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)',
          padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem',
          width: 'max-content', maxWidth: '250px', zIndex: 10, textAlign: 'center', boxShadow: 'var(--shadow-md)'
        }}>
          {text}
        </div>
      )}
    </span>
  );
};

const modelsAvailable = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-3.1-pro-preview', 'gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview']
};

export default function ChatSetup() {
  const { createChat } = useContext(AppContext);
  const [formData, setFormData] = useState({
    provider: 'openai',
    model: 'gpt-4o',
    systemPrompt: 'Você é um assistente virtual útil e experiente.',
    temperature: 0.7,
    topK: 40,
    topP: 0.95
  });

  useEffect(() => {
    // If provider changes and current model isn't in the new provider's list, default to first
    if (!modelsAvailable[formData.provider].includes(formData.model)) {
      setFormData(prev => ({ ...prev, model: modelsAvailable[formData.provider][0] }));
    }
  }, [formData.provider, formData.model]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createChat(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Configurar Nova Conversa</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
            System Prompt
            <HelpTooltip text="Define o comportamento e as regras base da IA para esta conversa." />
          </label>
          <textarea 
            name="systemPrompt" 
            value={formData.systemPrompt} 
            onChange={handleChange} 
            className="textarea-field"
            style={{ minHeight: '100px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
              Provedor
            </label>
            <select name="provider" value={formData.provider} onChange={handleChange} className="select-field">
              <option value="openai">OpenAI</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
              Modelo da IA
              <HelpTooltip text="A versão da inteligência artificial que responderá suas perguntas." />
            </label>
            <select name="model" value={formData.model} onChange={handleChange} className="select-field">
              {modelsAvailable[formData.provider].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
              <span>Temperatura: {formData.temperature}</span>
              <HelpTooltip text="Valores perto de 0 geram respostas lógicas e repetitivas. Perto de 2 gera mais criatividade." />
            </label>
            <input 
              type="range" 
              name="temperature" 
              min="0" max="2" step="0.1" 
              value={formData.temperature} 
              onChange={handleChange} 
              style={{ width: '100%', accentColor: 'var(--accent-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
                <span>Top K: {formData.topK}</span>
                <HelpTooltip text="Quantas palavras prováveis a IA considera ao mesmo tempo. Menos = mais focado." />
              </label>
              <input 
                type="range" 
                name="topK" 
                min="1" max="100" step="1" 
                value={formData.topK} 
                onChange={handleChange} 
                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
                <span>Top P: {formData.topP}</span>
                <HelpTooltip text="Reduz drasticamente variações se configurado para valor muito baixo (0.1). Controla a massa de probabilidade total dos tokens." />
              </label>
              <input 
                type="range" 
                name="topP" 
                min="0" max="1" step="0.05" 
                value={formData.topP} 
                onChange={handleChange} 
                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: '600' }}>
          Iniciar Conversa
        </button>
      </form>
    </div>
  );
}
