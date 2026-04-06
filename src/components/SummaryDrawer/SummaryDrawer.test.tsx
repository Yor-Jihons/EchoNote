import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SummaryDrawer from './SummaryDrawer';
import SummaryListItem from '../../types/SummaryListItem';

// Mock react-modern-drawer because it might have issues in JSDOM environment
vi.mock('react-modern-drawer', () => {
    return {
        default: ({ children, open }: { children: React.ReactNode, open: boolean }) => (
            <div data-testid="drawer-mock" data-open={open}>{open ? children : null}</div>
        )
    };
});

describe('SummaryDrawer', () => {
  const mockSummary: SummaryListItem = {
    id: 1,
    chat_id: 1,
    summary_txt: 'Initial Summary Content',
    created_at: '2024-01-01 10:00:00',
    updated_at: '2024-01-01 12:00:00',
  };

  const onInputMock = vi.fn();
  const onCloseMock = vi.fn();

  it('renders correctly in view mode (Normal)', () => {
    render(
      <SummaryDrawer 
        isSummaryDrawerOpen={true} 
        summary={mockSummary} 
        onInput={onInputMock} 
        onClose={onCloseMock} 
      />
    );

    expect(screen.getByText('Initial Summary Content')).toBeInTheDocument();
    expect(screen.getByText('最終更新日時: 2024-01-01 12:00:00')).toBeInTheDocument();
    expect(screen.getByText('編集モードへ')).toBeInTheDocument();
  });

  it('switches to edit mode and updates text (Normal)', () => {
    render(
      <SummaryDrawer 
        isSummaryDrawerOpen={true} 
        summary={mockSummary} 
        onInput={onInputMock} 
        onClose={onCloseMock} 
      />
    );

    const editButton = screen.getByText('編集モードへ');
    fireEvent.click(editButton);

    expect(screen.getByText('テキストモードへ')).toBeInTheDocument();
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Initial Summary Content');

    fireEvent.input(textarea, { target: { value: 'Updated Summary Content' } });
    expect(onInputMock).toHaveBeenCalledWith('Updated Summary Content');
  });

  it('sanitizes HTML content in view mode (Abnormal/Security)', () => {
    const maliciousSummary: SummaryListItem = {
      ...mockSummary,
      summary_txt: 'Safe Text <img src=x onerror=alert(1)> <script>console.log("xss")</script> <b>Bold</b>',
    };

    render(
      <SummaryDrawer 
        isSummaryDrawerOpen={true} 
        summary={maliciousSummary} 
        onInput={onInputMock} 
        onClose={onCloseMock} 
      />
    );

    // The bold tag should remain (standard DOMPurify config), but script and onerror should be removed
    expect(screen.getByText(/Safe Text/)).toBeInTheDocument();
    const boldElement = screen.getByText('Bold');
    expect(boldElement.tagName).toBe('B');
    
    // We can check if the script is NOT in the document
    const scripts = document.querySelectorAll('script');
    expect(scripts.length).toBe(0);
  });

  it('handles empty summary text correctly (Abnormal/Edge)', () => {
    const emptySummary: SummaryListItem = {
      ...mockSummary,
      summary_txt: '',
    };

    render(
      <SummaryDrawer 
        isSummaryDrawerOpen={true} 
        summary={emptySummary} 
        onInput={onInputMock} 
        onClose={onCloseMock} 
      />
    );

    // Check last updated is still there
    expect(screen.getByText('最終更新日時: 2024-01-01 12:00:00')).toBeInTheDocument();
    
    // Switch to edit mode and check textarea
    fireEvent.click(screen.getByText('編集モードへ'));
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('');
  });
});
