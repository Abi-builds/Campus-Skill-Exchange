import React, { useState } from 'react';
import { X, Send, Calendar, Clock, MapPin, Video, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';
import { StudentUser } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  peer: StudentUser;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionRequestModal: React.FC<Props> = ({ peer, isOpen, onClose }) => {
  const { sendSessionRequest, currentStudent } = useApp();

  // Tomorrow as default date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedSkill, setSelectedSkill] = useState<string>(
    peer.skillsToTeach[0] || 'General Mentoring'
  );
  const [preferredDate, setPreferredDate] = useState<string>(defaultDateStr);
  const [preferredTime, setPreferredTime] = useState<string>('16:00 - 17:00');
  const [sessionMode, setSessionMode] = useState<'in_person' | 'online'>('in_person');
  const [locationOrLink, setLocationOrLink] = useState<string>('Campus Central Library - Study Room 3');
  const [optionalMessage, setOptionalMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedSkill) {
      setError('Please select a skill to learn.');
      return;
    }
    if (!preferredDate) {
      setError('Please select a preferred date for the session.');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendSessionRequest({
        peerId: peer.id,
        peerName: peer.name,
        skill: selectedSkill,
        preferredDate,
        preferredTime,
        sessionMode,
        locationOrLink:
          sessionMode === 'in_person'
            ? locationOrLink || 'Campus Central Library'
            : 'https://meet.google.com/skill-exchange-demo',
        optionalMessage: optionalMessage.trim() || undefined,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit session request.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs"
            />
            <div>
              <h3 id="modal-title" className="text-base font-bold text-white">
                Request Learning Session
              </h3>
              <p className="text-xs text-emerald-100">
                Connecting with <span className="font-semibold text-white">{peer.name}</span> ({peer.department})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sender Context Banner */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
            <span>
              Requester: <strong className="text-slate-800">{currentStudent.name}</strong> ({currentStudent.regNo})
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
              Active Student
            </span>
          </div>

          {/* Skill Selector */}
          <div>
            <label
              htmlFor="skill-select"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-emerald-600" />
              <span>Skill You Want to Learn *</span>
            </label>
            <select
              id="skill-select"
              data-testid="skill-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              {peer.skillsToTeach.map((skill, idx) => (
                <option key={idx} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="session-date"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              >
                <Calendar size={14} className="text-emerald-600" />
                <span>Preferred Date *</span>
              </label>
              <input
                id="session-date"
                data-testid="session-date-input"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="session-time"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              >
                <Clock size={14} className="text-emerald-600" />
                <span>Preferred Time Slot *</span>
              </label>
              <select
                id="session-time"
                data-testid="session-time-select"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="15:00 - 16:00">03:00 PM - 04:00 PM</option>
                <option value="16:00 - 17:00">04:00 PM - 05:00 PM</option>
                <option value="17:00 - 18:00">05:00 PM - 06:00 PM</option>
                <option value="18:00 - 19:00">06:00 PM - 07:00 PM</option>
              </select>
            </div>
          </div>

          {/* Mode of Session */}
          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Session Mode
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSessionMode('in_person')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  sessionMode === 'in_person'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin size={14} className="text-emerald-600" />
                <span>Campus In-Person</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode('online')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  sessionMode === 'online'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Video size={14} className="text-teal-600" />
                <span>Online (Google Meet)</span>
              </button>
            </div>
          </div>

          {/* Location input for in_person */}
          {sessionMode === 'in_person' && (
            <div>
              <label
                htmlFor="session-location"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Proposed Campus Venue
              </label>
              <input
                id="session-location"
                type="text"
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                placeholder="e.g. Central Library 2nd Floor Discussion Room"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          )}

          {/* Optional Message Field (Required by Description) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="optional-message"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <MessageSquare size={14} className="text-emerald-600" />
                <span>Optional Note / Learning Goal</span>
                <span className="text-[11px] font-normal text-slate-400 capitalize">(Optional)</span>
              </label>
              <span className="text-[11px] text-slate-400">{optionalMessage.length}/250</span>
            </div>
            <textarea
              id="optional-message"
              data-testid="optional-message-input"
              rows={3}
              maxLength={250}
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              placeholder="e.g., Hi Keerthivasan! I would love to learn dynamic programming basics to help with our upcoming coding round..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Modal Footer / Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-request-button"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Session Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
