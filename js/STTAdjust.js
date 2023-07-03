// 반복 쓰레드 인터벌 변수
let sttAdjustInterval = '';
// 실시간 문장 누적 저장용 변수
let nowRealTimeSTTResult = '';
// 이전 문장 저장용 변수
let beforeRealTimeSTTResult = '';
// 실제 출력할 변수
let printRealTimeSTTResult = '';
// 임시 최대 길이 저장용 변수
let firstSTTTextIdx = 0;
// 임시 저장용 시작시간 변수
let tempRealTimeSTTResultStartTime = '';
// 대상 엘리먼트
const realTimeTextElement = $('.real-time-text');
const realTimeScrollElement = $('.real-time-single');

function accumulateSTT() {
    if (resultSTT[1] === 'False' && resultSTT[2] !== '' && resultSTT[2] !== undefined) {
        // 문장의 시작 시간이 다르면 임시 변수에 저장
        if (tempRealTimeSTTResultStartTime !== resultSTT[3]) {
            tempRealTimeSTTResultStartTime = resultSTT[3]
            beforeRealTimeSTTResult = nowRealTimeSTTResult
        }
        // 나온 결과는 무조건 저장하기
        nowRealTimeSTTResult = resultSTT[2]

        // beforeRealTimeSTTResult 가 빈 값이 아닐 경우 다음줄로 넘기기
        if (beforeRealTimeSTTResult !== '') {
            printRealTimeSTTResult = beforeRealTimeSTTResult + '<br>' + nowRealTimeSTTResult
        }
        // beforeRealTimeSTTResult 가 빈값이면 한줄로만 표기하기
        else {
            printRealTimeSTTResult = nowRealTimeSTTResult
        }
    }
}

function sttAdjust() {
    firstSTTTextIdx = beforeRealTimeSTTResult.indexOf(' ') + 1
    beforeRealTimeSTTResult = beforeRealTimeSTTResult.slice(firstSTTTextIdx)
}

function setSTTAdjustInterval() {
    sttAdjustInterval = setInterval(() => {
        accumulateSTT()
        if (isOverflown()) {
            // sttAdjust()
        }
        realTimeTextElement[0].innerHTML = printRealTimeSTTResult
    }, 100)
}

function disableSTTAdjustInterval() {
    clearInterval(sttAdjustInterval)
    printRealTimeSTTResult = ''
    sttAdjustInterval = ''
    nowRealTimeSTTResult = ''
    beforeRealTimeSTTResult = ''
    firstSTTTextIdx = 0
    tempRealTimeSTTResultStartTime = ''
}

// 대상 박스의 높이와 출력되는 p 태그의 높이 값을 비교
// 만약 p 태그의 높이가 대상 박스보다 커지면 스크롤이 생김
function isOverflown() {
    // console.log("realTimeScrollElement :", realTimeScrollElement[0].clientHeight)
    // console.log('realTimeTextElement :', realTimeTextElement[0].clientHeight)
    // console.log('font :', $('.text-sec-sec').css('font-size'))
    // console.log('len :', realTimeTextElement[0].innerHTML.length)
    // console.log("realTimeScrollElement :", realTimeScrollElement[0].clientWidth)
    // console.log('realTimeTextElement :', realTimeTextElement[0].clientWidth)
    realTimeScrollElement[0].scrollTop = realTimeScrollElement[0].scrollHeight
    return realTimeScrollElement[0].clientHeight < realTimeTextElement[0].clientHeight
}
// 걸고 하는 겁니다 지뢰 제거를 전담하는 군 장병에게 지급되는 위험 근무 수당은 병사의 경우 하루에 삼천구 위강급 장교도 육천
//
// 16 = 69
// 17 = 65
// 18 = 61
// 19 = 58
