# Skylark Intelligence — Business Intelligence Agent

Founder-level business intelligence over live monday.com data.

## What this project does

Skylark Intelligence is a read-only conversational BI application for two monday.com boards:

- **Deal funnel Data** — board `5030964576`
- **Work_Order_Tracker Data** — board `5030964591`

The browser hosts only the UI. All monday.com access happens server-side through `/api/query`, so the monday API token is never exposed to the browser or committed to Git.

The app uses a hybrid agent design: a deterministic intent router selects the appropriate BI workflow, while the calculation layer performs the actual aggregation against live monday.com records. This avoids inventing business numbers and keeps the answer reproducible.

## Architecture

```text
User
  |
  v
Browser UI (index.html)
  |
  v
POST /api/query
  |
  +--> Intent Router
  |       +--> Open / total pipeline
  |       +--> Weighted pipeline
  |       +--> Pipeline by sector
  |       +--> Work-order financials
  |       +--> Data quality
  |       +--> Cross-board sector execution
  |       +--> Leadership update
  |
  v
monday.com GraphQL API
  |                 |
  v                 v
Deals board      Work Orders board
```

## monday.com integration

The backend uses monday.com's GraphQL API at `https://api.monday.com/v2`.

Authentication is server-side via `MONDAY_API_TOKEN`.

The application dynamically reads all items using `items_page(limit: 500)` and follows `next_items_page(cursor: ...)` until the cursor is exhausted. No CSV/XLSX data is embedded in the application.

### Environment variables

```text
MONDAY_API_TOKEN=your_token_here
DEALS_BOARD_ID=5030964576
WORK_ORDERS_BOARD_ID=5030964591
```

Never commit `MONDAY_API_TOKEN`.

## Data resilience

- Blank/null values are treated as missing rather than zero.
- Accidental header-like rows are filtered.
- Status/text values are trimmed and normalized for comparison.
- Numeric values are parsed conservatively.
- Unit-bearing quantities are not combined across incompatible units.
- Sales pipeline and operational work-order financials remain separate.
- Material data-quality caveats are reported.

## Metric definitions

### Pipeline
Unqualified pipeline questions default to **Open** deals and sum `Masked Deal value`.

### Weighted pipeline
Open deals with numeric value and a valid closure probability are weighted:

- High = 100%
- Medium = 50%
- Low = 25%

### Probability coverage
The app reports valid probability labels / all open deals, value + probability / valued open deals, and probability-covered pipeline value / total numeric open pipeline.

### Work-order financials
- Billed Value incl. GST → `numeric_mm6qxw71`
- Billed Value excl. GST → `numeric_mm6qnt3z`
- Collected Amount incl. GST → `numeric_mm6qdyqq`
- Amount Receivable → `numeric_mm6qv7pn`
- Contract Amount incl. GST → `numeric_mm6qwg7d`
- Contract Amount excl. GST → `numeric_mm6qa7ad`

## Validation snapshot

At validation time:

- Open pipeline: **₹6,881.52 Lakhs / ₹68.82 Cr**
- Weighted pipeline: **₹3,133.39 Lakhs / ₹31.33 Cr**
- Known probability among open deals: **47/49 = 95.9%**
- Known probability among valued open deals: **45/47 = 95.7%**
- Probability value coverage: **97.3%**
- Work-order billed incl. GST: **₹12.67 Cr**
- Work-order collected incl. GST: **₹9.04 Cr**
- Work-order receivable: **₹3.63 Cr**

These are validation snapshots; the application queries live monday.com data at runtime.

## Deployment

This project is designed for Vercel.

1. Import the repository into Vercel.
2. Add `MONDAY_API_TOKEN` as a server-side Environment Variable.
3. Add `DEALS_BOARD_ID` and `WORK_ORDERS_BOARD_ID`.
4. Deploy.
5. Test the resulting public `https://*.vercel.app` URL in an incognito/private browser.

## Acceptance tests

```text
What's our total pipeline value?
What is our weighted pipeline and probability coverage?
Show me the open pipeline by sector.
How much has been billed, collected, and what is currently receivable?
Compare Mining sales pipeline with Mining work-order execution.
Find data quality issues affecting our pipeline forecast.
Give me a leadership update for the business.
How is our pipeline looking this quarter?
```

## AI tools used

- ChatGPT/Codex — architecture, code generation, debugging, validation, and test design.
- monday Vibe — initial hosted conversational prototype and live-board integration.

## Security

The monday API token is server-side only. Do not place it in frontend JavaScript, GitHub, or screenshots.
