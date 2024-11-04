// Listen for messages from sidepanel.js
const emailList = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchUserList') {
    const userElements = document.querySelectorAll('.p-explorer_grid__cell'); // Update with actual class/selector
     // Array to store the email addresses

    userElements.forEach((userElement, index) => {
      // Add a delay to each click to simulate natural interaction and avoid overwhelming the page
      setTimeout(() => {
        userElement.click(); // Trigger a click event on each user element

        setTimeout(() => {
          // Extract user information here (replace selectors as needed)
          const memberProfiles = document.querySelectorAll('.p-r_member_profile__container')[0];
          const emailElement = memberProfiles.querySelector('a.c-link[href^="mailto:"]'); // Selecting <a> with mailto:

          if (emailElement) {
            const emailHref = emailElement.getAttribute('href'); // Get the href attribute
            const email = emailHref.replace('mailto:', ''); // Extract email address

            emailList.push(email); // Save email to the array
            console.log(`Email ${index + 1}: ${email}`);
            chrome.runtime.sendMessage({ action: 'updateTable', email });
          }

          // Check if we've processed all users
          if (index === userElements.length - 1) {
            // Trigger download of email list as JSON
            downloadEmailsAsJson(emailList);
            // chrome.runtime.sendMessage({ action: 'displayEmails', emails: emailList });
          }

        }, 900); // Wait 100ms after each click
      }, 1000 * index); // Delay each click by 500ms to avoid overwhelming
    });
  }
});

// Function to trigger download of the email list as a JSON file
function downloadEmailsAsJson(emailList) {
  const dataStr = JSON.stringify(emailList, null, 2); // Convert array to JSON string
  const blob = new Blob([dataStr], { type: 'application/json' }); // Create a Blob from the JSON string
  const url = URL.createObjectURL(blob); // Create a URL for the Blob

  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'email_list.json'; // Specify the file name
  document.body.appendChild(a); // Append anchor to the document
  a.click(); // Programmatically click the anchor to trigger the download
  document.body.removeChild(a); // Remove the anchor from the document
  URL.revokeObjectURL(url); // Clean up the URL object
}
