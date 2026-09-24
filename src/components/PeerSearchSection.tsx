import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Star,
  Award,
  Send,
  Filter,
  Sparkles,
  Frown,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { StudentUser } from '../types';
import { searchService } from '../services/searchService';
import { useApp } from '../context/AppContext';

export const PeerSearchSection: React.FC = () => {
  const { currentStudent, openRequestModal, selectPeer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [searchResults, setSearchResults] = useState<StudentUser[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    searchService.getAllAvailableSkills().then(setAvailableSkills);
  }, []);

  useEffect(() => {
    let isMounted = true;

    searchService
      .searchPeersBySkill(
        searchQuery,
        {
          department: departmentFilter,
          minRating: minRatingFilter,
        },
        currentStudent.id
      )
      .then((results) => {
        if (isMounted) {
          setSearchResults(results);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, departmentFilter, minRatingFilter, currentStudent.id]);

  const handleChipClick = (skill: string) => {
    setSearchQuery(skill === searchQuery ? '' : skill);
  };

  const categories = [
    { label: 'Python for AI', icon: '🤖' },
    { label: 'Figma UI Design', icon: '🎨' },
    { label: 'React.js', icon: '⚛️' },
    { label: 'Data Structures & Algorithms', icon: '📊' },
    { label: 'Video Editing (Premiere Pro)', icon: '🎬' },
    { label: 'Docker & DevOps', icon: '🐳' },
    { label: 'Public Speaking', icon: '🎙️' },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Bento Search Hero Box */}
      <div className="bento-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-xs shadow-emerald-500/10">
              <Sparkles size={12} className="text-amber-400" />
              <span>SCRUM07-F002 • Peer Matchmaker</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Live Campus Registry
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Find Your Next Peer Mentor 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search student peers by skills in their verified <strong className="text-emerald-400">'Can Teach'</strong> catalog. Arrange a 1-on-1 session and level up your skills together.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            data-testid="skill-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill name (e.g., Python, Figma, React, Data Structures, System Design)..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-12 pr-24 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Category Chips Bento Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <TrendingUp size={13} className="text-amber-400" />
            Trending:
          </span>
          {categories.map((cat, idx) => {
            const isSelected = searchQuery.toLowerCase() === cat.label.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                data-testid={`skill-chip-${cat.label}`}
                onClick={() => handleChipClick(cat.label)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-slate-500" />
              <span className="font-bold text-slate-400">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-950 text-slate-200 font-semibold rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Technology">Computer Technology</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400">Min Rating:</span>
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                className="bg-slate-950 text-slate-200 font-semibold rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars ⭐</option>
                <option value={4.5}>4.5+ Stars ⭐⭐</option>
                <option value={4.8}>4.8+ Stars ⭐⭐⭐</option>
              </select>
            </div>
          </div>

          <div className="text-slate-400 font-semibold">
            Showing <strong className="text-emerald-400">{searchResults.length}</strong> matching {searchResults.length === 1 ? 'peer' : 'peers'}
          </div>
        </div>
      </div>

      {/* RESULTS LIST OR EMPTY STATE (AC1 & AC2 of SCRUM07-F002-UI-001) */}
      {searchResults.length === 0 ? (
        // AC2: Given no matches exist for a searched skill, when the search runs, then an empty-state message is shown.
        <div
          data-testid="search-empty-state"
          className="bento-card p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
            <Frown size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">
            No matching peers found for "{searchQuery || 'selected criteria'}"
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
            None of your campus peers currently list this skill under <strong>'Can Teach'</strong>.
            Try clearing filters or search for another skill like <em>Python</em>, <em>Figma</em>, or <em>React</em>.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('ALL');
                setMinRatingFilter(0);
              }}
              className="btn-3d-slate px-5 py-2 text-xs font-bold cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        </div>
      ) : (
        // AC1: Given a student searches for a skill, when matches exist, then matching peer profiles are listed.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {searchResults.map((peer) => (
            <div
              key={peer.id}
              data-testid={`peer-card-${peer.id}`}
              className="bento-card p-5 flex flex-col justify-between group hover:border-emerald-500/50"
            >
              <div>
                {/* Peer Header Bento */}
                <div className="flex items-start space-x-3.5 mb-3.5">
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-md text-[9px] font-black">
                      PRO
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-white truncate group-hover:text-emerald-400 transition-colors">
                      {peer.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate font-medium">
                      {peer.department.split(' ')[0]} • {peer.year}
                    </p>
                    <div className="flex items-center text-xs font-bold text-amber-400 mt-1">
                      <Star size={13} className="fill-amber-400 mr-1" />
                      <span>{peer.rating}</span>
                      <span className="text-slate-500 font-normal ml-1">
                        ({peer.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 italic mb-3.5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  "{peer.bio}"
                </p>

                {/* Skills they CAN TEACH (The matching criteria) */}
                <div className="mb-3.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>Can Teach:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.skillsToTeach.map((s, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border transition-all ${
                          searchQuery && s.toLowerCase().includes(searchQuery.toLowerCase())
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs shadow-emerald-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badges preview */}
                {peer.badges.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
                    <Award size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate font-bold">
                      {peer.badges.map((b) => b.name).join(' • ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Action: 3D Tactile Button */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate">
                  {peer.availability.split('(')[0]}
                </span>

                <button
                  type="button"
                  data-testid={`btn-request-session-${peer.id}`}
                  onClick={() => {
                    selectPeer(peer);
                    openRequestModal(peer);
                  }}
                  className="btn-3d-emerald text-xs px-4 py-2 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Request Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
