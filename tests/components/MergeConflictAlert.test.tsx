import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

// Import the real component from the repo root
import MergeConflictAlert, { ServerMeta } from '../../components/ui/MergeConflictAlert';

describe('MergeConflictAlert (integration)', () => {
  it('renders nothing when serverMeta is falsy', () => {
    const { container } = render(
      // @ts-ignore allow missing callbacks for this case
      <MergeConflictAlert serverMeta={null} onApplyServer={() => {}} onApplyClient={() => {}} onAttemptMerge={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('displays server info and calls handlers when buttons clicked', () => {
    const meta: ServerMeta = {
      updatedAt: new Date().toISOString(),
      userId: 'user_123',
      payload: { text: 'server content' },
    };

    const onServer = vi.fn();
    const onClient = vi.fn();
    const onMerge = vi.fn();

    render(
      <MergeConflictAlert
        serverMeta={meta}
        onApplyServer={onServer}
        onApplyClient={onClient}
        onAttemptMerge={onMerge}
      />
    );

    // Basic assertions
    expect(screen.getByTestId('merge-conflict-alert')).toBeInTheDocument();
    expect(screen.getByText(/Merge Conflict Detected/i)).toBeInTheDocument();

    // Buttons should exist and call handlers
    const loadBtn = screen.getByTestId('btn-load-server');
    const overBtn = screen.getByTestId('btn-overwrite');
    const mergeBtn = screen.getByTestId('btn-merge');

    fireEvent.click(loadBtn);
    fireEvent.click(overBtn);
    fireEvent.click(mergeBtn);

    expect(onServer).toHaveBeenCalledTimes(1);
    expect(onClient).toHaveBeenCalledTimes(1);
    expect(onMerge).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('payload-summary')).toBeInTheDocument();
  });
});
