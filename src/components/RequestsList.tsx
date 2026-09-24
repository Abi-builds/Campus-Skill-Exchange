import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageSquare,
  Inbox,
  Send,
  Filter,
  Check,
  X,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RequestStatusBadge } from './RequestStatusBadge';

export const RequestsList: React.FC = () => {
  const {
    currentStudent,
    requests,
    handleAcceptRequest,
    handleDeclineRequest,
    handleCompleteSession,
    openRatingModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Accepted' | 'Completed'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const outgoingRequests = requests.filter((r) => r.requesterId === currentStudent.id);
  const incomingRequests = requests.filter((r) => r.peerId === currentStudent.id);

  const displayedList = (activeTab === 'outgoing' ? outgoingRequests : incomingRequests).filter(
    (r) => (statusFilter === 'ALL' ? true : r.status === statusFilter)
  );

  const onAccept = async (id: string) => {
    try {
      setProcessingId(id);
      await handleAcceptRequest(id);
    } finally {
      setProcessingId(null);
    }
  };

  const onDecline = async (id: string) => {
    try {
      setProcessingId(id);
      await handleDeclineRequest(id);
    } finally {
      setProcessingId(null);
    }
  };

  const onComplete = async (id: string) => {
    try {
      setProcessingId(id);
      await handleCompleteSession(id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bento-card overflow-hidden text-left">
      {/* Header and Tab Selector */}
      <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              SCRUM07-F002 • F003
            </span>
            <span className="text-xs text-slate-400 font-semibold">Exchanges Hub</span>
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>Learning Sessions Request Hub</span>
            <span className="text-xs bg-slate-800 text-emerald-400 font-black px-2.5 py-0.5 rounded-full border border-slate-700">
              {displayedList.length} Active
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active view: <strong className="text-white">{currentStudent.name}</strong> ({currentStudent.regNo})
          </p>
        </div>

        {/* Tab & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Tabs */}
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('outgoing')}
              data-testid="tab-outgoing-requests"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'outgoing'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send size={13} />
              <span>Sent ({outgoingRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('incoming')}
              data-testid="tab-incoming-requests"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'incoming'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Inbox size={13} />
              <span>Received ({incomingRequests.length})</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs">
            <Filter size={12} className="text-slate-500" />
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Status</option>
              <option value="Pending" className="bg-slate-900 text-white">Pending Only</option>
              <option value="Accepted" className="bg-slate-900 text-white">Accepted Only</option>
              <option value="Completed" className="bg-slate-900 text-white">Completed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Content */}
      <div className="p-6 space-y-4">
        {displayedList.length === 0 ? (
          <div className="text-center py-14 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-3 shadow-inner">
              {activeTab === 'outgoing' ? <Send size={24} /> : <Inbox size={24} />}
            </div>
            <h4 className="text-base font-bold text-slate-300">
              No {statusFilter !== 'ALL' ? statusFilter : ''} requests found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeTab === 'outgoing'
                ? "Go to 'Explore & Search' to find peers and request a learning session."
                : "No incoming requests right now. Switch persona in the top nav to send a request."}
            </p>
          </div>
        ) : (
          displayedList.map((req) => (
            <div
              key={req.id}
              data-testid={`request-card-${req.id}`}
              className="bg-slate-950/70 rounded-2xl border border-slate-800/90 p-5 hover:border-slate-700 transition-all text-left shadow-lg"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-black text-sm text-white">
                    Skill: <span className="text-emerald-400">{req.skill}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {req.id.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <RequestStatusBadge status={req.status} />
                </div>
              </div>

              {/* Meta details Bento row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  {activeTab === 'outgoing' ? (
                    <span>
                      Mentor/Peer: <strong className="text-white">{req.peerName}</strong>
                    </span>
                  ) : (
                    <span>
                      Requester: <strong className="text-white">{req.requesterName}</strong> ({req.requesterRegNo})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-emerald-400 shrink-0" />
                  <span>
                    {new Date(req.preferredDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Clock size={14} className="text-emerald-400 shrink-0 ml-1.5" />
                  <span>{req.preferredTime}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {req.sessionMode === 'in_person' ? (
                    <>
                      <MapPin size={14} className="text-teal-400 shrink-0" />
                      <span className="truncate">{req.locationOrLink || 'Campus Library'}</span>
                    </>
                  ) : (
                    <>
                      <Video size={14} className="text-teal-400 shrink-0" />
                      <span>Online Google Meet</span>
                    </>
                  )}
                </div>
              </div>

              {/* Optional message display */}
              {req.optionalMessage ? (
                <div className="mb-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                  <MessageSquare size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block text-[11px] mb-0.5">
                      Message from {req.requesterName}:
                    </span>
                    <p className="text-slate-300 italic">"{req.optionalMessage}"</p>
                  </div>
                </div>
              ) : (
                <div className="mb-2 text-[11px] text-slate-600 italic">
                  No optional message attached.
                </div>
              )}

              {/* ACTION 1: Accept/Decline (for Recipient on Pending) */}
              {activeTab === 'incoming' && req.status === 'Pending' && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/20">
                  <div className="text-xs text-emerald-300">
                    <span className="font-black">Pending Your Decision:</span> Accept this session to arrange to connect with {req.requesterName}.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid={`accept-button-${req.id}`}
                      onClick={() => onAccept(req.id)}
                      disabled={processingId === req.id}
                      className="btn-3d-emerald text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Check size={14} />
                      <span>{processingId === req.id ? 'Processing...' : 'Accept Session (AC2)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDecline(req.id)}
                      disabled={processingId === req.id}
                      className="btn-3d-slate text-xs px-3.5 py-2 flex items-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION 2: When Status is ACCEPTED -> Complete Session Trigger */}
              {req.status === 'Accepted' && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  <div className="text-xs text-indigo-300">
                    <span className="font-black">Session Confirmed!</span> Connect via {req.sessionMode === 'in_person' ? 'campus venue' : 'online meet'}.
                    Once finished, mark as completed to unlock rating & badges.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid={`btn-complete-session-${req.id}`}
                      onClick={() => onComplete(req.id)}
                      disabled={processingId === req.id}
                      className="btn-3d-indigo text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark Session as Completed</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION 3: When Status is COMPLETED -> Rate & Give Feedback Trigger */}
              {req.status === 'Completed' && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20">
                  <div className="text-xs text-amber-300">
                    <span className="font-black">Session Completed!</span> Completed on{' '}
                    {new Date(req.completedAt || req.updatedAt).toLocaleDateString()}.
                  </div>
                  <div>
                    <button
                      type="button"
                      data-testid={`btn-rate-session-${req.id}`}
                      onClick={() => openRatingModal(req)}
                      className="btn-3d-amber text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Star size={14} className="fill-slate-950 text-slate-950" />
                      <span>Rate & Leave Feedback (F003)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
