// Send a message to background.js to initiate the scraping process
chrome.runtime.sendMessage({type: 'FETCH_PRODUCT_INFO', url: window.location.href}, (response) => {
    console.log('Response from background:', response);
});

// This file no longer needs to directly scrape details since background.js will handle that