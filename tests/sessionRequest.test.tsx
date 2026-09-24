import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { AppProvider } from '../src/context/AppContext';
import { db } from '../src/services/database';

describe('Story ID: SCRUM07-F002-UI-002 - Peer Session Request Screen', () => {
  beforeEach(() => {
    localStorage.clear();
    db.resetAll();
  });

  it('renders peer search results and opens request modal with optional message field', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Verify peer card is displayed
    const peerCard = await screen.findByTestId('peer-card-user-2024506107');
    expect(peerCard).toBeInTheDocument();
    expect(screen.getByText('Keerthivasan U')).toBeInTheDocument();

    // Verify request session button
    const requestBtn = screen.getByTestId('btn-request-session-user-2024506107');
    expect(requestBtn).toBeInTheDocument();
    fireEvent.click(requestBtn);

    // Verify modal is open with optional message input
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Request Learning Session/i })).toBeInTheDocument();
    expect(screen.getByTestId('optional-message-input')).toBeInTheDocument();
  });

  it('AC1: sends request with optional message, creates request with status "Pending", and notifies recipient', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // 1. Open request modal for Keerthivasan
    const requestBtn = await screen.findByTestId('btn-request-session-user-2024506107');
    fireEvent.click(requestBtn);

    // 2. Fill optional message
    const messageInput = screen.getByTestId('optional-message-input');
    fireEvent.change(messageInput, {
      target: { value: 'Hi Keerthivasan, I need help with Graph algorithms for IOC project.' },
    });
    expect(messageInput).toHaveValue(
      'Hi Keerthivasan, I need help with Graph algorithms for IOC project.'
    );

    // 3. Submit request
    const submitBtn = screen.getByTestId('submit-request-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // 4. Switch to Sessions Hub tab to verify outgoing pending request (AC1)
    const requestsTab = screen.getByTestId('nav-tab-requests');
    fireEvent.click(requestsTab);

    await waitFor(() => {
      const badge = screen.getByTestId('status-badge-pending');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent(/Pending/i);
    });

    expect(
      screen.getByText(
        /"Hi Keerthivasan, I need help with Graph algorithms for IOC project."/i
      )
    ).toBeInTheDocument();

    // 5. Switch to recipient persona (Keerthivasan U) to verify notification was delivered
    const personaSelect = screen.getByLabelText(/Active Student Persona/i);
    fireEvent.change(personaSelect, { target: { value: 'user-2024506107' } });

    // Verify notification badge shows 1 unread notification
    await waitFor(() => {
      const badge = screen.getByTestId('notification-badge');
      expect(badge).toHaveTextContent('1');
    });
  });

  it('AC2: recipient accepts request, changing status to "Accepted" for both students', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Step 1: Send request as Student A (Abinaya K)
    const requestBtn = await screen.findByTestId('btn-request-session-user-2024506107');
    fireEvent.click(requestBtn);

    const messageInput = screen.getByTestId('optional-message-input');
    fireEvent.change(messageInput, {
      target: { value: 'Looking forward to our session!' },
    });

    const submitBtn = screen.getByTestId('submit-request-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Step 2: Switch to recipient persona (Keerthivasan U)
    const personaSelect = screen.getByLabelText(/Active Student Persona/i);
    fireEvent.change(personaSelect, { target: { value: 'user-2024506107' } });

    // Step 3: Navigate to Session Hub tab and click "Received by You"
    const requestsTab = screen.getByTestId('nav-tab-requests');
    fireEvent.click(requestsTab);

    const incomingTab = screen.getByTestId('tab-incoming-requests');
    fireEvent.click(incomingTab);

    // Step 4: Recipient clicks "Accept Session"
    const acceptBtn = await screen.findByRole('button', { name: /Accept Session/i });
    expect(acceptBtn).toBeInTheDocument();
    fireEvent.click(acceptBtn);

    // Step 5: Verify status changes to 'Accepted' (AC2)
    await waitFor(() => {
      expect(screen.getByTestId('status-badge-accepted')).toBeInTheDocument();
    });

    // Step 6: Switch back to requester (Abinaya K) and verify they also see 'Accepted'
    fireEvent.change(personaSelect, { target: { value: 'user-2024506117' } });
    const outgoingTab = screen.getByTestId('tab-outgoing-requests');
    fireEvent.click(outgoingTab);

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-accepted')).toBeInTheDocument();
    });
  });
});
