import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './app/MainPage/page';
import './App.css';
import CommonLayout from './app/layout';
import ChatDetailPage from './app/ChatDetailPage/ChatDetailPage';
import { ApiProvider } from './contexts/ApiProvider';
import { ElectronApiClient } from './api/ElectronApiClient';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <ApiProvider api={ElectronApiClient}>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CommonLayout />}>
              <Route index element={<MainPage />} />
              <Route path="/chats/:chatId" element={<ChatDetailPage />} />
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </ApiProvider>
  );
}

export default App;
