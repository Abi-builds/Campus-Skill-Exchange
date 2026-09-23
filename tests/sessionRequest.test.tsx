import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { AppProvider } from '../src/context/AppContext';
import { resetDemoData } from '../src/services/sessionService';

describe('Story ID: SCRUM07-F002-UI-002 - Peer Session Request Screen', () => {
  beforeEach(() => {
    resetDemoData();
    localStorage.clear();
  });

  it('renders peer profile screen with skills, badges, and "Request Learning Session" CTA', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Verify Peer Profile is displayed
    expect(screen.getByText(/Matched Peer Profile Screen/i)).toBeInTheDocument();
    expect(screen.getByText('Keerthivasan U')).toBeInTheDocument();
    expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument();

    // Verify Primary Action Button
    const requestBtn = screen.getByTestId('open-request-modal-button');
    expect(requestBtn).toBeInTheDocument();
    expect(requestBtn).toHaveTextContent(/Request Learning Session/i);
  });

  it('AC1: sends request with optional message, creates request with status "Pending", and notifies recipient', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // 1. Open request modal
    const requestBtn = screen.getByTestId('open-request-modal-button');
    fireEvent.click(requestBtn);

    // Verify modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Request Learning Session/i })).toBeInTheDocument();

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

    // 4. Verify request appears in "Sent by You" tab with status 'Pending' (AC1)
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
    const requestBtn = screen.getByTestId('open-request-modal-button');
    fireEvent.click(requestBtn);

    const messageInput = screen.getByTestId('optional-message-input');
    fireEvent.change(messageInput, {
      target: { value: 'Looking forward to our session!' },
    });

    const submitBtn = screen.getByTestId('submit-request-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-pending')).toBeInTheDocument();
    });

    // Step 2: Switch to recipient persona (Keerthivasan U)
    const personaSelect = screen.getByLabelText(/Active Student Persona/i);
    fireEvent.change(personaSelect, { target: { value: 'user-2024506107' } });

    // Switch to "Received by You" tab
    const incomingTab = screen.getByTestId('tab-incoming-requests');
    fireEvent.click(incomingTab);

    // Step 3: Recipient clicks "Accept Session"
    const acceptBtn = await screen.findByRole('button', { name: /Accept Session/i });
    expect(acceptBtn).toBeInTheDocument();
    fireEvent.click(acceptBtn);

    // Step 4: Verify status changes to 'Accepted' (AC2)
    await waitFor(() => {
      expect(screen.getByTestId('status-badge-accepted')).toBeInTheDocument();
    });
    expect(screen.getByText(/Session Accepted!/i)).toBeInTheDocument();

    // Step 5: Switch back to requester (Abinaya K) and verify they also see 'Accepted'
    fireEvent.change(personaSelect, { target: { value: 'user-2024506117' } });
    const outgoingTab = screen.getByTestId('tab-outgoing-requests');
    fireEvent.click(outgoingTab);

    await waitFor(() => {
      expect(screen.getByTestId('status-badge-accepted')).toBeInTheDocument();
    });
  });
});
