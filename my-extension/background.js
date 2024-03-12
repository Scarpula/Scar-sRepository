// This part remains unchanged
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension has been installed.');
    // Initialization or environmental setup can go here
});

// The following function fetches product info, including multiple images
function fetchProductInfo(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html,"text/html");

            // Extract multiple image URLs; the selector needs to be specific to the website's structure
            let imageUrls = Array.from(doc.querySelectorAll('.product-images img')).map(img => img.src);

            // Ensure at least one image URL was found
            if(imageUrls.length === 0) {
                reject('No images found');
                return;
            }

            let productDetails = {
                title: doc.querySelector('.product-title')?.innerText,
                price: doc.querySelector('.product-price')?.innerText,
                imageUrls: imageUrls  // Notice it's an array of image URLs now
            };

            resolve(productDetails);
        })
        .catch(error => {
            reject(error);
        });
    });
}

// Receiving the message to start crawling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FETCH_PRODUCT_INFO') {
        fetchProductInfo(message.url).then(productDetails => {
            sendResponse({status: 'success', data: productDetails});
        }).catch(error => {
            sendResponse({status: 'error', message: error.toString()});
        });
        return true; // Indicates we will send a response asynchronously
    }
});