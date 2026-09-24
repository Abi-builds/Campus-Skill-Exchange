import React, { useState } from 'react';
import { X, Plus, BookOpen, AlertCircle, Save, Check } from 'lucide-react';
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h3 id="profile-modal-title" className="text-base font-bold">
              Edit Student Skill Profile
            </h3>
            <p className="text-xs text-emerald-100">
              Story: SCRUM07-F001-UI-001 • Profile & Skills Management
            </p>
          </div>
          <button
            type="button"
            onClick={closeProfileEditModal}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5 animate-shake"
            >
              <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold">Incomplete Profile</strong>
                <span>{validationError}</span>
              </div>
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Campus Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Mon, Wed (4:00 PM - 6:00 PM)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Short Bio & Interests
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* SECTION 1: Skills I Can Teach */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                <BookOpen size={14} className="text-emerald-700" />
                <span>Skills I Can Teach (Offers)</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold">
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
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                data-testid="btn-add-teach-skill"
                onClick={handleAddTeachSkill}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
              {teachSkills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No teaching skills added yet.</span>
              ) : (
                teachSkills.map((s, idx) => (
                  <span
                    key={idx}
                    data-testid={`teach-skill-tag-${s}`}
                    className="inline-flex items-center gap-1 bg-white text-emerald-800 border border-emerald-300 text-xs font-medium px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeachSkill(s)}
                      className="text-emerald-500 hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* SECTION 2: Skills I Want to Learn */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                <BookOpen size={14} className="text-blue-700" />
                <span>Skills I Want to Learn (Requests)</span>
              </label>
              <span className="text-[11px] text-blue-700 font-semibold">
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
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                data-testid="btn-add-learn-skill"
                onClick={handleAddLearnSkill}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] pt-1">
              {learnSkills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No learning skills added yet.</span>
              ) : (
                learnSkills.map((s, idx) => (
                  <span
                    key={idx}
                    data-testid={`learn-skill-tag-${s}`}
                    className="inline-flex items-center gap-1 bg-white text-blue-800 border border-blue-300 text-xs font-medium px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLearnSkill(s)}
                      className="text-blue-500 hover:text-rose-600 cursor-pointer ml-0.5"
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
              className="text-[11px] text-slate-400 hover:text-rose-600 underline cursor-pointer"
            >
              Clear all skills (to test AC2 validation)
            </button>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeProfileEditModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="save-profile-button"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
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
