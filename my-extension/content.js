//페이지 로드 완료후 실행될 함수
document.addEventListener('DOMContentLoaded',function(){
    //여기에서 웹페이지에서 필요한 정보를 크롤링
    const productDetails = scrapeProductDetails();

    //크롤링한 상품 정보를 background.js로 전송
    chrome.runtime.sendMessage({type: 'PRODUCT_INFO',details:productDetails},(response) =>{
        console.log('Response from background:',response);
    });
});

//상품 정보를 크롤링 하는 함수
function scrapeProductDetails(){
    //상품 정보를 저장할 객체
    let details = {
        title:'',//상품명
        price:0,//가격
        imageUrl:'',//이미지URL
        //추가적으로 필요한 정보들을 여기에 정의
    };

    //예시: 페이지 내에서 상품명,가격,이미지URL 을 추출하는 코드
    //실제 웹페이지의 구조에 따라 이 부분은 달라질 수 있음
    details.title = document.querySelector('.product-title').innerText;
    details.price = document.querySelector('.product-price').innerText;
    details.imageUrl = document.querySelector('.product-image').src;

    return details;
}