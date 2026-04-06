import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ChatItem4AllChats from './ChatItem4AllChats';

describe('ChatItem4AllChats', () => {
  const mockChatItem = {
    id: 1,
    chat_name: 'Test Chat Name',
    ai_type: 'Gemini',
    description: 'Test description',
    updated_at: '2026-04-06 12:00:00',
    description_txt:  "",
    created_at: ""
  };

  it('renders chat item with ID and name', () => {
    render(
      <MemoryRouter>
        <ChatItem4AllChats chatItem={mockChatItem} idx={0} />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveTextContent('1: Test Chat Name');
    expect(linkElement).toHaveAttribute('href', '/chats/1');
  });

  it('abnormal: handles empty or missing data (not crashing)', () => {
    const incompleteChatItem = {
        id: 0,
        chat_name: '',
        ai_type: '',
        description: '',
        updated_at: '',
        description_txt:  "",
        created_at: ""
    };
    render(
      <MemoryRouter>
        <ChatItem4AllChats chatItem={incompleteChatItem} idx={1} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
