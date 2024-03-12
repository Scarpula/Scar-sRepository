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
                title: document.querySelector('#productTitle')?.innerText.trim(),
                price: document.querySelector('.a-price-whole')?.innerText.trim(),
                imageUrls: Array.from(document.querySelectorAll('.aplus-v2 img')).map(img => img.src || img.getAttribute('data-src'))
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
chrome.runtime.onMessage.addListener((message,sender,sendResponse) =>{
    if(message.type === 'CRAWL_START'){
        console.log('Starting to crawl product infomation from:',message.url);
        //현재 활성 탭에 메세지를 전송하여 content.js 에서 크롤링을 시작하도록 함.
        chrome.tabs.query({active: true, currentWindow: true},function(tabs){
            const currentTabId = tabs[0].id;

            //콘텐츠 스크립트에 메세지를 전송합니다.
            chrome.tabs.sendMessage(currentTabId,{type:"START_CRAWLING"},function(response){
                if(response.status==='success'){
                    console.log('Crawling response received',response.data);
                    //처리 결과를 popup.js나 다른 리스너로 보낼수 있음
                    sendResponse({status: 'success', data: response.data});
                }else{
                    console.error('Crawling failed:',response.message);
                    sendResponse({status:'error',message:response.message});
                }
            });
        });
        return true;
    }
});
function uploadProductToSmartStore(productDetails){
    const apiUrl = "https://api.smartstore.com/products/upload";
    const apiToken = "YOUR_API_TOKEN_HERE";

    fetch(apiUrl,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${apiToken}`
        },
        body:JSON.stringify(productDetails)        
    })
    .then(response => response.json())
    .then(data => {
        console.log("상품 업로드 성공:",data);
        //여기서 팝업 등에 성공 메세지를 보내거나 추가 처리
    })
    .catch(error => {
        console.error("상품 업로드 실패:",error);
        //에러 처리 로직
    });
}   