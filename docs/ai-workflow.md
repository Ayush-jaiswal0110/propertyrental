# AI-assisted implementation record

Tool: Codex desktop coding assistant. Work took place in the existing Express/EJS repository. PDF extraction and browser inspection were used to understand the reference; the PDF skill was used for document review. No sub-agents were spawned. No reference application JavaScript or stylesheet was copied.

## User prompt sequence (normalised)

1. Read the Playpower Labs assignment completely; update the existing project design, icons and colours to match the linked reference.
2. Use the full-page PDF capture as the complete listing design reference.
3. Use the second PDF for the complete photo gallery section.
4. Use the screen recording and bedroom viewer screenshot as further reference.
5. Inspect the reference opened in the browser.
6. Complete the project and push it to the existing GitHub repository.

These are a concise record of the user requests, not a claim to reproduce every internal model/tool message. PDFs, video, screenshots and local private paths are excluded from the repository.

## Implementation sequence

1. Inspect assignment, existing routes/models/templates and working-tree changes.
2. Inspect the reference listing, tour and viewer in the browser; collect only public visual assets.
3. Build reusable photo presentation, SVG icons, CSS and native-dialog controls.
4. Adapt both demo and database listings without inventing reviews or amenities for live properties.
5. Add gallery uploads, date validation and shared browse/auth styling.
6. Exercise rendered routes and security-sensitive escaping/ownership cases with Node tests.
7. Check visual layout, gallery navigation, focus and dates in a real browser.
8. Review changes, preserve upstream dependency fixes, and publish to the user's existing GitHub remote as explicitly requested.

## Review prompts to reuse

- Compare the three desktop views with the supplied reference. List concrete discrepancies in spacing, typography, image order, icons and interaction states before editing.
- Inspect the photo navigation with keyboard-only use. Verify first/last boundaries, Escape, Back, focus restoration and scroll locking.
- Render a legacy listing with one image, no reviews and no amenities. Ensure reference fixture facts never appear in real data.
- Review changed routes for validation, ownership checks, escaping and committed credentials. Preserve existing work and upstream changes.

The assignment document requests private submission. The later user instruction explicitly requests a push to their existing GitHub repository; repository visibility is not changed by this work. Follow the assessor's email requirements for any separate submission.
