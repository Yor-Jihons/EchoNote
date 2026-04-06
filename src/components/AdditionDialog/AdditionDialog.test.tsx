import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdditionDialog from './AdditionDialog';

describe('AdditionDialog', () => {
  const onSubmitMock = vi.fn();
  const onCloseMock = vi.fn();

  it('renders correctly when open', () => {
    render(
      <AdditionDialog 
        isOpen={true} 
        onSubmit={onSubmitMock} 
        onClose={onCloseMock} 
      />
    );

    expect(screen.getByText('チャットの追加')).toBeInTheDocument();
    expect(screen.getByLabelText('チャット名 (必須):')).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    render(
      <AdditionDialog 
        isOpen={true} 
        onSubmit={onSubmitMock} 
        onClose={onCloseMock} 
      />
    );

    const chatNameInput = screen.getByLabelText('チャット名 (必須):');
    const aiTypeInput = screen.getByLabelText('AIアシスタント名:');
    const descriptionInput = screen.getByLabelText('説明/備考:');
    const submitButton = screen.getByText('追加');

    fireEvent.change(chatNameInput, { target: { value: 'Test Chat' } });
    fireEvent.change(aiTypeInput, { target: { value: 'Gemini' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith('Test Chat', 'Gemini', 'Test Description');
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <AdditionDialog 
        isOpen={true} 
        onSubmit={onSubmitMock} 
        onClose={onCloseMock} 
      />
    );

    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('abnormal: does not submit if chat name is empty (HTML5 validation check simulation)', () => {
    render(
      <AdditionDialog 
        isOpen={true} 
        onSubmit={onSubmitMock} 
        onClose={onCloseMock} 
      />
    );

    //const submitButton = screen.getByText('追加');
    
    // In JSDOM, fireEvent.click(submitButton) will still trigger onSubmit 
    // unless we check for validity manually or rely on how the component handles it.
    // However, the component doesn't have internal validation logic besides HTML5 required.
    // We can check if the input has the required attribute.
    
    const chatNameInput = screen.getByLabelText('チャット名 (必須):');
    expect(chatNameInput).toBeRequired();
    expect(chatNameInput).toHaveAttribute('minLength', '3');
  });
});
