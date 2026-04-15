import { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import ChatSetup from './components/ChatSetup';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { isReady, activeChatId } = useContext(AppContext);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  if (!isReady) return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
      {t('loading')}
    </div>
  );

  return (
    <>
      <Sidebar onOpenSettings={() => setShowSettings(true)} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeChatId ? (
          <ChatInterface />
        ) : (
          <ChatSetup />
        )}
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default App;
