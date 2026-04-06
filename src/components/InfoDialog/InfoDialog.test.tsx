import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InfoDialog from './InfoDialog';
import ChatInfo from '../../types/ChatInfo';

describe('InfoDialog', () => {
  const mockChatInfo: ChatInfo = {
    id: 1,
    chat: {
      id: 1,
      chat_name: 'Test Chat',
      ai_type: 'Gemini',
      description_txt: 'Test Description',
      created_at: '2024-01-01 10:00:00',
      updated_at: '2024-01-01 10:00:00',
    },
    messages: [],
    summary: {
      id: 1,
      chat_id: 1,
      summary_txt: 'Test Summary',
      created_at: '2024-01-01 10:00:00',
      updated_at: '2024-01-01 10:00:00',
    }
  };

  const onCloseMock = vi.fn();

  it('renders correctly when open with full data (Normal)', () => {
    render(
      <InfoDialog 
        chatInfo={mockChatInfo} 
        isInfoDialogShow={true} 
        onClose={onCloseMock} 
      />
    );

    expect(screen.getByText('Test Chat')).toBeInTheDocument();
    expect(screen.getByText('Gemini')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01 10:00:00')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('open');
  });

  it('calls onClose when CLOSE button is clicked (Normal)', () => {
    render(
      <InfoDialog 
        chatInfo={mockChatInfo} 
        isInfoDialogShow={true} 
        onClose={onCloseMock} 
      />
    );

    const closeButton = screen.getByText('CLOSE');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('displays "---" when optional fields are empty (Abnormal/Edge)', () => {
    const emptyFieldsChatInfo: ChatInfo = {
      ...mockChatInfo,
      chat: {
        ...mockChatInfo.chat,
        ai_type: '',
        description_txt: '',
      }
    };

    render(
      <InfoDialog 
        chatInfo={emptyFieldsChatInfo} 
        isInfoDialogShow={true} 
        onClose={onCloseMock} 
      />
    );

    // Should show "---" for empty ai_type and description_txt
    // Using getAllByText since "---" might appear multiple times
    const placeholders = screen.getAllByText('---');
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });

  it('is hidden when isInfoDialogShow is false (Normal)', () => {
    render(
      <InfoDialog 
        chatInfo={mockChatInfo} 
        isInfoDialogShow={false} 
        onClose={onCloseMock} 
      />
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveAttribute('open');
  });
});
