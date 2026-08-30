# Skylark Drones — Decision Log

## Assumptions
- monday.com is the runtime source of truth; the supplied spreadsheets are import inputs only.
- Calendar quarters are the default unless the user specifies another fiscal calendar.
- Null/blank values are missing, not zero.
- An unqualified founder-facing “pipeline” question means open sales pipeline.
- Sales pipeline and work-order financials are separate business concepts and are never added together as one revenue figure.

## Data resilience
The source data contains sparse fields, inconsistent text, accidental header-like records, and mixed numeric/date representations. The implementation trims and case-normalizes text, parses numeric values conservatively, filters header-like records, treats missing values separately from zero, and surfaces material data-quality caveats.

## Query understanding
A lightweight intent router maps founder-style questions to focused analyses: open pipeline, weighted pipeline, sector analysis, work-order financials, data quality, cross-board analysis, and leadership updates. Ambiguous time phrases use explicit calendar-quarter/month assumptions and state the assumption when relevant.

## Architecture and trade-offs
A lightweight full-stack Node application was chosen to keep the solution small and explainable within the assignment time limit. The browser is intentionally thin; the server-side API endpoint reads monday.com and performs deterministic BI calculations.

A hybrid design was preferred over allowing an LLM to invent business numbers. Deterministic calculations make financial outputs reproducible and auditable. The trade-off is less flexible semantic planning than a full LLM tool-calling agent.

## monday.com integration
The application reads both boards through monday.com's GraphQL API using server-side token authentication and cursor pagination. No write mutations are sent to the boards. The API token is configured at runtime and is never committed to the public repository.

## Leadership updates
“Leadership update” is interpreted as a concise decision-oriented briefing containing sales pipeline, weighted forecast, won value, concentration, work-order execution, billed/collected/receivable metrics, data-quality risks, and recommended actions. Sales and operational figures remain clearly separated.

## What I'd improve with more time
- Add an LLM planner with structured tool calls for broader natural-language coverage.
- Add automated regression tests and a semantic metric layer.
- Improve entity/date normalization and fiscal-calendar support.
- Add observability, caching, rate-limit handling, and exportable leadership briefs.
