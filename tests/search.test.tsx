import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { AppProvider } from '../src/context/AppContext';
import { db } from '../src/services/database';

describe('Story ID: SCRUM07-F002 - Peer Search & Matching', () => {
  beforeEach(() => {
    localStorage.clear();
    db.resetAll();
  });

  it('SCRUM07-F002-UI-001 AC1: searches for a skill and lists matching peer profiles', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Default tab is explore/search
    const searchInput = screen.getByTestId('skill-search-input');
    fireEvent.change(searchInput, { target: { value: 'Python' } });

    // Should find Keerthivasan U who teaches Python for AI
    await waitFor(() => {
      expect(screen.getByTestId('peer-card-user-2024506107')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Keerthivasan U' })).toBeInTheDocument();
    });
  });

  it('SCRUM07-F002-UI-001 AC2: displays empty-state message when no matching peer teaches the skill', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    const searchInput = screen.getByTestId('skill-search-input');
    // Search for a non-existent skill
    fireEvent.change(searchInput, { target: { value: 'NonExistentSkillXYZ' } });

    await waitFor(() => {
      const emptyState = screen.getByTestId('search-empty-state');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveTextContent(/No matching peers found for "NonExistentSkillXYZ"/i);
    });
  });
});
