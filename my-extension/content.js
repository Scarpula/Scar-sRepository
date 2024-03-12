// Send a message to background.js to initiate the scraping process
chrome.runtime.sendMessage({type: 'FETCH_PRODUCT_INFO', url: window.location.href}, (response) => {
    console.log('Response from background:', response);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_CRAWLING') {
        console.log('Message received from tab:', sender.tab.id);
        console.log('Tab URL:', sender.tab.url);
        try {
            const productTitle = document.querySelector('#productTitle')?.innerText.trim(); 
            const productPrice = document.querySelector('.a-price-whole')?.innerText.trim();
            const imageUrls = Array.from(document.querySelectorAll('.aplus-v2 img')).map(img => img.src || img.getAttribute('data-src'));


            if (imageUrls.length === 0) {
                console.error('이미지를 찾을 수 없습니다.');
                sendResponse({status: 'error', message: '이미지를 찾을 수 없습니다.'});
                return;
            }

            // 추출한 정보를 포함하는 객체
            const productDetails = {
                title: productTitle,
                price: productPrice,
                images: imageUrls
            };

            console.log('크롤링된 상품 정보:', productDetails);
            // 추출한 정보를 background.js로 전송
            sendResponse({status: 'success', data: productDetails});
        } catch (error) {
            console.error('크롤링 중 오류 발생:', error);
            sendResponse({status: 'error', message: error.toString()});
        }
    }

    return true; // 비동기 응답을 위해 true를 반환
});