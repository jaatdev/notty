import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MergeConflictAlert from '../MergeConflictAlert';

describe('MergeConflictAlert', () => {
  it('renders nothing when serverMeta is falsy', () => {
    const { container } = render(
      // @ts-ignore allow missing callbacks for this case
      <MergeConflictAlert serverMeta={null} onApplyServer={() => {}} onApplyClient={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('displays server info and calls handlers when buttons clicked', () => {
    const serverMeta = {
      updatedAt: new Date().toISOString(),
      userId: 'user_123',
      payload: { text: 'server content' },
    };

    const applyServer = vi.fn();
    const applyClient = vi.fn();
    const attemptMerge = vi.fn();

    render(
      <MergeConflictAlert
        serverMeta={serverMeta}
        onApplyServer={applyServer}
        onApplyClient={applyClient}
        onAttemptMerge={attemptMerge}
      />
    );

    // content checks
    expect(screen.getByText(/Merge Conflict Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/user_123/i)).toBeInTheDocument();

    // buttons
  const loadBtn = screen.getByTestId('btn-load-server');
  const overBtn = screen.getByTestId('btn-overwrite');
  const mergeBtn = screen.getByTestId('btn-merge');

    fireEvent.click(loadBtn);
    fireEvent.click(overBtn);
    fireEvent.click(mergeBtn);

    expect(applyServer).toHaveBeenCalledTimes(1);
    expect(applyClient).toHaveBeenCalledTimes(1);
    expect(attemptMerge).toHaveBeenCalledTimes(1);
  });
});
