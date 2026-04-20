-- ============================================
-- Smart Campus Operations Hub — PostgreSQL DDL
-- ============================================

-- 1. USERS
CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    full_name      VARCHAR(255) NOT NULL,
    role           VARCHAR(50)  NOT NULL DEFAULT 'USER',   -- USER | ADMIN | TECHNICIAN
    oauth_provider VARCHAR(50),                            -- e.g. 'google'
    oauth_sub      VARCHAR(255),                           -- unique ID from OAuth provider
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check CHECK (role IN ('USER', 'ADMIN', 'TECHNICIAN'))
);

-- 2. RESOURCES (facilities & assets catalogue)
CREATE TABLE resources (
    id                   BIGSERIAL PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    type                 VARCHAR(100) NOT NULL,   -- LECTURE_HALL | LAB | MEETING_ROOM | EQUIPMENT
    capacity             INT,
    location             VARCHAR(255),
    status               VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | OUT_OF_SERVICE
    availability_windows TEXT,                   -- store as JSON string e.g. '{"mon":"08:00-18:00"}'
    created_at           TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT resources_status_check CHECK (status IN ('ACTIVE', 'OUT_OF_SERVICE'))
);

-- 3. BOOKINGS
CREATE TABLE bookings (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id      BIGINT       NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    booking_date     DATE         NOT NULL,
    start_time       TIME         NOT NULL,
    end_time         TIME         NOT NULL,
    purpose          TEXT,
    attendees        INT          DEFAULT 1,
    status           VARCHAR(50)  NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED | CANCELLED
    rejection_reason TEXT,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT bookings_status_check    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    CONSTRAINT bookings_time_order_check CHECK (end_time > start_time)
);

-- Index to help with conflict detection queries
CREATE INDEX idx_bookings_resource_date ON bookings(resource_id, booking_date);

-- 4. TICKETS (maintenance & incident)
CREATE TABLE tickets (
    id               BIGSERIAL PRIMARY KEY,
    reporter_id      BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id      BIGINT       REFERENCES resources(id) ON DELETE SET NULL,
    assignee_id      BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    category         VARCHAR(100) NOT NULL,       -- ELECTRICAL | PLUMBING | IT | FURNITURE | OTHER
    description      TEXT         NOT NULL,
    priority         VARCHAR(50)  NOT NULL DEFAULT 'MEDIUM',  -- LOW | MEDIUM | HIGH | CRITICAL
    status           VARCHAR(50)  NOT NULL DEFAULT 'OPEN',    -- OPEN | IN_PROGRESS | RESOLVED | CLOSED | REJECTED
    resolution_notes TEXT,
    contact_details  VARCHAR(255),
    rejection_reason TEXT,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT tickets_priority_check CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT tickets_status_check   CHECK (status   IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'))
);

-- 5. TICKET ATTACHMENTS (up to 3 images per ticket — enforced in Java)
CREATE TABLE ticket_attachments (
    id          BIGSERIAL PRIMARY KEY,
    ticket_id   BIGINT       NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_path   VARCHAR(512) NOT NULL,   -- path on disk or object-storage URL
    file_name   VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 6. TICKET COMMENTS
CREATE TABLE ticket_comments (
    id         BIGSERIAL PRIMARY KEY,
    ticket_id  BIGINT    NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id  BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body       TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- 7. NOTIFICATIONS
CREATE TABLE notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(100) NOT NULL,   -- BOOKING_APPROVED | BOOKING_REJECTED | TICKET_UPDATE | NEW_COMMENT
    message    TEXT         NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Index to quickly fetch unread notifications per user
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);