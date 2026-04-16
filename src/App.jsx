import { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import ChatSetup from './components/ChatSetup';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { isReady, mobileView, activeChatId } = useContext(AppContext);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  if (!isReady) return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
      {t('loading')}
    </div>
  );

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div className={`sidebar-container ${mobileView === 'main' ? 'hide-on-mobile' : ''}`}>
        <Sidebar onOpenSettings={() => setShowSettings(true)} />
      </div>
      
      <main className={`main-container ${mobileView === 'sidebar' ? 'hide-on-mobile' : ''}`}>
        {activeChatId ? (
          <ChatInterface />
        ) : (
          <ChatSetup />
        )}
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
