import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './app/MainPage/page';
import './App.css';
import CommonLayout from './app/layout';
import ChatDetailPage from './app/ChatDetailPage/ChatDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/chats/:chatId" element={<ChatDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;