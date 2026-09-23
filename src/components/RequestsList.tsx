import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  Inbox,
  Send,
  Filter,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RequestStatusBadge } from './RequestStatusBadge';
import { SessionRequest } from '../types';

export const RequestsList: React.FC = () => {
  const { currentStudent, requests, handleAcceptRequest, handleDeclineRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Accepted'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter requests based on persona
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/30 overflow-hidden">
      {/* Header and Tab Selector */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Learning Sessions Request Hub</span>
            <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              {displayedList.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active view: <span className="font-semibold text-slate-800">{currentStudent.name}</span> ({currentStudent.regNo})
          </p>
        </div>

        {/* Tab & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Main Tabs */}
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('outgoing')}
              data-testid="tab-outgoing-requests"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'outgoing'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send size={13} />
              <span>Sent by You ({outgoingRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('incoming')}
              data-testid="tab-incoming-requests"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'incoming'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox size={13} />
              <span>Received by You ({incomingRequests.length})</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-xl text-xs">
            <Filter size={12} className="text-slate-400" />
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending Only</option>
              <option value="Accepted">Accepted Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {displayedList.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              {activeTab === 'outgoing' ? <Send size={22} /> : <Inbox size={22} />}
            </div>
            <h4 className="text-sm font-semibold text-slate-700">
              No {statusFilter !== 'ALL' ? statusFilter : ''} requests found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {activeTab === 'outgoing'
                ? "Click 'Request Learning Session' on any matched peer profile above to initiate a peer session."
                : "You have no incoming requests. Switch persona to another student in the top navigation to send a request to yourself."}
            </p>
          </div>
        ) : (
          displayedList.map((req) => (
            <div
              key={req.id}
              data-testid={`request-card-${req.id}`}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all text-left"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">
                    Skill: <span className="text-emerald-700">{req.skill}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {req.id.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <RequestStatusBadge status={req.status} />
                </div>
              </div>

              {/* Session Meta Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5">
                  {activeTab === 'outgoing' ? (
                    <span>
                      Mentor/Peer: <strong className="text-slate-800">{req.peerName}</strong>
                    </span>
                  ) : (
                    <span>
                      Requester: <strong className="text-slate-800">{req.requesterName}</strong> ({req.requesterRegNo})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-600 shrink-0" />
                  <span>{new Date(req.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <Clock size={13} className="text-emerald-600 shrink-0 ml-1" />
                  <span>{req.preferredTime}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {req.sessionMode === 'in_person' ? (
                    <>
                      <MapPin size={13} className="text-teal-600 shrink-0" />
                      <span className="truncate">{req.locationOrLink || 'Campus Library'}</span>
                    </>
                  ) : (
                    <>
                      <Video size={13} className="text-teal-600 shrink-0" />
                      <span>Online Meet</span>
                    </>
                  )}
                </div>
              </div>

              {/* Optional Message Display (Description requirement) */}
              {req.optionalMessage ? (
                <div className="mb-3 bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 flex items-start gap-2 text-xs">
                  <MessageSquare size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-900 block text-[11px] mb-0.5">
                      Message from {req.requesterName}:
                    </span>
                    <p className="text-slate-700 italic">"{req.optionalMessage}"</p>
                  </div>
                </div>
              ) : (
                <div className="mb-2 text-[11px] text-slate-400 italic">
                  No optional message attached.
                </div>
              )}

              {/* AC2 Acceptance Action for Recipient */}
              {activeTab === 'incoming' && req.status === 'Pending' && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold">Pending Your Decision:</span> Accepts this session to connect with {req.requesterName}.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid={`accept-button-${req.id}`}
                      onClick={() => onAccept(req.id)}
                      disabled={processingId === req.id}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check size={14} />
                      <span>{processingId === req.id ? 'Processing...' : 'Accept Session (AC2)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDecline(req.id)}
                      disabled={processingId === req.id}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      <X size={14} />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status Notice when Accepted */}
              {req.status === 'Accepted' && (
                <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>
                      <strong>Session Accepted!</strong> Both {req.requesterName} and {req.peerName} can now connect.
                    </span>
                  </div>
                  {req.sessionMode === 'online' && (
                    <a
                      href={req.locationOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      <span>Open Meeting</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
