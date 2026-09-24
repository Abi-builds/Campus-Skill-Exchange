import React, { useState } from 'react';
import { X, Plus, BookOpen, AlertCircle, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileEditModal: React.FC = () => {
  const { currentStudent, showProfileEditModal, closeProfileEditModal, updateStudentProfile } =
    useApp();

  const [name, setName] = useState(currentStudent.name);
  const [department, setDepartment] = useState(currentStudent.department);
  const [year, setYear] = useState(currentStudent.year);
  const [bio, setBio] = useState(currentStudent.bio);
  const [availability, setAvailability] = useState(currentStudent.availability);

  const [teachSkills, setTeachSkills] = useState<string[]>([...currentStudent.skillsToTeach]);
  const [learnSkills, setLearnSkills] = useState<string[]>([...currentStudent.skillsToLearn]);

  const [newTeachInput, setNewTeachInput] = useState('');
  const [newLearnInput, setNewLearnInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!showProfileEditModal) return null;

  const handleAddTeachSkill = () => {
    const trimmed = newTeachInput.trim();
    if (trimmed && !teachSkills.includes(trimmed)) {
      setTeachSkills([...teachSkills, trimmed]);
      setNewTeachInput('');
      setValidationError(null);
    }
  };

  const handleRemoveTeachSkill = (skill: string) => {
    setTeachSkills(teachSkills.filter((s) => s !== skill));
  };

  const handleAddLearnSkill = () => {
    const trimmed = newLearnInput.trim();
    if (trimmed && !learnSkills.includes(trimmed)) {
      setLearnSkills([...learnSkills, trimmed]);
      setNewLearnInput('');
      setValidationError(null);
    }
  };

  const handleRemoveLearnSkill = (skill: string) => {
    setLearnSkills(learnSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // AC2 Validation Check: Student saves profile with no skills listed
    if (teachSkills.length === 0 && learnSkills.length === 0) {
      setValidationError(
        'Validation Error: You must list at least one skill you can teach or want to learn before saving your profile.'
      );
      return;
    }

    try {
      setIsSaving(true);
      await updateStudentProfile({
        name,
        department,
        year,
        bio,
        availability,
        skillsToTeach: teachSkills,
        skillsToLearn: learnSkills,
      });
      setIsSaving(false);
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to update profile.');
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl shadow-emerald-500/10 overflow-hidden text-white">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-slate-900 px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 id="profile-modal-title" className="text-base sm:text-lg font-black text-white">
              Edit Student Skill Profile
            </h3>
            <p className="text-xs text-emerald-200">
              Story: SCRUM07-F001-UI-001 • Profile & Skills Management
            </p>
          </div>
          <button
            type="button"
            onClick={closeProfileEditModal}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Validation Alert for AC2 */}
          {validationError && (
            <div
              data-testid="profile-validation-error"
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="block font-bold">Incomplete Profile</strong>
                <span>{validationError}</span>
              </div>
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="1st Year" className="bg-slate-900 text-white">1st Year</option>
                <option value="2nd Year" className="bg-slate-900 text-white">2nd Year</option>
                <option value="3rd Year" className="bg-slate-900 text-white">3rd Year</option>
                <option value="4th Year" className="bg-slate-900 text-white">4th Year</option>
                <option value="Postgraduate" className="bg-slate-900 text-white">Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Campus Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Mon, Wed (4:00 PM - 6:00 PM)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Short Bio & Interests
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* SECTION 1: Skills I Can Teach */}
          <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Skills I Can Teach (Offers)</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-bold">
                {teachSkills.length} Added
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                data-testid="input-teach-skill"
                placeholder="e.g. Python, Figma, React, Public Speaking..."
                value={newTeachInput}
                onChange={(e) => setNewTeachInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeachSkill())}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                data-testid="btn-add-teach-skill"
                onClick={handleAddTeachSkill}
                className="btn-3d-emerald px-3.5 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
              {teachSkills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No teaching skills added yet.</span>
              ) : (
                teachSkills.map((s, idx) => (
                  <span
                    key={idx}
                    data-testid={`teach-skill-tag-${s}`}
                    className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-xl shadow-xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeachSkill(s)}
                      className="text-emerald-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* SECTION 2: Skills I Want to Learn */}
          <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Skills I Want to Learn (Requests)</span>
              </label>
              <span className="text-[11px] text-blue-400 font-bold">
                {learnSkills.length} Added
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                data-testid="input-learn-skill"
                placeholder="e.g. Data Structures, AI, Video Editing..."
                value={newLearnInput}
                onChange={(e) => setNewLearnInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnSkill())}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                data-testid="btn-add-learn-skill"
                onClick={handleAddLearnSkill}
                className="btn-3d-indigo px-3.5 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
              {learnSkills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No learning skills added yet.</span>
              ) : (
                learnSkills.map((s, idx) => (
                  <span
                    key={idx}
                    data-testid={`learn-skill-tag-${s}`}
                    className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-xl shadow-xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLearnSkill(s)}
                      className="text-blue-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Clear helper for testing AC2 */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setTeachSkills([]);
                setLearnSkills([]);
              }}
              className="text-[11px] text-slate-500 hover:text-rose-400 underline cursor-pointer"
            >
              Clear all skills (to test AC2 validation)
            </button>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeProfileEditModal}
              className="btn-3d-slate px-4 py-2 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="save-profile-button"
              disabled={isSaving}
              className="btn-3d-emerald px-5 py-2.5 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving Profile...' : 'Save & Publish Profile (AC1)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
