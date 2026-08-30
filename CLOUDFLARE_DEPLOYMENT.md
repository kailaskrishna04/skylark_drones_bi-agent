# Free public deployment with Cloudflare Pages

The repository uses Cloudflare Pages + Pages Functions. The frontend is `index.html`; the server-side monday.com API endpoint is `functions/api/query.js` and is available at `/api/query`.

## 1. Open Cloudflare

Go to:
https://dash.cloudflare.com/

Create a free account or sign in.

## 2. Create the Pages project

Open **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**.

Select the public GitHub repository:
`kailaskrishna04/skylark_drones_bi-agent`

Set:

- Production branch: `main`
- Build command: leave blank (or `exit 0`)
- Build output directory: `.`

Then click **Save and Deploy**.

Cloudflare will create a public `*.pages.dev` URL.

## 3. Add monday.com secrets

Open the Pages project → **Settings** → **Variables and Secrets** → **Add**.

Add these values for Production:

```text
MONDAY_API_TOKEN=<NEW_MONDAY_TOKEN>
DEALS_BOARD_ID=5030964576
WORK_ORDERS_BOARD_ID=5030964591
```

`MONDAY_API_TOKEN` must be a secret/environment variable. Never put it in `index.html`, client-side JavaScript, or GitHub.

## 4. Redeploy

After saving the variables, trigger a new deployment.

## 5. Test publicly

Open the generated `https://<project>.pages.dev` URL in an incognito/private browser.

Test:

- What's our total pipeline value?
- What is our weighted pipeline and probability coverage?
- Show me the open pipeline by sector.
- How much has been billed, collected, and what is currently receivable?
- Compare Mining sales pipeline with Mining work-order execution.
- Find data quality issues affecting our pipeline forecast.
- Give me a leadership update for the business.

Expected validation snapshot:
- Open pipeline ≈ ₹68.82 Cr
- Weighted pipeline ≈ ₹31.33 Cr
- Probability coverage = 47/49 (95.9%)
- Billed incl. GST ≈ ₹12.67 Cr
- Collected incl. GST ≈ ₹9.04 Cr
- Receivable ≈ ₹3.63 Cr

These values can change if the monday.com boards change.
