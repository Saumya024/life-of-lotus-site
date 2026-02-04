# Troubleshooting Google Sheets Integration

If data is not appearing in your Google Sheet, follow these steps:

## Step 1: Check Google Apps Script Setup

1. **Verify the Script is Deployed:**
   - Go to your Google Sheet
   - Click **Extensions** → **Apps Script**
   - Click **Deploy** → **Manage deployments**
   - Make sure there's an active deployment with "Web app" type
   - Verify the URL matches: `https://script.google.com/macros/s/AKfycbwoPrRkBRXD1opSoV74GOadKyNNBVCiv_ZjQTTf9GoqEHj4Av45ia8msI6Jpil1ICMg/exec`

2. **Check Permissions:**
   - In the deployment settings, make sure "Who has access" is set to **Anyone**
   - If you changed the script, you may need to create a new deployment version

3. **Verify Sheet Name:**
   - Open `google-apps-script.js`
   - Check line 21: `const SHEET_NAME = 'Sheet1';`
   - Make sure this matches your actual sheet tab name (check the bottom of your Google Sheet)
   - If your tab is named differently (e.g., "Bookings", "Tab 1"), update this line

## Step 2: Check Execution Logs

1. **View Execution Logs:**
   - Go to **Extensions** → **Apps Script**
   - Click **Executions** (clock icon) in the left sidebar
   - Look for recent executions
   - Click on any execution to see logs and errors

2. **Check for Errors:**
   - Look for red error messages
   - Common errors:
     - "Sheet not found" → Update `SHEET_NAME` in the script
     - "Permission denied" → Re-authorize the script
     - "Invalid data" → Check the data format being sent

## Step 3: Test the Script Manually

1. **Run Test Function:**
   - In Apps Script editor, select `testDoPost` from the function dropdown
   - Click the Run button (▶️)
   - Authorize if prompted
   - Check the execution log to see if it worked
   - Check your Google Sheet for a test row

2. **Check Browser Console:**
   - Open your website's intake form
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Submit the form
   - Look for any error messages
   - You should see: "Submitting to Google Sheets: {data}"

## Step 4: Verify Headers in Google Sheet

Make sure your Google Sheet has headers in **Row 1**. The script matches these headers:

- Name / name
- Email / email  
- Phone / Phone Number / phone
- Date of Birth / DOB / dob
- Time of Birth / TOB / tob
- Place of Birth / POB / pob
- Area / Primary Area / area
- Unclear / What Feels / unclear
- Session Type / Type / sessionType
- Duration / Minutes / duration
- Package / Is Package / package
- Timestamp / Date Submitted / timestamp

The matching is case-insensitive and looks for keywords, so "Name", "name", "Full Name" all work.

## Step 5: Common Issues and Fixes

### Issue: "Sheet not found" error
**Fix:** Update `SHEET_NAME` constant in `google-apps-script.js` to match your actual sheet tab name.

### Issue: No data appearing
**Possible causes:**
1. Script not deployed or wrong URL
2. Sheet name mismatch
3. Headers not in first row
4. Script needs re-authorization

**Fix:** 
- Re-deploy the script
- Check execution logs
- Verify sheet name

### Issue: Data in wrong columns
**Fix:** The script matches headers by keywords. Make sure your headers contain the expected keywords (see Step 4).

### Issue: Some fields missing
**Fix:** Check that your headers match the expected field names. The script will put empty strings for unmatched headers.

## Step 6: Re-deploy the Script

If nothing works, try re-deploying:

1. Go to **Deploy** → **Manage deployments**
2. Click the pencil icon (✏️) to edit
3. Click **New version**
4. Update description if needed
5. Click **Deploy**
6. Copy the new URL (if it changed)
7. Update `intake.html` with the new URL if needed

## Step 7: Check Network Requests

1. Open browser Developer Tools (F12)
2. Go to **Network** tab
3. Submit the form
4. Look for a request to `script.google.com`
5. Check if it's successful (status 200) or has errors

## Still Not Working?

1. **Check the execution log** in Apps Script for detailed error messages
2. **Verify the web app URL** is correct in `intake.html`
3. **Test with the test function** in Apps Script
4. **Check browser console** for JavaScript errors
5. **Verify sheet permissions** - make sure the script has access

If you're still having issues, check the execution logs in Apps Script - they will show exactly what error occurred.
