chrome.runtime.onInstalled.addListener(() =>{
    console.log('Extension has been installed.');
    //초기 설정이나 환경 구성을 여기에 넣어줘
});

//메시지 수신 리스너
chrome.runtime.onMessage.addListener((message,sender,sendResponse) =>{
    if(message.type === 'CRAWL_START'){
        //상품 정보 크롤링 시작
        console.log('Starting to crawl product information...');
        //상품 정보를 크롤링하는 함수를 호출, 예시로, fecthProductInfo();를 사용

        //크롤링이 완료되면, 결과를 보내는 코드
        sendResponse({status: 'success',data:'여기에 크롤링 결과 데이터를  포함'});
    }
    return true;
});

//예시 : 상품 정보를 크롤링하는 함수
function fecthProductInfo(url){
    return new Promise((resolve, reject) =>{
        //여기에 HTTP 요청을 사용해 웹페이지의 HTML 을 가져오는 코드를 작성합니다.
        //이 예시에서는 fetch API 를 사용합니다. 실제 환경에서는 CORS 정책에 주의해야 합니다.
        fetch(url)
        .then(response => response.text())
        .then(html => {
            //HTMl에서 필요한 정보를 추출하는 로직을 작성
            //이 부분은 대상 페이지의 구조에 따라 다르게 구현
            //예를 들어 ,DOMParser를 사용하여 HTML 을 분석하고,querySelector 등을 사용해 필요한 데이터를 추출할수있음

            const parser = new DOMParser();
            const doc = parser.parseFromString(html,"text/html");

            //예시: 상품명, 가격,이미지URL 추출
            let productDetails = {
                title: doc.querySelector('.product-title').innerText,
                price: doc.querySelector('.product-price').innerText,
                imageUrl: doc.querySelector('.product-image').src
            };

            resolve(productDetails);
        })
        .catch(error => {
            reject(error);
        });
    });
       
}

//background.js의 메시지 리스너에서 fetchProductInfo 함수를 호출하는 부분을 추가
chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
    if(message.type === 'FETCH_PRODUCT_INFO'){
        fecthProductInfo(message.url).then(productDetails =>{
            //처리 결과를 content script나 popup script에 전송
            sendResponse({status: 'success', data:productDetails});
        }).catch(error => {
            sendResponse({status:'error',message:error.toString()});
        });
        return true;
    }
});