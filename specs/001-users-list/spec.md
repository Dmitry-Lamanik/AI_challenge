# Feature Specification: Users list with activities

**Feature Branch**: `001-users-list`  
**Created**: 2026-04-29  
**Status**: Draft  
**Input**: User description: "create users compenent what shows a list on users. render it in @src/App.tsx Each user block should take all screen width and have user name, position and list of activities (with category name)"

## Clarifications

### Session 2026-04-29

- Q: Should the vertical list of users follow a defined sort order? → **A:** Stable database order (e.g., ascending user id / creation order as returned by the datastore), not alphabetical or points-based unless the backend defines otherwise.
- Q: How should activities be ordered within each user’s block? → **A:** Newest activity first (descending activity date/time).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View roster with activity detail (Priority: P1)

As someone reviewing people and their contributions, I open the main screen and see every person listed in separate blocks that span the full width of the content area. Each block shows the person’s display name and role or title, and beneath that a clear list of their recorded activities with the most recent activity first. Each activity line identifies which category it belongs to so I can scan participation by type.

**Why this priority**: This is the core value—understanding who people are and what they did, categorized—without drilling elsewhere.

**Independent Test**: With representative data present, opening the screen shows multiple users; each block contains matching name, position, and activity rows with visible category labels.

**Acceptance Scenarios**:

1. **Given** at least one user exists with activities tied to categories, **When** I load the screen, **Then** I see one full-width block per user in stable datastore order (consistent user ordering such as ascending user id), with that user’s name and position and a list of activities ordered newest-first by activity date/time, where each entry shows its category name.
2. **Given** a user has no activities, **When** I view their block, **Then** I still see their name and position and an indication that there are no activities (empty state within the block).

---

### User Story 2 - Recover from unavailable data (Priority: P2)

If the roster cannot be loaded (for example connectivity or configuration problems), I see a concise error message instead of a blank screen so I know something failed and can retry or fix configuration.

**Why this priority**: Prevents silent failures and supports troubleshooting.

**Independent Test**: Simulate failed load; the interface shows an error state without crashing.

**Acceptance Scenarios**:

1. **Given** data loading fails, **When** the screen renders the result, **Then** I see a clear error message and the surrounding layout remains usable where possible.

---

### Edge Cases

- Within each user block, activities are ordered by date/time descending (newest first); ties SHOULD follow stable datastore ordering for activities if timestamps collide.
- User list order is stable and matches backend/user identity order (e.g., ascending id); it is not sorted alphabetically by name or by points unless explicitly changed in a future clarification.
- No users available: show an empty roster message for the list area.
- Partial data (user exists but activities missing): still show user header; activities area empty or explicitly “none”.
- Very long names or many activities: layout remains readable (wrapping or scrolling within the block without breaking the full-width layout).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST present all users as a vertical list of distinct blocks.
- **FR-002**: Each block MUST use the full available horizontal width of the main content area (minus consistent page padding).
- **FR-003**: Each block MUST show the user’s name and position (role/title) prominently.
- **FR-004**: Each block MUST list that user’s activities; each activity MUST display the related activity category name.
- **FR-005**: The primary application screen MUST surface this roster so it is the main focus when opening the app.
- **FR-006**: The experience MUST provide loading feedback while roster data is being retrieved.
- **FR-007**: The experience MUST surface failures to load data in a user-visible way.
- **FR-008**: User blocks MUST be ordered in stable datastore order (consistent with user identity ordering, such as ascending user id unless the backend specifies a different canonical order).
- **FR-009**: Within each user block, activities MUST be ordered by activity date/time descending (most recent first).

### Key Entities

- **User**: Person record with name and position; has many activities.
- **Activity**: Record tied to a user and a category, with date/time and points as stored for reporting.
- **Activity category**: Named grouping used to label each activity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a dataset of at least 50 users, a reviewer can scroll the list and locate any given user’s block within one minute without external search tools.
- **SC-002**: In usability testing, at least 90% of participants correctly identify an activity’s category from the list without confusing another user’s data.
- **SC-003**: When data is available, the roster renders primary content (first meaningful block) within a few seconds on a typical broadband connection.
- **SC-004**: Zero unhandled failure paths when loading fails—users always see either data, an explicit empty state, or a clear error.

## Assumptions

- Reviewers already have access to the data source backing the roster.
- Category names shown are those stored for each category record.
- Mobile-specific polish is secondary unless prioritized separately; full-width blocks apply to the primary desktop-width layout.
- Frontend aligns with the project constitution (Vite, React, TypeScript, ESLint, Prettier).
