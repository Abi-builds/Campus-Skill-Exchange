import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { AppProvider } from '../src/context/AppContext';
import { db } from '../src/services/database';

describe('Story ID: SCRUM07-F001 - Student Skill Profile', () => {
  beforeEach(() => {
    localStorage.clear();
    db.resetAll();
  });

  it('SCRUM07-F001-UI-001 AC2: validates that at least one skill must be listed when saving profile', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // 1. Navigate to My Profile tab
    const profileTab = screen.getByTestId('nav-tab-profile');
    fireEvent.click(profileTab);

    // 2. Open edit profile modal
    const editBtn = await screen.findByTestId('btn-open-edit-profile');
    fireEvent.click(editBtn);

    // 3. Clear all teach and learn skills
    const clearBtn = screen.getByText(/Clear all skills/i);
    fireEvent.click(clearBtn);

    // 4. Attempt to save with 0 skills
    const saveBtn = screen.getByTestId('save-profile-button');
    fireEvent.click(saveBtn);

    // Verify validation message is shown (AC2)
    await waitFor(() => {
      const errorAlert = screen.getByTestId('profile-validation-error');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(/at least one skill you can teach or want to learn/i);
    });
  });

  it('SCRUM07-F001-UI-001 AC1: saving profile with skills updates profile and makes it searchable', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // 1. Go to Profile
    const profileTab = screen.getByTestId('nav-tab-profile');
    fireEvent.click(profileTab);

    // 2. Open edit modal
    const editBtn = await screen.findByTestId('btn-open-edit-profile');
    fireEvent.click(editBtn);

    // 3. Add a new unique teach skill: "Quantum Computing"
    const teachInput = screen.getByTestId('input-teach-skill');
    fireEvent.change(teachInput, { target: { value: 'Quantum Computing' } });
    const addTeachBtn = screen.getByTestId('btn-add-teach-skill');
    fireEvent.click(addTeachBtn);

    expect(screen.getByTestId('teach-skill-tag-Quantum Computing')).toBeInTheDocument();

    // 4. Save profile
    const saveBtn = screen.getByTestId('save-profile-button');
    fireEvent.click(saveBtn);

    // 5. Verify modal closes and skill appears on profile
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Quantum Computing')).toBeInTheDocument();
  });
});
