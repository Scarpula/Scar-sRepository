document.getElementById('uploadButton').addEventListener('click',() =>{
    //상품 업로드를 시작하기 위해 background.js에 메세지를 보냄.
    chrome.runtime.sendMessage({type:'UPLOAD_START'},(response)=>{
        document.getElementById('status').textContent = '업로드 중...';
        //background.js로부터 응답을 받은 후 상태 없데이트
        if (response.status === 'success'){
            document.getElementById('status').textContent = '업로드 완료!'; 
        }else{
            document.getElementById('status').textContent = '업로드 실패.';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    var uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', function() {
        // 사용자 입력을 변수에 저장
        var productName = document.getElementById('productName').value;
        var productPrice = document.getElementById('productPrice').value;
        var productImage = document.getElementById('productImage').value;

        // background.js로 메시지 전송
        chrome.runtime.sendMessage({
            type: 'UPLOAD_PRODUCT',
            name: productName,
            price: productPrice,
            image: productImage
        }, function(response) {
            console.log('Upload initiated', response);
        });
    });
});