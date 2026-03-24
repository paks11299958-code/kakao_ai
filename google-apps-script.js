/**
 * Google Apps Script (GAS) for TalkBell
 * 
 * Instructions:
 * 1. Open Google Sheets.
 * 2. Create a sheet named "회원" (Members) with columns: [Timestamp, Name, Contact, Status].
 * 3. Create a sheet named "상담" (Consultations) with columns: [Timestamp, Content].
 * 4. Go to Extensions > Apps Script.
 * 5. Paste this code.
 * 6. Deploy as "Web App" (Execute as: Me, Who has access: Anyone).
 * 7. Copy the Web App URL and update the VITE_GAS_URL in your .env file.
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const membersSheet = ss.getSheetByName("회원");
  const consultationsSheet = ss.getSheetByName("상담");
  
  const membersData = membersSheet.getDataRange().getValues();
  const consultationsData = consultationsSheet.getDataRange().getValues();
  
  // Skip headers and format members
  const members = membersData.slice(1).map(row => ({
    timestamp: row[0],
    name: maskName(row[1]),
    status: row[3] || "Active"
  })).reverse().slice(0, 10);
  
  // Skip headers and format consultations
  const consultations = consultationsData.slice(1).map(row => ({
    timestamp: row[0],
    content: row[1]
  })).reverse().slice(0, 10);
  
  const result = {
    memberCount: membersData.length - 1,
    recentMembers: members,
    recentConsultations: consultations
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("회원");
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.contact,
    "Pending"
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function maskName(name) {
  if (!name) return "";
  if (name.length <= 1) return "*";
  return name[0] + "*".repeat(name.length - 1);
}
