document.getElementById('uploadButton').addEventListener('click', () => {
    // Clear any previous status
    document.getElementById('status').textContent = '';

    // Initiate the scraping and upload process
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: scrapeAndUploadProductDetails
        });
    });
});

function scrapeAndUploadProductDetails() {
    // This function will be injected and executed in the context of the current tab
    chrome.runtime.sendMessage({type: 'CRAWL_START'}, (response) => {
        if (response.status === 'success') {
            console.log('Scraping succeeded:', response.data);
        } else {
            console.error('Scraping failed:', response.message);
        }
    });
}