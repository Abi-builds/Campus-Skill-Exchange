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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl shadow-emerald-500/10 overflow-hidden text-white">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-slate-900 px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white/80 shadow-md"
            />
            <div>
              <h3 id="modal-title" className="text-base sm:text-lg font-black text-white">
                Request Learning Session
              </h3>
              <p className="text-xs text-emerald-200">
                Connect with <span className="font-bold text-white">{peer.name}</span> ({peer.department.split(' ')[0]})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Sender Context Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
            <span>
              Requester: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.regNo})
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
              Active Student
            </span>
          </div>

          {/* Skill Selector */}
          <div>
            <label
              htmlFor="skill-select"
              className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-emerald-400" />
              <span>Skill You Want to Learn *</span>
            </label>
            <select
              id="skill-select"
              data-testid="skill-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {peer.skillsToTeach.map((skill, idx) => (
                <option key={idx} value={skill} className="bg-slate-900 text-white">
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
                className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              >
                <Calendar size={14} className="text-emerald-400" />
                <span>Preferred Date *</span>
              </label>
              <input
                id="session-date"
                data-testid="session-date-input"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="session-time"
                className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              >
                <Clock size={14} className="text-emerald-400" />
                <span>Preferred Time Slot *</span>
              </label>
              <select
                id="session-time"
                data-testid="session-time-select"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="15:00 - 16:00" className="bg-slate-900 text-white">03:00 PM - 04:00 PM</option>
                <option value="16:00 - 17:00" className="bg-slate-900 text-white">04:00 PM - 05:00 PM</option>
                <option value="17:00 - 18:00" className="bg-slate-900 text-white">05:00 PM - 06:00 PM</option>
                <option value="18:00 - 19:00" className="bg-slate-900 text-white">06:00 PM - 07:00 PM</option>
              </select>
            </div>
          </div>

          {/* Mode of Session */}
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Session Mode
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSessionMode('in_person')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sessionMode === 'in_person'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <MapPin size={14} className="text-emerald-400" />
                <span>Campus In-Person</span>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode('online')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  sessionMode === 'online'
                    ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-md shadow-teal-500/20'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Video size={14} className="text-teal-400" />
                <span>Online (Meet)</span>
              </button>
            </div>
          </div>

          {/* Location input for in_person */}
          {sessionMode === 'in_person' && (
            <div>
              <label
                htmlFor="session-location"
                className="block text-xs font-bold text-slate-400 mb-1"
              >
                Proposed Campus Venue
              </label>
              <input
                id="session-location"
                type="text"
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                placeholder="e.g. Central Library 2nd Floor Discussion Room"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Optional Message Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="optional-message"
                className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <MessageSquare size={14} className="text-emerald-400" />
                <span>Optional Note / Learning Goal</span>
                <span className="text-[11px] font-normal text-slate-500 capitalize">(Optional)</span>
              </label>
              <span className="text-[11px] text-slate-500">{optionalMessage.length}/250</span>
            </div>
            <textarea
              id="optional-message"
              data-testid="optional-message-input"
              rows={3}
              maxLength={250}
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              placeholder="e.g., Hi Keerthivasan! I would love to learn dynamic programming basics to help with our upcoming coding round..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Modal Footer / Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-slate px-4 py-2 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-request-button"
              disabled={isSubmitting}
              className="btn-3d-emerald px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
