// Send a message to background.js to initiate the scraping process
chrome.runtime.sendMessage({type: 'FETCH_PRODUCT_INFO', url: window.location.href}, (response) => {
    console.log('Response from background:', response);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_CRAWLING') {
        // 현재 페이지에서 필요한 정보를 추출하는 로직
        try {
            const productTitle = document.querySelector('.product-title')?.innerText || '제목 없음';
            const productPrice = document.querySelector('.product-price')?.innerText || '가격 정보 없음';
            const productImageUrls = Array.from(document.querySelectorAll('.product-image img')).map(img => img.src);

            if (productImageUrls.length === 0) {
                console.error('이미지를 찾을 수 없습니다.');
                sendResponse({status: 'error', message: '이미지를 찾을 수 없습니다.'});
                return;
            }

            // 추출한 정보를 포함하는 객체
            const productDetails = {
                title: productTitle,
                price: productPrice,
                images: productImageUrls
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