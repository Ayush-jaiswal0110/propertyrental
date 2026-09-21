# Validation — 21 September 2026

## Automated

`npm test`: 10 tests passed. Covers 43 local photographs in nine room groups, legacy/empty images, ten representative HTTP routes, tour/lightbox controls, live-data separation, owner/review controls, HTML and JSON escaping, gallery validation, booking dates and every EJS template.

## Browser and application checks

- Reference listing layout inspected at the default desktop viewport (1281 × 721).
- Bedroom lightbox visually compared with the supplied image: correct photo, centered contain sizing, category, counter and edge arrows.
- Right arrow advances photo 18 to 19 and updates the category. Escape returns to the tour. Closing the tour restores focus to Show all photos and clears the body scroll lock.
- Deep link to photo 43 opens the final image; Next is disabled and Right does not wrap.
- Selecting 19–22 October updates the inputs, 3-night label and ₹17,099 total. Reserve opens the explicitly labelled assignment preview dialog.
- Full application connected to the configured MongoDB. Browse rendered 38 existing properties; ascending price sorting and the beachfront filter worked (7 results).
- Existing single-photo property opened with its real title and booking endpoint. No booking, email, upload or database content change was submitted during verification.

## Limits

OAuth provider callbacks, Cloudinary uploads, outgoing email and real booking writes require separate end-to-end checks with a dedicated test account and test database. No payment integration is claimed. The local preview tests do not establish production capacity, security completeness or exact pixel equality at every resolution. Mobile styles are included but mobile was not part of this desktop assignment verification.

The reference site was accessible during initial inspection but returned a security checkpoint during final review. Previously collected photos were retained. The illustrated map, available review subset and existing sample related stays are documented differences.
