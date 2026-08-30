# Skylark Intelligence — Acceptance Tests

Use these prompts against the deployed app. The expected values are a validation snapshot from the current monday.com boards and can change when the boards change.

## Core tests

### 1. Total pipeline
**Prompt:** `What's our total pipeline value?`

Expected baseline: approximately **₹6,881.52 Lakhs / ₹68.82 Cr**, 49 open deals, 47 with numeric values, 2 missing values.

### 2. Weighted pipeline
**Prompt:** `What is our weighted pipeline and probability coverage?`

Expected baseline: approximately **₹31.33 Cr** weighted pipeline.

Coverage definitions:
- Known probability among all open deals: **47/49 = 95.9%**
- Known probability among open deals with numeric value: **45/47 = 95.7%**
- Probability-covered pipeline value: **97.3%**

### 3. Sector pipeline
**Prompt:** `Show me the open pipeline by sector.`

Top current sectors include Tender, Railways, DSP, Mining and Renewables.

### 4. Work-order financials
**Prompt:** `How much has been billed, collected, and what is currently receivable?`

Expected baseline:
- Billed incl. GST: **₹12.67 Cr**
- Collected incl. GST: **₹9.04 Cr**
- Receivable: **₹3.63 Cr**

### 5. Cross-board analysis
**Prompt:** `Compare Mining sales pipeline with Mining work-order execution.`

Expected baseline:
- Mining open sales pipeline: approximately **₹2.91 Cr**
- Mining work orders: **100**
- Execution status is reported from the Work Orders board.

### 6. Data quality
**Prompt:** `Find data quality issues affecting our pipeline forecast.`

Expected: missing deal values, missing closure probabilities, missing close/tentative close dates, and relevant import/header anomalies.

### 7. Leadership update
**Prompt:** `Give me a leadership update for the business.`

Expected sections: sales pipeline, weighted pipeline, won value, pipeline concentration, work-order execution, billed/collected/receivable, risks, and recommended actions.

## Failure handling

- Remove or invalidate `MONDAY_API_TOKEN` to confirm the app returns a readable configuration error instead of crashing.
- Use an inaccessible board ID in a test environment to confirm the app reports monday API/permission errors cleanly.
- Verify the application never writes mutations to the two source boards.

## Security checks

- API token exists only as a Vercel server environment variable.
- Token is not present in frontend JavaScript or repository files.
- Supplied XLSX/CSV data is not committed to the repository.
