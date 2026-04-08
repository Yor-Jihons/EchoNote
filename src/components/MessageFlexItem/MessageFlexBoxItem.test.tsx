import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageFlexBoxItem from './MessageFlexBoxItem';

describe('MessageFlexBoxItem', () => {
  const mockMessage = {
    id: 1,
    chat_id: 1,
    sender_id: 1, // Me
    message_txt: 'Hello **World**',
    updated_at: '2026-04-06 12:00:00',
    order_in_chat: 1,
    created_at: ""
  };

  const copyMock = vi.fn();
  const submitMock = vi.fn();

  it('renders Me as sender and renders markdown', () => {
    render(
      <MessageFlexBoxItem 
        index={0} 
        senderId={1} 
        message={mockMessage} 
        copyButton_click={copyMock} 
        submitButton_click={submitMock} 
      />
    );

    expect(screen.getByText('Me')).toBeInTheDocument();
    // Markdown **World** becomes <strong>World</strong>
    const body = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'strong' && content === 'World';
    });
    expect(body).toBeInTheDocument();
  });

  it('renders AI as sender when senderId is not 1', () => {
    render(
      <MessageFlexBoxItem 
        index={0} 
        senderId={2} 
        message={{ ...mockMessage, sender_id: 2 }} 
        copyButton_click={copyMock} 
        submitButton_click={submitMock} 
      />
    );

    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('switches to editing mode and submits', () => {
    render(
      <MessageFlexBoxItem 
        index={0} 
        senderId={1} 
        message={mockMessage} 
        copyButton_click={copyMock} 
        submitButton_click={submitMock} 
      />
    );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    const textarea = screen.getByDisplayValue('Hello **World**');
    fireEvent.input(textarea, { target: { value: 'Updated text' } });

    const completeButton = screen.getByText('完了');
    fireEvent.click(completeButton);

    expect(submitMock).toHaveBeenCalledWith(1, 'Updated text');
    expect(screen.getByText('Updated text')).toBeInTheDocument();
  });

  it('calls copyButton_click when copy is clicked', () => {
    render(
        <MessageFlexBoxItem 
          index={0} 
          senderId={1} 
          message={mockMessage} 
          copyButton_click={copyMock} 
          submitButton_click={submitMock} 
        />
      );
  
      const copyButton = screen.getByText('コピー');
      fireEvent.click(copyButton);
  
      expect(copyMock).toHaveBeenCalledWith('Hello **World**');
  });

  it('copies the updated text after editing', () => {
    render(
        <MessageFlexBoxItem 
          index={0} 
          senderId={1} 
          message={mockMessage} 
          copyButton_click={copyMock} 
          submitButton_click={submitMock} 
        />
      );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    const textarea = screen.getByDisplayValue('Hello **World**');
    fireEvent.input(textarea, { target: { value: 'Updated for Copy' } });

    const copyButton = screen.getByText('コピー');
    fireEvent.click(copyButton);

    expect(copyMock).toHaveBeenCalledWith('Updated for Copy');
  });

  it('abnormal: sanitizes malicious HTML in message_txt', () => {
    const maliciousMessage = {
        ...mockMessage,
        message_txt: '<img src=x onerror=alert(1)> **Normal**'
    };

    render(
        <MessageFlexBoxItem 
          index={0} 
          senderId={1} 
          message={maliciousMessage} 
          copyButton_click={copyMock} 
          submitButton_click={submitMock} 
        />
      );
    
    // The img tag with onerror should be sanitized
    const img = document.querySelector('img');
    if (img) {
        expect(img).not.toHaveAttribute('onerror');
    }
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });
});
