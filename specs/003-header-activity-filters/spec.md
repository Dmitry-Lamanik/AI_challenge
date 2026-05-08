# Feature Specification: Header activity filters and employee search

**Feature Branch**: `001-header-activity-filters`  
**Created**: 2026-05-04  
**Status**: Draft  
**Input**: User description: "Add a search/filters block in header. In 1 line we should have 3 selects and search input with \"Search employee..\" placeholder. Select1 options: \"All Years\", \"2025\". Select2 options: \"All Quarters\" \"Q1\" \"Q2\" \"Q3\" \"Q4\". Select3 options \"All categories\", and all category names(\"Education\", \"Public speaking\", \"University partner\"). These selects should filter activities. onchange for every of them should trigger list and podium update. onchange \"Search employee..\" input should filter users (name should contain input value) and trigger list and podium update."

## Clarifications

### Session 2026-05-04

- Q: When should list and podium refresh for the employee search field (change/blur vs each keystroke vs debounced)? → A: **B** — refresh on every keystroke (live search).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter activities from the header (Priority: P1)

A viewer uses the header to narrow which activities count toward rankings and lists by calendar year, quarter, and activity category, without leaving the page.

**Why this priority**: Activity filters are the primary way to focus the dashboard on a time window and topic; without them the feature adds no value.

**Independent Test**: Change each header select and confirm the activity list and podium only include activities that match the selected year (or all years), quarter (or all quarters), and category (or all categories).

**Acceptance Scenarios**:

1. **Given** default header filters (all years, all quarters, all categories), **When** the user opens the page, **Then** the activity list and podium reflect all activities not excluded by other rules.
2. **Given** the user selects year "2025", **When** the selection changes, **Then** the list and podium update to include only activities in 2025 (and still respect quarter and category selections).
3. **Given** the user selects a specific quarter (e.g. "Q2"), **When** the selection changes, **Then** the list and podium update to activities in that quarter (per product definitions of quarter boundaries).
4. **Given** the user selects a category (e.g. "Education") or "All categories", **When** the selection changes, **Then** the list and podium include only activities in that category, or every category when "All categories" is selected.
5. **Given** multiple selects are set, **When** any one of them changes, **Then** results satisfy all active filters together (narrowing combination).

---

### User Story 2 - Find employees by name from the header (Priority: P1)

A viewer types in the header search field to restrict which people appear in the list and on the podium based on whether their display name contains the typed text.

**Why this priority**: Name search is paired with activity filters to complete the header control set and directly answers "where is this person?".

**Independent Test**: Enter partial and full substrings of an employee name and confirm list and podium only show matching people while activity filters still apply as specified.

**Acceptance Scenarios**:

1. **Given** the search field shows placeholder text "Search employee..", **When** the user has not entered text (or cleared it), **Then** no name substring filter is applied beyond other filters.
2. **Given** a non-empty search value, **When** the user adds or removes characters so the current field text changes, **Then** the list and podium update immediately so that each shown user's name contains the current search text as a substring.
3. **Given** a search that matches no user, **When** results refresh, **Then** the list and podium show no matching users (empty state is acceptable).

---

### User Story 3 - Single-row header layout (Priority: P2)

A viewer sees all filter controls and the search field arranged on one horizontal row in the header for quick scanning.

**Why this priority**: Layout supports usability but behavior is defined by the other stories.

**Independent Test**: On a typical desktop viewport, confirm three selects and one search field appear on one line without wrapping under normal content width.

**Acceptance Scenarios**:

1. **Given** the header is visible, **When** the user views the filter block, **Then** they see exactly three dropdowns in order (year, then quarter, then category) and one search field with placeholder "Search employee..", on a single row where space allows.

---

### Edge Cases

- **Combined filters**: Activity filters (year, quarter, category) apply together; the employee name filter applies to users; list and podium must reflect the intersection of activity-scoped data and users whose names match the search substring when search is non-empty.
- **Quarter definition**: Quarters Q1–Q4 map to standard calendar quarters for the selected year; when year is "All Years", quarter filter applies per activity’s assigned year (activities outside any included year are excluded when a quarter is chosen).
- **No matching activities or users**: UI should remain consistent (empty list/podium) without errors.
- **Whitespace-only search**: Treat as empty (no substring filter) unless product later defines otherwise; trimming leading/trailing spaces is assumed.
- **Live search**: Each edit to the search string updates list and podium without requiring blur or Enter; the visible result set always matches the current trimmed string (or empty-string rule above).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST expose a header control row containing three single-choice filters (year, quarter, category) and one free-text search field, in one horizontal row on typical desktop layouts.
- **FR-002**: The year filter MUST offer exactly the options: "All Years", "2025".
- **FR-003**: The quarter filter MUST offer exactly the options: "All Quarters", "Q1", "Q2", "Q3", "Q4".
- **FR-004**: The category filter MUST offer exactly the options: "All categories", "Education", "Public speaking", "University partner".
- **FR-005**: The search field MUST display the placeholder text: `Search employee..` (two dots as specified).
- **FR-006**: Changing the value of any of the three activity filters MUST refresh both the activity-related list and the podium to reflect only activities that satisfy the selected year (or all years), quarter (or all quarters), and category (or all categories).
- **FR-007**: On each change to the search field’s current text from user input (live, character-by-character), the product MUST refresh the list and podium so that only users whose name contains the current search text as a contiguous substring are included; matching MUST be case-insensitive unless otherwise constrained by accessibility or locale rules.
- **FR-010**: Each dropdown MUST refresh the list and podium on every change of its selected option; the search field MUST refresh the list and podium on every change to the in-field text from user input (same timing as FR-007), independently of blur or Enter.
- **FR-008**: Updates triggered by filter or search changes MUST apply together: results MUST respect all active activity filters and the name substring rule simultaneously.
- **FR-009**: Default selections MUST be the first option in each list ("All Years", "All Quarters", "All categories") and an empty search value.

### Key Entities *(include if feature involves data)*

- **Activity**: A record contributing to rankings; has an associated calendar year, quarter, category from the fixed category set, and ties to users for list/podium display.
- **User (employee)**: A person shown on the list and podium; has a display name used for substring matching.
- **Header filter state**: The current values of year, quarter, category, and search text driving visible results.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: During acceptance testing, changing any header control produces an updated list and podium before the tester counts to three in normal use (no prolonged stall).
- **SC-002**: For a fixed dataset with known activities and users, 100% of scripted filter combinations pass: results include only activities in the chosen year, quarter, and category buckets, and only users whose names satisfy the search substring when the search field is non-empty.
- **SC-003**: Acceptance testers complete a five-step script (vary year, quarter, category, then search, then clear search) without incorrect rows appearing in the list or podium at any step.
- **SC-004**: Visible option labels and the search placeholder match the wording in this specification exactly for all preset strings.

## Assumptions

- Activity records already carry or can derive year, quarter, and one of the three listed categories; no new categories are in scope for this release.
- Only the year 2025 appears as a concrete year option; additional years are out of scope unless added later.
- "List" and "podium" refer to existing primary views whose data is driven by the same activity and user selection logic after this feature ships.
- Case-insensitive substring match for names follows common directory expectations and does not require locale-specific collation beyond default product behavior.
- Employee search uses **live** updates: each keystroke (after applying trim rules for empty vs whitespace-only) re-evaluates name matching and refreshes list and podium. Dropdowns continue to refresh on selection change only.
