# Property Rental — Airbnb-inspired redesign

An Express/EJS and MongoDB rental application with the listing page, full-screen photo tour and single-photo viewer from the supplied Playpower Labs reference. The existing application stays on its original server-rendered stack.

## Run the design preview

```sh
npm ci
npm run preview
```

Open **http://localhost:8081/design-reference**. No database, credentials or account is needed. The preview uses the same EJS templates and browser scripts as the main app. It cannot create accounts, upload files or make bookings. `/home` shows the redesigned homepage, `/listings` shows sample browsing, and `/listings/1` demonstrates a legacy single-photo property.

## Run the full application

1. Use Node.js 20.11 or later and install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` and supply MongoDB (`ATLASDB_URL`) and a strong session `SECRET`.
3. Set Cloudinary credentials and `MAP_TOKEN` for property uploads and geocoding. Google/Facebook sign-in and confirmation email are optional integrations; their keys belong only in `.env` or your hosting provider's secret settings.
4. Run `npm start` and open **http://localhost:8080** (or the configured `PORT`).

The reference route is `/design-reference`. Real properties at `/listings/:id` receive the same design and gallery behavior, populated from their own data. Add photos with a room category in the create/edit form. Existing single-cover listings continue to work without a migration. Do not run seed scripts against a database containing data you want to keep.

## What is included

- White/charcoal/pink theme, Cereal typography, custom outline SVG icons, five-image hero and sticky booking panel.
- 43 reference photographs across nine room categories; fullscreen tour and lightbox with photo counts, previous/next buttons and keyboard arrows.
- Escape, browser Back/Forward, gallery deep links, focus restoration, native modal focus containment and reduced-motion support.
- Two-month date picker, night totals, saved listing state and share-link copying.
- Reviews, grouped amenities, sleeping areas, host details, policy dialogs and horizontally scrollable related-property cards.
- Consistent home, browse, login/signup and listing editor styling; location search, category filters and price sorting.
- Gallery upload schema, booking-date validation and ownership checks. Mail credentials are loaded from environment variables.

## Verification

```sh
npm test
```

The Node test suite checks reference asset integrity, room grouping, representative HTTP routes, legacy data, ownership controls, escaping, input validation and EJS compilation. Browser checks cover the tour/lightbox, keyboard navigation, focus restoration, date selection, browsing and desktop layout. See [validation](docs/validation.md) for the tested scope.

## Assignment deliverables

- [Production architecture diagram](docs/architecture.svg) and [scaling decisions](docs/architecture.md).
- [AI workflow and prompt sequence](docs/ai-workflow.md).
- [Reusable review workflow](docs/workflows/design-review/SKILL.md) and [optional agent role configuration](docs/agent-config.example.json). These document a repeatable process; this implementation did not run sub-agents.

## Scope and differences

The reference data is a visual demo, never seeded into MongoDB. Its Reserve button opens a preview dialog and does not charge or book anything. The discount is demonstrative. Six supplied review excerpts are shown from the displayed total of 19; missing reviews are not fabricated. The reference map is an illustration; live listings can use Mapbox. Related-property cards use the project's existing sample listings because the additional reference assets could not be retrieved during final verification. Desktop was the assignment target; small-screen layouts are also supported.

This is an educational clone, not an official Airbnb product. Images, font and small decorative assets came from the user-supplied reference for this assignment and retain their original ownership; the repository's ISC license does not grant rights to those third-party assets. EJS, CSS, JavaScript and SVG interface icons were implemented in this project rather than copied from the reference source code. See [asset provenance](docs/asset-provenance.md).

The existing booking backend uses simple room counts and PDF/email confirmation. It is not a payment processor or a production-grade date-overlap inventory system. The architecture proposal describes the additional transactional inventory and operational work needed at scale.
