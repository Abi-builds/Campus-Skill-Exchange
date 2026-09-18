-- SCRUM07-F001-DB-001: Profile and skills data store
-- Story: persist student profiles and their teach/learn skill lists
-- so that search and matching can query them.

-- 1. Profiles table
CREATE TABLE profiles (
    profile_id      INT AUTO_INCREMENT PRIMARY KEY,
    student_id      VARCHAR(50) NOT NULL UNIQUE,   -- college roll no. / user id
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    bio             TEXT,
    department      VARCHAR(100),
    year_of_study   TINYINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Master skills table (so skill names aren't duplicated as free text)
CREATE TABLE skills (
    skill_id        INT AUTO_INCREMENT PRIMARY KEY,
    skill_name      VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Association table: which student teaches/learns which skill
CREATE TABLE profile_skills (
    profile_skill_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id       INT NOT NULL,
    skill_id         INT NOT NULL,
    skill_type       ENUM('teach', 'learn') NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,

    -- prevents duplicate rows like (same student, same skill, same type) twice
    UNIQUE KEY uniq_profile_skill_type (profile_id, skill_id, skill_type)
);

-- Helpful index for AC1: "retrieve all skills by type for a profile"
CREATE INDEX idx_profile_skills_lookup ON profile_skills (profile_id, skill_type);


-- ============================================
-- AC1 verification query:
-- Given a profile, get all skills grouped by type
-- ============================================
-- Example: get all 'teach' skills for profile_id = 1
SELECT s.skill_name
FROM profile_skills ps
JOIN skills s ON s.skill_id = ps.skill_id
WHERE ps.profile_id = 1 AND ps.skill_type = 'teach';

-- Example: get all 'learn' skills for profile_id = 1
SELECT s.skill_name
FROM profile_skills ps
JOIN skills s ON s.skill_id = ps.skill_id
WHERE ps.profile_id = 1 AND ps.skill_type = 'learn';