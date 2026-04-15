import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { X } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const { settings, setSettings } = useContext(AppContext);

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '400px', padding: '1.5rem', borderRadius: '0.75rem', position: 'relative'
      }}>
        <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={20} />
        </button>
        <h2 style={{ marginBottom: '1.5rem' }}>Configurações Globais</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>OpenAI API Key</label>
          <input 
            type="password" 
            name="openaiKey"
            value={settings.openaiKey}
            onChange={handleChange}
            className="input-field" 
            placeholder="sk-..."
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Google Gemini API Key</label>
          <input 
            type="password" 
            name="geminiKey"
            value={settings.geminiKey}
            onChange={handleChange}
            className="input-field" 
            placeholder="AIza..."
          />
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
          Salvar e Fechar
        </button>
      </div>
    </div>
  );
}
