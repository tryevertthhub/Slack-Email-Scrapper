document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-btn');

  startButton.addEventListener('click', () => {
    const tableBody = document.querySelector('.support-table');
    tableBody.innerHTML = ''; // Clear all rows from the table body

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ['content.js']
        },
        () => {
          chrome.tabs.sendMessage(tabId, { action: 'fetchUserList' });
        }
      );
    });
  });
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateTable') {
    updateTable(request.email);
  }
});

// Function to update the table dynamically
function updateTable(email) {
  const table = document.querySelector('.support-table');

  // Create a new row
  const newRow = table.insertRow();

  // Insert new cells
  const cell1 = newRow.insertCell(0);
  cell1.textContent = email;

  // Optionally, you can add more cells for additional user information
}
