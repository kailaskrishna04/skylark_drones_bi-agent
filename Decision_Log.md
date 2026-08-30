# Skylark Drones — Decision Log

## Assumptions
- monday.com is the runtime source of truth; supplied spreadsheets are import inputs only.
- Calendar quarters are the default unless another fiscal calendar is requested.
- Null/blank values are missing, not zero.
- An unqualified founder-facing “pipeline” question means open sales pipeline.
- Sales pipeline and work-order financials are distinct concepts and are never added together as one revenue figure.

## Data resilience
The source data contains sparse fields, inconsistent text, accidental header-like records and mixed numeric/date representations. The implementation trims and case-normalizes text, parses numeric values conservatively, filters header-like rows, treats missing values separately from zero, and surfaces data-quality caveats. Unit-bearing quantities are not aggregated across incompatible units.

## Architecture and trade-offs
A lightweight Vercel full-stack app was chosen to satisfy public hosting while keeping the implementation small enough for the five-hour constraint. The browser is intentionally thin; the server-side endpoint reads monday.com and performs deterministic BI calculations.

A hybrid design was chosen instead of allowing an LLM to invent business numbers. Intent routing selects the appropriate analysis and deterministic code calculates values from live records. This improves numerical trustworthiness, with the trade-off that a full LLM semantic planner would handle more varied language.

## monday.com integration
The app reads both boards using monday.com's GraphQL API, server-side token authentication, and cursor pagination. No write mutations are sent to the boards.

## Leadership updates
A leadership update is interpreted as a concise decision-oriented briefing containing sales pipeline, weighted forecast, won value, pipeline concentration, work-order execution, billed/collected/receivable metrics, data-quality risks and recommended actions. Sales and operations figures remain separate.

## Improvements with more time
- Add an LLM tool-planning layer with structured tool calls.
- Add automated regression tests and a metric semantic layer.
- Add richer fiscal-calendar/entity-resolution support.
- Add monitoring, retries, caching and exportable leadership briefs.
