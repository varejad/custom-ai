import { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { Plus, Settings, MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function Sidebar({ onOpenSettings }) {
  const { chats, activeChatId, setActiveChatId, deleteChat, setMobileView, updateChatName } = useContext(AppContext);
  const { t } = useTranslation();
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

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
        onClick={() => { setActiveChatId(null); setMobileView('main'); }}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        <Plus size={18} /> {t('newChatBtn')}
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }} className="chat-list">
        {chats.map(chat => {
          const isEditing = editingId === chat.id;

          return (
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
                transition: 'background-color 0.2s',
                minHeight: '40px'
              }}
              onClick={() => { setActiveChatId(chat.id); setMobileView('main'); }}
            >
              <MessageSquare size={16} style={{ marginRight: '0.5rem', minWidth: '16px', color: 'var(--text-muted)' }} />
              
              {isEditing ? (
                <input 
                  value={editTitle}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      updateChatName(chat.id, editTitle);
                      setEditingId(null);
                    }
                  }}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-field"
                  style={{ flex: 1, padding: '0.25rem', fontSize: '0.875rem', width: '100%', marginRight: '0.25rem' }}
                  autoFocus
                />
              ) : (
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {chat.title === 'Nova Conversa' ? t('newChatTitle') : chat.title}
                </span>
              )}

              {isEditing ? (
                <div style={{ display: 'flex', marginLeft: '0.25rem' }}>
                  <button 
                    className="btn-icon" 
                    style={{ padding: '0.25rem', color: 'var(--success-color)' }}
                    onClick={(e) => { e.stopPropagation(); updateChatName(chat.id, editTitle); setEditingId(null); }}
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    className="btn-icon" 
                    style={{ padding: '0.25rem', color: 'var(--error-color)' }}
                    onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', marginLeft: '0.25rem' }}>
                  <button 
                    className="btn-icon" 
                    style={{ padding: '0.25rem' }}
                    onClick={(e) => { e.stopPropagation(); setEditTitle(chat.title); setEditingId(chat.id); }}
                    title="Renomear"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="btn-icon" 
                    style={{ padding: '0.25rem' }}
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
