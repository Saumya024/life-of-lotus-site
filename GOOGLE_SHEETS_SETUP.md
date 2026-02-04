# Google Sheets Integration Setup Instructions

This guide will help you set up the Google Sheets integration for the intake form.

## Step 1: Open Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1JAJh_uGHo6VBHtWtiiOMzWc0zTnSNX7DPKvbl5e2r68/edit
2. Click on **Extensions** → **Apps Script**
3. A new tab will open with the Apps Script editor

## Step 2: Add the Script Code

1. In the Apps Script editor, delete any existing code
2. Copy the entire contents of `google-apps-script.js` file
3. Paste it into the Apps Script editor
4. **Important**: Update the `SHEET_NAME` constant on line 20 if your sheet tab is not named "Sheet1"
   - Look at the bottom of your Google Sheet to see the tab name
   - Replace `'Sheet1'` with your actual tab name (e.g., `'Tab 1'`, `'Bookings'`, etc.)

## Step 3: Save the Script

1. Click **File** → **Save** (or press Ctrl+S / Cmd+S)
2. Give your project a name (e.g., "Intake Form Web App")
3. Click **Save**

## Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app** from the dropdown
4. Fill in the deployment settings:
   - **Description**: "Intake Form Web App" (or any description you prefer)
   - **Execute as**: Select **Me** (your email address)
   - **Who has access**: Select **Anyone** (this allows your website to submit data)
5. Click **Deploy**
6. You may be prompted to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow** to grant permissions
7. After authorization, you'll see a **Web app URL**
8. **Copy this URL** - you'll need it in the next step

## Step 5: Update the Intake Form

1. Open `intake.html` in your code editor
2. Find this line (around line 760):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with the Web app URL you copied
   - Make sure to keep the quotes: `'https://script.google.com/...'`
4. Save the file

## Step 6: Set Up Headers in Google Sheet

Make sure your Google Sheet has headers in the first row. The script will automatically match form fields to headers. Supported header names include:

- **Name**: "Name", "name"
- **Email**: "Email", "email"
- **Phone**: "Phone", "Phone Number", "phone"
- **Date of Birth**: "Date of Birth", "DOB", "Birth Date", "dob"
- **Time of Birth**: "Time of Birth", "TOB", "Birth Time", "tob"
- **Place of Birth**: "Place of Birth", "POB", "Birth Place", "pob"
- **Primary Area**: "Area", "Primary Area", "Guidance", "area"
- **Unclear Question**: "Unclear", "What Feels", "Question", "unclear"
- **Session Type**: "Session Type", "Type", "Audio/Video", "sessionType"
- **Duration**: "Duration", "Minutes", "duration"
- **Package**: "Package", "Is Package", "package"
- **Timestamp**: "Timestamp", "Date Submitted", "Submitted", "timestamp"

The script will automatically match these fields and add a timestamp when a form is submitted.

## Step 7: Test the Integration

1. Open your website's intake form
2. Fill out the form with test data
3. Click "Book Slot"
4. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

### Data not appearing in sheet?
- Check that the Web App URL is correct in `intake.html`
- Verify the sheet name matches in the Apps Script code
- Check the Apps Script execution log: **View** → **Execution log**
- Make sure headers are in the first row of your sheet

### Permission errors?
- Make sure "Who has access" is set to **Anyone** in the deployment settings
- Re-authorize the script if needed

### Headers not matching?
- The script uses case-insensitive matching
- Make sure your headers contain keywords like "name", "email", "phone", etc.
- You can modify the matching logic in `google-apps-script.js` if needed

## Notes

- The form submission to Google Sheets happens in the background and won't block the user from booking
- If the Google Sheets submission fails, the user can still proceed with booking
- All form fields are captured, including optional ones (they'll be empty strings if not filled)
- The timestamp is automatically added when data is submitted
