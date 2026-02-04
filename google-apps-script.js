/**
 * Google Apps Script Web App for Intake Form Submission
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1JAJh_uGHo6VBHtWtiiOMzWc0zTnSNX7DPKvbl5e2r68/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Replace 'YOUR_SHEET_NAME' with your actual sheet name (usually 'Sheet1' or the tab name)
 * 5. Click "Deploy" > "New deployment"
 * 6. Click the gear icon next to "Select type" and choose "Web app"
 * 7. Set:
 *    - Description: "Intake Form Web App"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 8. Click "Deploy"
 * 9. Copy the Web App URL and use it in intake.html
 * 10. Click "Authorize access" and grant permissions
 */

// Replace 'Sheet1' with your actual sheet name/tab name
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    let data;
    
    // Handle both JSON and form data
    if (e.postData && e.postData.contents) {
      // Try to parse as JSON first
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonError) {
        // If not JSON, try to get from form data
        if (e.parameter && e.parameter.data) {
          data = JSON.parse(e.parameter.data);
        } else {
          // Use parameters directly if they exist
          data = e.parameter || {};
        }
      }
    } else if (e.parameter) {
      // Handle form data with 'data' field containing JSON
      if (e.parameter.data) {
        data = JSON.parse(e.parameter.data);
      } else {
        // Use parameters directly
        data = e.parameter;
      }
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No data received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet by ID
    const spreadsheetId = '1JAJh_uGHo6VBHtWtiiOMzWc0zTnSNX7DPKvbl5e2r68';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Sheet not found: ' + SHEET_NAME
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if sheet is empty or has headers
    const lastRow = sheet.getLastRow();
    let headers = [];
    let rowData = [];
    
    if (lastRow === 0) {
      // Sheet is empty - create headers and add data
      headers = ['Name', 'Email', 'Phone', 'Date of Birth', 'Time of Birth', 'Place of Birth', 'Primary Area', 'Unclear Question', 'Session Type', 'Duration', 'Package', 'Timestamp'];
      rowData = [
        data.name || '',
        data.email || '',
        data.phone || '',
        data.dob || '',
        data.tob || '',
        data.pob || '',
        data.area || '',
        data.unclear || '',
        data.sessionType || '',
        data.duration || '',
        data.isPackage ? 'Yes' : 'No',
        new Date()
      ];
      
      // Add headers as first row
      sheet.appendRow(headers);
      // Add data as second row
      sheet.appendRow(rowData);
      
      Logger.log('Sheet was empty - created headers and added first row');
    } else {
      // Sheet has data - get headers from first row
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Prepare the row data in the same order as headers
      rowData = headers.map(header => {
        // Normalize header names (remove extra spaces, convert to lowercase for matching)
        const normalizedHeader = header.toString().toLowerCase().trim();
        
        // Map form fields to sheet headers (case-insensitive matching)
        if (normalizedHeader.includes('name') && !normalizedHeader.includes('phone')) {
          return data.name || '';
        } else if (normalizedHeader.includes('email')) {
          return data.email || '';
        } else if (normalizedHeader.includes('phone')) {
          return data.phone || '';
        } else if (normalizedHeader.includes('date of birth') || normalizedHeader.includes('dob')) {
          return data.dob || '';
        } else if (normalizedHeader.includes('time of birth') || normalizedHeader.includes('tob')) {
          return data.tob || '';
        } else if (normalizedHeader.includes('place of birth') || normalizedHeader.includes('pob')) {
          return data.pob || '';
        } else if (normalizedHeader.includes('area') || normalizedHeader.includes('primary area') || normalizedHeader.includes('guidance')) {
          return data.area || '';
        } else if (normalizedHeader.includes('unclear') || normalizedHeader.includes('what feels') || normalizedHeader.includes('question')) {
          return data.unclear || '';
        } else if (normalizedHeader.includes('session type') || normalizedHeader.includes('type')) {
          return data.sessionType || '';
        } else if (normalizedHeader.includes('duration') || normalizedHeader.includes('minutes')) {
          return data.duration || '';
        } else if (normalizedHeader.includes('package')) {
          return data.isPackage ? 'Yes' : 'No';
        } else if (normalizedHeader.includes('timestamp') || normalizedHeader.includes('date submitted') || normalizedHeader.includes('submitted')) {
          return new Date();
        } else {
          // If header doesn't match any known field, return empty string
          return '';
        }
      });
      
      // Append the row to the sheet
      sheet.appendRow(rowData);
    }
    
    // Log the data being processed (for debugging - check Apps Script execution log)
    Logger.log('Received data: ' + JSON.stringify(data));
    Logger.log('Headers: ' + JSON.stringify(headers));
    Logger.log('Row data: ' + JSON.stringify(rowData));
    Logger.log('Sheet last row before append: ' + lastRow);
    
    // Log success
    Logger.log('Row appended successfully');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error details
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing in Apps Script editor)
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        dob: '1990-01-01',
        tob: '10:00',
        pob: 'New York, USA',
        area: 'Career & Finances',
        unclear: 'Test question',
        sessionType: 'audio',
        duration: '60',
        isPackage: false
      })
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
