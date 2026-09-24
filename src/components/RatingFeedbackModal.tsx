import React, { useState } from 'react';
import { X, Star, AlertCircle, Award, Check } from 'lucide-react';
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl shadow-amber-500/10 overflow-hidden text-white">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-orange-600 to-slate-900 px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 id="rating-modal-title" className="text-base sm:text-lg font-black text-white">
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
            className="p-2 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <div
              data-testid="rating-error-alert"
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Session Overview Context */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Learning Topic:</span>
              <strong className="text-white font-bold">{ratingSessionTarget.skill}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Peer You Are Rating:</span>
              <strong className="text-emerald-400 font-bold">{ratedPeerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Session Status:</span>
              <span className="font-bold text-emerald-400">✓ Completed</span>
            </div>
          </div>

          {/* Star Rating Control */}
          <div className="text-center py-3 bg-slate-950/50 rounded-2xl border border-slate-800">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Rating (1 - 5 Stars) *
            </span>
            <div className="flex items-center justify-center space-x-2.5">
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
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold text-amber-300 mt-2 block">
              {score === 5 && '🌟 Outstanding Session! Highly Recommended'}
              {score === 4 && '👍 Great Exchange! Very Helpful'}
              {score === 3 && '🙂 Good Session, Met Expectations'}
              {score === 2 && '😐 Needs Improvement'}
              {score === 1 && '👎 Not Satisfactory'}
            </span>
          </div>

          {/* Quick Compliment Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
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
                  className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Feedback Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Feedback Comment (Optional)
            </label>
            <textarea
              data-testid="rating-comment-input"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share what you enjoyed or learned from this peer session..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Badge Trigger Note */}
          <div className="text-[11px] text-amber-300 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 flex items-center gap-2">
            <Award size={15} className="shrink-0 text-amber-400" />
            <span>
              Submitting positive feedback helps <strong>{ratedPeerName}</strong> earn the <em>Top Mentor</em> badge!
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeRatingModal}
              className="btn-3d-slate px-4 py-2 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-rating-button"
              disabled={isSubmitting}
              className="btn-3d-amber px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
