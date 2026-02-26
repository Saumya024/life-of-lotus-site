# How to Add Chart 2 & Chart 3 Columns to Your Google Sheet

The intake form now **always sends** these 8 fields. Empty string `""` means the user did not add that chart.

| Chart | Field names in JSON | Use for column header (e.g.) |
|-------|--------------------|-----------------------------|
| Chart 2 | `chart2_name`, `chart2_dob`, `chart2_tob`, `chart2_pob` | Chart 2 Name, Chart 2 DOB, Chart 2 TOB, Chart 2 POB |
| Chart 3 | `chart3_name`, `chart3_dob`, `chart3_tob`, `chart3_pob` | Chart 3 Name, Chart 3 DOB, Chart 3 TOB, Chart 3 POB |

---

## Step 1: Open your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com).
2. Open the spreadsheet that receives the intake form data (the one connected to your Apps Script).

---

## Step 2: Add 8 new columns

1. Find the row that has your **headers** (e.g. Name, Email, Phone, DOB, TOB, POB, Area, etc.).
2. After your existing columns, add **8 new column headers**. For example:
   - **Chart 2 Name** | **Chart 2 DOB** | **Chart 2 TOB** | **Chart 2 POB**
   - **Chart 3 Name** | **Chart 3 DOB** | **Chart 3 TOB** | **Chart 3 POB**
3. Note the **column letters** or **positions** (e.g. if your last column was N, the new ones might be O, P, Q, R, S, T, U, V). You’ll need this if you reference columns by letter in the script.

---

## Step 3: Open the Apps Script that receives the form

1. In that same Google Sheet, go to **Extensions** → **Apps Script**.
2. If it asks, sign in with the same Google account that owns the sheet.
3. You’ll see a script file (often `Code.gs`). Open it. This is the script that runs when the intake form sends data to your Web App URL.

---

## Step 4: Find where the script reads the JSON and writes a row

The form sends a **POST** request with a body that includes a field (often named `data`) containing **JSON**. The script will do something like:

- Get the request: `e.postData.contents` or similar.
- Parse JSON: `JSON.parse(...)`.
- Build an array of values for one row, then append it: `sheet.getRange(...).getRows()` and `sheet.appendRow(row)` or `sheet.getRange(1, 1, 1, numCols).setValues([row])`.

You need to find:
- Where the parsed object is used (e.g. `const data = JSON.parse(...)`).
- Where the **row array** is built (e.g. `[data.name, data.email, data.phone, ...]`).

---

## Step 5: Add the 8 chart fields to the row array

Wherever you build the row (the array of values in order), add these 8 values **in the same order as your 8 new columns**:

```javascript
// After your existing fields (name, email, phone, dob, tob, pob, area, etc.), add:

data.chart2_name  || '',   // or (data.chart2_name || '')
data.chart2_dob   || '',
data.chart2_tob   || '',
data.chart2_pob   || '',

data.chart3_name  || '',
data.chart3_dob   || '',
data.chart3_tob   || '',
data.chart3_pob   || ''
```

**Example:** If your row used to look like this:

```javascript
const row = [
  data.name,
  data.email,
  data.phone,
  data.dob,
  data.tob,
  data.pob,
  data.area,
  data.unclear,
  data.sessionType,
  data.duration,
  data.isPackage
];
```

Change it to:

```javascript
const row = [
  data.name,
  data.email,
  data.phone,
  data.dob,
  data.tob,
  data.pob,
  data.area,
  data.unclear,
  data.sessionType,
  data.duration,
  data.isPackage,
  // Chart 2
  (data.chart2_name || ''),
  (data.chart2_dob || ''),
  (data.chart2_tob || ''),
  (data.chart2_pob || ''),
  // Chart 3
  (data.chart3_name || ''),
  (data.chart3_dob || ''),
  (data.chart3_tob || ''),
  (data.chart3_pob || '')
];
```

Use `(data.chart2_name || '')` so that if the field is missing or null, you still write an empty string and the cell stays empty.

---

## Step 6: Save and deploy

1. In Apps Script, click **Save** (or Ctrl+S / Cmd+S).
2. If this is a **Web App** (your intake form posts to a URL):
   - Go to **Deploy** → **Manage deployments**.
   - Open the existing deployment (or create one), choose **Test deployments** or **Version** → **New version**, then **Deploy**.
3. You don’t need to change the Web App URL in your website; the same URL will now receive the new fields.

---

## Step 7: Test

1. On your site, open the intake form.
2. Submit **once without** adding Chart 2 or Chart 3 → in the sheet, the 8 new columns should be **empty**.
3. Submit **once with** Chart 2 filled (and optionally Chart 3) → Chart 2 columns should have values; Chart 3 can be empty if you didn’t add it.

If you share your current Apps Script code (the part that parses the request and appends the row), someone can adapt it exactly to your column order and variable names.