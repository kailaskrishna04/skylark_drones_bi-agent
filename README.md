# Skylark Intelligence — Business Intelligence Agent

A read-only conversational BI agent for the Skylark Drones assignment. It answers founder-level questions using **live monday.com board data** rather than hardcoded CSV/XLSX data.

## Assignment scope

The application works with two monday.com boards:

- **Deal funnel Data** — `5030964576`
- **Work_Order_Tracker Data** — `5030964591`

It supports:

- pipeline and weighted-pipeline analysis;
- sector-wise pipeline analysis;
- work-order billed / collected / receivable metrics;
- cross-board Mining analysis;
- data-quality diagnostics;
- leadership-ready summaries;
- missing/null handling and conservative numeric parsing;
- read-only monday.com access.

## Architecture

```text
User
  ↓
Browser UI (index.html)
  ↓  POST /api/query
Node server (server.js)
  ↓
BI / intent logic (src/bi.js)
  ↓
monday.com GraphQL API
  ├── Deal funnel Data
  └── Work_Order_Tracker Data
```

The monday.com token is used only on the server. It is never required in frontend JavaScript and is not stored in GitHub.

## monday.com integration

The backend calls `https://api.monday.com/v2` with token authentication and reads the boards dynamically.

All items are retrieved with `items_page(limit: 500)` followed by cursor-based `next_items_page` requests until all records are fetched.

### Environment variables

```text
MONDAY_API_TOKEN=your_token_here
DEALS_BOARD_ID=5030964576
WORK_ORDERS_BOARD_ID=5030964591
```

The supplied spreadsheets are treated only as import inputs; they are not embedded in the application.

## Data resilience

- Blank/null values are treated as missing rather than zero.
- Accidental header-like records are filtered.
- Status and text comparisons are trimmed and normalized.
- Numeric fields are parsed conservatively.
- Missing values are called out in responses.
- Sales pipeline and work-order financials remain separate business concepts.

## Key BI definitions

### Open pipeline
An unqualified pipeline question defaults to **Open** deals and sums `Masked Deal value`.

### Weighted pipeline
For Open deals with a numeric value and valid closure probability:

- High = 100%
- Medium = 50%
- Low = 25%

### Probability coverage
The app reports:

- valid probability / all open deals;
- deals with both value and probability / open deals with numeric value;
- pipeline value covered by known probability / total numeric open pipeline.

### Work-order financials
The app uses the explicit monday.com fields for billed, collected, receivable, and contract values and labels GST treatment from the source column names.

## Validation snapshot

At validation time the live boards returned approximately:

- Open pipeline: **₹6,881.52 Lakhs / ₹68.82 Cr**
- Weighted pipeline: **₹3,133.39 Lakhs / ₹31.33 Cr**
- Known probability among open deals: **47/49 = 95.9%**
- Known probability among valued open deals: **45/47 = 95.7%**
- Probability value coverage: **97.3%**
- Billed incl. GST: **₹12.67 Cr**
- Collected incl. GST: **₹9.04 Cr**
- Receivable: **₹3.63 Cr**

These are validation snapshots and can change when monday.com data changes.

## Run locally

Requires Node.js 18+.

```bash
npm start
```

Open `http://localhost:3000`.

## Acceptance tests

Use these founder-style prompts:

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

- ChatGPT/Codex for architecture, implementation, debugging, validation, and test design.
- monday Vibe for the initial hosted prototype and live-board exploration.

## Trade-offs

A deterministic BI layer was used for the core calculations to make the numbers reproducible and auditable. A more advanced implementation could add an LLM planner/tool-calling layer for broader language coverage while keeping the calculation layer deterministic.

## Security

Never commit `MONDAY_API_TOKEN`. The token belongs in the deployment/runtime environment only.
