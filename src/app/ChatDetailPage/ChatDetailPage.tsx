import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 仮のデータストア（本来はデータベースから取得します）
const dummyUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Danny', email: 'danny@example.com' },
  { id: 5, name: 'Eagle', email: 'eagle@example.com' },
  { id: 6, name: 'Fabre', email: 'fabre@example.com' },
  { id: 7, name: 'Ham', email: 'ham@example.com' },
];

function ChatDetailPage() {
  // useParamsフックを使ってURLのパラメータを取得
  const { chatId } = useParams<{ chatId: string }>();
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  useEffect(() => {
    // URLパラメータのIDからユーザーを検索
    // ここでipcRenderer.invokeを使ってデータベースからユーザー情報を取得する
    const foundUser = dummyUsers.find((u) => u.id === Number(chatId));
    setUser(foundUser || null);
  }, [chatId]);

  if (!user) {
    return <div>ユーザーが見つかりません。</div>;
  }

  return (
    <div>
      <h2>チャット詳細ページ</h2>
      <p>ID: {user.id}</p>
      <p>名前: {user.name}</p>
      <p>メールアドレス: {user.email}</p>
      <Link to="/users">一覧に戻る</Link>
    </div>
  );
}

export default ChatDetailPage;
