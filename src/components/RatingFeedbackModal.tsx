import React, { useState } from 'react';
import { X, Star, MessageSquare, AlertCircle, Award, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RatingFeedbackModal: React.FC = () => {
  const { showRatingModal, closeRatingModal, ratingSessionTarget, handleSubmitRating, currentStudent } =
    useApp();

  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!showRatingModal || !ratingSessionTarget) return null;

  // Determine who is being rated
  const ratedPeerName =
    currentStudent.id === ratingSessionTarget.requesterId
      ? ratingSessionTarget.peerName
      : ratingSessionTarget.requesterName;

  const quickPillClick = (text: string) => {
    setComment((prev) => (prev ? `${prev} ${text}` : text));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Business rule check (AC2 of SCRUM07-F003-BE-001)
    if (ratingSessionTarget.status !== 'Completed') {
      setError('Business Rule Error: Ratings can only be submitted for completed sessions.');
      return;
    }

    try {
      setIsSubmitting(true);
      await handleSubmitRating(score, comment);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit rating.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 id="rating-modal-title" className="text-base font-bold">
                Rate & Leave Feedback
              </h3>
              <p className="text-xs text-amber-100">
                Story: SCRUM07-F003-UI-001 • Peer Reputation & Badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeRatingModal}
            className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <div
              data-testid="rating-error-alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Session Overview Context */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Learning Topic:</span>
              <strong className="text-slate-900 font-bold">{ratingSessionTarget.skill}</strong>
            </div>
            <div className="flex justify-between">
              <span>Peer You Are Rating:</span>
              <strong className="text-emerald-700 font-bold">{ratedPeerName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Session Status:</span>
              <span className="font-semibold text-emerald-600">✓ Completed</span>
            </div>
          </div>

          {/* Star Rating Control */}
          <div className="text-center py-2">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Rating (1 - 5 Stars) *
            </span>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  data-testid={`star-rating-btn-${star}`}
                  onMouseEnter={() => setHoverScore(star)}
                  onMouseLeave={() => setHoverScore(null)}
                  onClick={() => setScore(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    size={32}
                    className={`${
                      (hoverScore !== null ? star <= hoverScore : star <= score)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 mt-2 block">
              {score === 5 && '🌟 Outstanding Session! Highly Recommended'}
              {score === 4 && '👍 Great Exchange! Very Helpful'}
              {score === 3 && '🙂 Good Session, Met Expectations'}
              {score === 2 && '😐 Needs Improvement'}
              {score === 1 && '👎 Not Satisfactory'}
            </span>
          </div>

          {/* Quick Compliment Chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick compliments:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Clear explanations! 💡',
                'Patient & supportive 🙌',
                'Great practical examples 💻',
                'Super punctual ⏰',
                'Would recommend! 🚀',
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickPillClick(pill)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Feedback Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Feedback Comment (Optional)
            </label>
            <textarea
              data-testid="rating-comment-input"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you enjoyed or learned from this peer session..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
            />
          </div>

          {/* Badge Trigger Note */}
          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
            <Award size={14} className="shrink-0 text-amber-600" />
            <span>
              Submitting positive feedback helps <strong>{ratedPeerName}</strong> earn the <em>Top Mentor</em> badge!
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeRatingModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-rating-button"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{isSubmitting ? 'Recording...' : 'Submit Rating & Feedback (AC1)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
