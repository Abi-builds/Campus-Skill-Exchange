// profileController.js
// CRUD logic for SCRUM07-F001-BE-001: Profile management API
// Depends on schema from SCRUM07-F001-DB-001 (profiles, skills, profile_skills)

const pool = require('./db');

// Helper: insert a skill into `skills` table if it doesn't exist, return skill_id
async function getOrCreateSkillId(connection, skillName) {
    const [existing] = await connection.query(
        'SELECT skill_id FROM skills WHERE skill_name = ?',
        [skillName]
    );
    if (existing.length > 0) return existing[0].skill_id;

    const [result] = await connection.query(
        'INSERT INTO skills (skill_name) VALUES (?)',
        [skillName]
    );
    return result.insertId;
}

// Helper: replace all skills for a profile with the given list
// skillsPayload example: [{ name: "Python", type: "teach" }, { name: "Guitar", type: "learn" }]
async function saveProfileSkills(connection, profileId, skillsPayload) {
    // Clear existing skill links for this profile, then re-insert.
    // Simple and correct for CRUD; can optimize to diff-based updates later if needed.
    await connection.query('DELETE FROM profile_skills WHERE profile_id = ?', [profileId]);

    for (const s of skillsPayload) {
        if (!s.name || !['teach', 'learn'].includes(s.type)) continue;
        const skillId = await getOrCreateSkillId(connection, s.name.trim());
        await connection.query(
            `INSERT INTO profile_skills (profile_id, skill_id, skill_type)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE skill_type = VALUES(skill_type)`,
            [profileId, skillId, s.type]
        );
    }
}

// Helper: fetch a profile with its skills grouped by type
async function fetchProfileWithSkills(profileId) {
    const [profileRows] = await pool.query(
        'SELECT * FROM profiles WHERE profile_id = ?',
        [profileId]
    );
    if (profileRows.length === 0) return null;

    const [skillRows] = await pool.query(
        `SELECT s.skill_name, ps.skill_type
         FROM profile_skills ps
         JOIN skills s ON s.skill_id = ps.skill_id
         WHERE ps.profile_id = ?`,
        [profileId]
    );

    const teach = skillRows.filter(r => r.skill_type === 'teach').map(r => r.skill_name);
    const learn = skillRows.filter(r => r.skill_type === 'learn').map(r => r.skill_name);

    return { ...profileRows[0], skills: { teach, learn } };
}

// POST /api/profiles — create a new profile (+ optional skills)
exports.createProfile = async (req, res) => {
    const { student_id, full_name, email, bio, department, year_of_study, skills } = req.body;

    if (!student_id || !full_name || !email) {
        return res.status(400).json({ error: 'student_id, full_name, and email are required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO profiles (student_id, full_name, email, bio, department, year_of_study)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [student_id, full_name, email, bio || null, department || null, year_of_study || null]
        );
        const profileId = result.insertId;

        if (Array.isArray(skills) && skills.length > 0) {
            await saveProfileSkills(connection, profileId, skills);
        }

        await connection.commit();
        const created = await fetchProfileWithSkills(profileId);
        res.status(201).json(created);
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to create profile' });
    } finally {
        connection.release();
    }
};

// GET /api/profiles/:id — fetch one profile with skills
exports.getProfile = async (req, res) => {
    try {
        const profile = await fetchProfileWithSkills(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// PUT /api/profiles/:id — update profile fields and/or skill list (AC1)
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, bio, department, year_of_study, skills } = req.body;

    const connection = await pool.getConnection();
    try {
        const [existing] = await connection.query('SELECT * FROM profiles WHERE profile_id = ?', [id]);
        if (existing.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Profile not found' });
        }

        await connection.beginTransaction();

        await connection.query(
            `UPDATE profiles SET
                full_name = COALESCE(?, full_name),
                email = COALESCE(?, email),
                bio = COALESCE(?, bio),
                department = COALESCE(?, department),
                year_of_study = COALESCE(?, year_of_study)
             WHERE profile_id = ?`,
            [full_name, email, bio, department, year_of_study, id]
        );

        if (Array.isArray(skills)) {
            await saveProfileSkills(connection, id, skills);
        }

        await connection.commit();

        // AC1: profile and skills must be retrievable after update
        const updated = await fetchProfileWithSkills(id);
        res.json(updated);
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    } finally {
        connection.release();
    }
};

// DELETE /api/profiles/:id — remove a profile (and its skill links via cascade)
exports.deleteProfile = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM profiles WHERE profile_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Profile not found' });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
};
