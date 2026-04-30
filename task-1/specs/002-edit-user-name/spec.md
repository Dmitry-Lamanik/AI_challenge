# Feature Specification: Edit user name in popup

**Feature Branch**: `002-edit-user-name`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "make user name editable (in popup window) by clicking on it"

## Clarifications

### Session 2026-04-30

- Q: How should concurrent edits from another session be handled during save? → A: Detect conflict on save; show message and require reload/reopen before retry.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit user name directly (Priority: P1)

As an operator viewing a user's popup, I can click the user name, edit it inline, and save the new value without leaving the popup.

**Why this priority**: This is the core requested behavior and delivers immediate value for roster maintenance.

**Independent Test**: Open any user popup, click the displayed name, change it, save, and confirm the new name is shown in the popup and main user card.

**Acceptance Scenarios**:

1. **Given** a user popup is open and the name is visible, **When** the operator clicks the name, **Then** the name switches into editable mode with the current value prefilled.
2. **Given** the name is in editable mode, **When** the operator enters a valid new name and confirms, **Then** the name is updated and displayed as normal text in the popup.
3. **Given** a name was successfully updated, **When** the popup stays open or is reopened, **Then** the updated name is shown consistently.

---

### User Story 2 - Cancel accidental edits (Priority: P2)

As an operator, I can cancel editing so accidental clicks do not change user data.

**Why this priority**: Prevents unintended updates and supports safe interaction.

**Independent Test**: Enter edit mode, modify the value, cancel, and verify the original name remains unchanged.

**Acceptance Scenarios**:

1. **Given** name edit mode is active, **When** the operator cancels, **Then** no update is saved and the original name is displayed.
2. **Given** name edit mode is active, **When** the operator closes the popup without confirming, **Then** unsaved changes are discarded.

---

### User Story 3 - Input validation feedback (Priority: P3)

As an operator, I receive clear feedback when the entered name is invalid and cannot be saved.

**Why this priority**: Keeps data clean and avoids silent failures.

**Independent Test**: Enter an invalid value (empty or whitespace-only) and verify save is blocked with a clear message.

**Acceptance Scenarios**:

1. **Given** name edit mode is active, **When** the operator clears the input or enters only whitespace, **Then** confirmation is blocked and a validation message is shown.
2. **Given** validation is shown for invalid input, **When** the operator enters a valid name, **Then** validation feedback is cleared and save becomes available.

---

### Edge Cases

- User clicks the name repeatedly while already in edit mode.
- The update request fails due to temporary backend/network issue.
- If the user name was changed from another session while popup is open, save is rejected with a conflict message and operator must reopen or reload before retry.
- The entered value matches the current saved name exactly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow entering user name edit mode from the popup by clicking the currently displayed name.
- **FR-002**: System MUST preload the current user name into the editable input when edit mode starts.
- **FR-003**: System MUST allow the operator to confirm the edited name and persist the update for that specific user.
- **FR-004**: System MUST provide a way to cancel editing that exits edit mode without saving changes.
- **FR-005**: System MUST reject empty or whitespace-only names and show clear validation feedback in the popup.
- **FR-006**: System MUST keep the UI consistent after a successful update so the new name is visible in popup content and user list card without manual page refresh.
- **FR-007**: System MUST show a user-visible error state when name update fails and keep the previous saved name unchanged.
- **FR-008**: System MUST prevent duplicate save submissions while an update request is in progress.
- **FR-009**: System MUST detect concurrent update conflicts at save time and require the operator to refresh popup data before retrying.

### Key Entities *(include if feature involves data)*

- **User**: Represents a roster person with editable display name and immutable identity.
- **Name Edit Session**: Represents temporary popup state for one user name edit attempt, including draft value, validation state, save state, and cancellation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability checks, 95% of operators complete a user name edit from popup open to saved result in under 20 seconds.
- **SC-002**: 100% of valid confirmed edits are reflected in both popup and roster card on first view after save.
- **SC-003**: 100% of invalid empty or whitespace-only submissions are blocked from saving.
- **SC-004**: In test runs covering update failures, 100% of failed updates preserve the previously saved name and display an error message.

## Assumptions

- Operators already have permission to update user profile names in the current environment.
- Name editing is required only in the existing popup interaction surface; no bulk edit flow is part of this feature.
- A valid name is any non-empty, non-whitespace text value.
- Existing user identity and activity data model remains unchanged; only display name value is editable.
