-- SCRUM07-F002-DB-001: Session request data store
-- Story: persist learning-session requests and their status
-- so that the request/accept workflow functions correctly.
-- Depends on: profiles table (SCRUM07-F001-DB-001)

CREATE TABLE session_requests (
    request_id      INT AUTO_INCREMENT PRIMARY KEY,
    requester_id     INT NOT NULL,   -- profile_id of the student asking to learn/teach
    recipient_id     INT NOT NULL,   -- profile_id of the student receiving the request
    skill_id         INT NOT NULL,   -- which skill this session is about
    status           ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed')
                          NOT NULL DEFAULT 'pending',
    message          TEXT,           -- optional note from requester
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (requester_id) REFERENCES profiles(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES profiles(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);

-- Indexes so lookups by either party are fast (AC1: retrievable by requester AND recipient)
CREATE INDEX idx_session_requests_requester ON session_requests (requester_id, status);
CREATE INDEX idx_session_requests_recipient ON session_requests (recipient_id, status);


-- ============================================
-- AC1 verification queries
-- ============================================

-- All requests sent BY a given student (as requester)
SELECT * FROM session_requests WHERE requester_id = 1;

-- All requests received BY a given student (as recipient)
SELECT * FROM session_requests WHERE recipient_id = 1;

-- All requests involving a student, either side, most recent first
SELECT * FROM session_requests
WHERE requester_id = 1 OR recipient_id = 1
ORDER BY created_at DESC;
