# Update Google Apps Script - IMPORTANT

The Google Apps Script code has been updated to fix the data submission issue. You need to update the script in your Google Sheet.

## Steps to Update:

1. **Open your Google Sheet:**
   - Go to: https://docs.google.com/spreadsheets/d/1JAJh_uGHo6VBHtWtiiOMzWc0zTnSNX7DPKvbl5e2r68/edit

2. **Open Apps Script:**
   - Click **Extensions** → **Apps Script**

3. **Replace the Code:**
   - Delete ALL existing code in the editor
   - Copy the ENTIRE contents of `google-apps-script.js` file
   - Paste it into the Apps Script editor

4. **Verify Sheet Name:**
   - Check line 21: `const SHEET_NAME = 'Sheet1';`
   - Make sure this matches your actual sheet tab name (should be 'Sheet1')

5. **Save:**
   - Click **File** → **Save** (or Ctrl+S / Cmd+S)

6. **Create New Deployment Version:**
   - Click **Deploy** → **Manage deployments**
   - Click the pencil icon (✏️) next to your existing deployment
   - Click **New version**
   - Click **Deploy**
   - **IMPORTANT:** Copy the new Web App URL if it changed
   - If the URL changed, update it in `intake.html` (line 751)

7. **Test:**
   - Submit a test form
   - Check your Google Sheet - data should appear
   - Check Apps Script execution logs: **View** → **Executions**

## What Was Fixed:

- ✅ Script now handles empty sheets (creates headers automatically)
- ✅ Better error handling and logging
- ✅ Improved data matching logic
- ✅ More detailed logging for debugging

## If Data Still Doesn't Appear:

1. **Check Execution Logs:**
   - In Apps Script, click **Executions** (clock icon)
   - Look for recent executions when you submit the form
   - Click on an execution to see logs and any errors

2. **Check Browser Console:**
   - Open your website's intake form
   - Open Developer Tools (F12) → Console tab
   - Submit the form
   - Look for: "Submitting to Google Sheets: {data}"
   - Check for any error messages

3. **Verify Sheet Name:**
   - Make sure the sheet tab is named exactly "Sheet1" (case-sensitive)
   - Or update line 21 in the script to match your actual tab name

4. **Check Permissions:**
   - Make sure "Who has access" is set to **Anyone** in deployment settings
   - Re-authorize if needed

## Expected Behavior:

- If your sheet is **empty**: The script will create headers and add the first row of data
- If your sheet **has headers**: The script will match form fields to headers and append data
- All data will be logged in the execution logs for debugging
