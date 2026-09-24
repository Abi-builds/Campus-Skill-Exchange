import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Star,
  Award,
  Send,
  Filter,
  Sparkles,
  MapPin,
  Calendar,
  Frown,
  CheckCircle2,
  Users,
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
  const [isLoading, setIsLoading] = useState(false);

  // Load available skills chips
  useEffect(() => {
    searchService.getAllAvailableSkills().then(setAvailableSkills);
  }, []);

  // Perform search whenever query or filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

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
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, departmentFilter, minRatingFilter, currentStudent.id]);

  const handleChipClick = (skill: string) => {
    setSearchQuery(skill === searchQuery ? '' : skill);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Search Header & Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md shadow-slate-200/40">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              SCRUM07-F002-UI-001
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Core Discovery Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Find Peers Ready to Teach You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search peers by specific skills listed in their verified <strong>'Can Teach'</strong> catalog.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            data-testid="skill-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill name (e.g., Python, Figma, React, Data Structures, System Design)..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-24 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Popular Skills Quick Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            Popular:
          </span>
          {availableSkills.slice(0, 7).map((skill, idx) => (
            <button
              key={idx}
              type="button"
              data-testid={`skill-chip-${skill}`}
              onClick={() => handleChipClick(skill)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                searchQuery.toLowerCase() === skill.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-slate-400" />
              <span className="font-semibold text-slate-600">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-100 font-medium text-slate-700 rounded-lg px-2.5 py-1 border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Technology">Computer Technology</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Min Rating:</span>
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                className="bg-slate-100 font-medium text-slate-700 rounded-lg px-2.5 py-1 border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars ⭐</option>
                <option value={4.5}>4.5+ Stars ⭐⭐</option>
                <option value={4.8}>4.8+ Stars ⭐⭐⭐</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500 font-medium">
            Found <strong className="text-slate-800">{searchResults.length}</strong> matching {searchResults.length === 1 ? 'peer' : 'peers'}
          </div>
        </div>
      </div>

      {/* RESULTS LIST OR EMPTY STATE (AC1 & AC2 of SCRUM07-F002-UI-001) */}
      {searchResults.length === 0 ? (
        // AC2: Given no matches exist for a searched skill, when the search runs, then an empty-state message is shown.
        <div
          data-testid="search-empty-state"
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Frown size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No matching peers found for "{searchQuery || 'selected criteria'}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            None of your campus peers currently list this skill under <strong>'Can Teach'</strong>.
            Try clearing filters or search for another skill like <em>Python</em>, <em>Figma</em>, or <em>React</em>.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('ALL');
                setMinRatingFilter(0);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
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
              className="bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/30 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Peer Header */}
                <div className="flex items-start space-x-3.5 mb-3.5">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500/80 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {peer.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {peer.department.split(' ')[0]} • {peer.year}
                    </p>
                    <div className="flex items-center text-xs font-bold text-amber-500 mt-1">
                      <Star size={13} className="fill-amber-400 mr-1" />
                      <span>{peer.rating}</span>
                      <span className="text-slate-400 font-normal ml-1">
                        ({peer.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 italic mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{peer.bio}"
                </p>

                {/* Skills they CAN TEACH (The matching criteria) */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <BookOpen size={12} className="text-emerald-600" />
                    <span>Can Teach:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {peer.skillsToTeach.map((s, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          searchQuery && s.toLowerCase().includes(searchQuery.toLowerCase())
                            ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badges preview */}
                {peer.badges.length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/70">
                    <Award size={12} className="text-amber-600 shrink-0" />
                    <span className="truncate font-semibold">
                      {peer.badges.map((b) => b.name).join(' • ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 truncate">
                  Available: {peer.availability.split('(')[0]}
                </span>

                <button
                  type="button"
                  data-testid={`btn-request-session-${peer.id}`}
                  onClick={() => {
                    selectPeer(peer);
                    openRequestModal(peer);
                  }}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Send size={12} />
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
