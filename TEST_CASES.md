# Skylark Intelligence — Acceptance Tests

Expected values are validation snapshots from the current monday.com boards and can change if the boards change.

## Core tests

1. **Total pipeline** — `What's our total pipeline value?` → about ₹6,881.52 Lakhs / ₹68.82 Cr; 49 open deals.
2. **Weighted pipeline** — `What is our weighted pipeline and probability coverage?` → about ₹31.33 Cr; known probability 47/49 (95.9%); 45/47 (95.7%) among valued deals; 97.3% by pipeline value.
3. **Sector pipeline** — `Show me the open pipeline by sector.` → sector totals and missing-value counts.
4. **Work-order financials** — `How much has been billed, collected, and what is currently receivable?` → about ₹12.67 Cr billed, ₹9.04 Cr collected, ₹3.63 Cr receivable.
5. **Cross-board analysis** — `Compare Mining sales pipeline with Mining work-order execution.` → Mining sales pipeline plus Mining work-order execution and financial metrics, kept as separate concepts.
6. **Data quality** — `Find data quality issues affecting our pipeline forecast.` → actual missing/incomplete records and actionable recommendations.
7. **Leadership update** — `Give me a leadership update for the business.` → executive summary across sales, operations, financials, risks, and actions.

## Failure handling

- Missing `MONDAY_API_TOKEN` should return a readable configuration error.
- Inaccessible/invalid board IDs should return a readable API/permission error.
- The application must never perform monday.com write mutations.

## Security

- `MONDAY_API_TOKEN` must be supplied only through the runtime/deployment environment.
- The token must not appear in frontend JavaScript, GitHub files, screenshots, or documentation.
- The supplied XLSX/CSV business data must not be committed to the repository.
