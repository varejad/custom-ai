import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { X, HelpCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

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

export default function ChatSettingsModal({ chat, onClose }) {
  const { updateChatConfig } = useContext(AppContext);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ topP: 0.95, ...chat.config });

  useEffect(() => {
    // If provider changes and current model isn't in the new provider's list, default to first
    if (!modelsAvailable[formData.provider].includes(formData.model)) {
      setFormData(prev => ({ ...prev, model: modelsAvailable[formData.provider][0] }));
    }
  }, [formData.provider, formData.model]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateChatConfig(chat.id, formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '500px', maxWidth: '90vw', padding: '2rem', borderRadius: '1rem', position: 'relative'
      }}>
        <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem' }} type="button">
          <X size={20} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{t('editChatSettings')}</h2>
        
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: '0.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>
              {t('systemPrompt')}
              <HelpTooltip text={t('systemPromptTooltip')} />
            </label>
            <textarea 
              name="systemPrompt" 
              value={formData.systemPrompt} 
              onChange={handleChange} 
              className="textarea-field"
              style={{ minHeight: '80px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>{t('provider')}</label>
              <select name="provider" value={formData.provider} onChange={handleChange} className="select-field">
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500' }}>{t('model')}</label>
              <select name="model" value={formData.model} onChange={handleChange} className="select-field">
                {modelsAvailable[formData.provider].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
              <span>{t('temperature')}: {formData.temperature}</span>
            </label>
            <input type="range" name="temperature" min="0" max="2" step="0.1" value={formData.temperature} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--accent-color)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
               <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
                <span>{t('topK')}: {formData.topK}</span>
              </label>
              <input type="range" name="topK" min="1" max="100" step="1" value={formData.topK} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--accent-color)' }} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontWeight: '500', justifyContent: 'space-between' }}>
                <span>{t('topP')}: {formData.topP}</span>
                <HelpTooltip text={t('topPTooltip')} />
              </label>
              <input type="range" name="topP" min="0" max="1" step="0.05" value={formData.topP} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--accent-color)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop:'0.5rem' }}>
            {t('saveChangesBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}
