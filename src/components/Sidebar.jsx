import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Plus, Settings, MessageSquare, Trash2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Sidebar({ onOpenSettings }) {
  const { chats, activeChatId, setActiveChatId, deleteChat } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '0.5rem'
    }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        {t('sidebarTitle')}
      </h1>
      <button 
        className="btn btn-primary" 
        onClick={() => setActiveChatId(null)}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        <Plus size={18} /> {t('newChatBtn')}
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }} className="chat-list">
        {chats.map(chat => (
          <div 
            key={chat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              backgroundColor: chat.id === activeChatId ? 'var(--bg-tertiary)' : 'transparent',
              marginBottom: '0.25rem',
              transition: 'background-color 0.2s'
            }}
            onClick={() => setActiveChatId(chat.id)}
          >
            <MessageSquare size={16} style={{ marginRight: '0.5rem', minWidth: '16px', color: 'var(--text-muted)' }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
              {chat.title === 'Nova Conversa' ? t('newChatTitle') : chat.title}
            </span>
            <button 
              className="btn-icon" 
              style={{ padding: '0.25rem' }}
              onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button 
        className="btn btn-secondary" 
        onClick={onOpenSettings}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        <Settings size={18} /> {t('globalSettingsBtn')}
      </button>
    </aside>
  );
}
