document.addEventListener('DOMContentLoaded', function() {
    var uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', function() {
        // 현재 활성 탭의 URL을 background.js에 보내 크롤링 시작
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.runtime.sendMessage({
                type: 'CRAWL_START',
                url: tabs[0].url // 현재 활성 탭의 URL을 보냅니다.
            }, function(response) {
                // 크롤링 결과에 따라 상태 메시지를 업데이트
                var statusElement = document.getElementById('status');
                if(response && response.status === 'success') {
                    statusElement.textContent = '업로드 성공!';
                } else {
                    statusElement.textContent = '업로드 실패: ' + (response ? response.message : '응답 없음');
                }
            });
        });
    });
});