let memoTimerID;
let memoTimer_hor = 0;
let memoTimer_min = 0;
let memoTimer_sec = 0;

// 시간 카운트 하기
function countTime() {
    if (memoTimer_sec === 60) {
        memoTimer_min += 1
        memoTimer_sec = 0
    }
    if (memoTimer_min === 60) {
        memoTimer_hor += 1
        memoTimer_min = 0
    }
    memoTimer_sec += 1
}

// 시간 표기용 문자열 만들기
// [00:00:00] 모양으로 만들기
function setStrTime() {
    let result = '['
    if (memoTimer_hor < 10) {
        result = result + '0' + String(memoTimer_hor)
    } else {
        result = result + String(memoTimer_hor)
    }
    result = result + ':'
    if (memoTimer_min < 10) {
        result = result + '0' + String(memoTimer_min)
    } else {
        result = result + String(memoTimer_min)
    }
    result = result + ':'
    if (memoTimer_sec < 10) {
        result = result + '0' + String(memoTimer_sec)
    } else {
        result = result + String(memoTimer_sec)
    }
    result = result + ']'
    return result
}

// 시간 데이터 인터벌 시간 될때마다 데이터 보내기
function sendRecordTime() {
    let timeResult = setStrTime()
    // 시간 표기 데이터 새로 갱신해 주기
	document.querySelector(".recording-time p").innerHTML = recordTime.slice(1, 9);
    window.api.engine('sendRecordTime', timeResult)
}

// 녹음 타이머 시작하기
function startRecordTimer() {
    memoTimerID = setInterval(() => {
        countTime()
        sendRecordTime()
    }, 1000)
}

// 녹음 타이머 종료 하기
function clearRecordTimer() {
    clearInterval(memoTimerID)
    memoTimer_hor = 0
    memoTimer_min = 0
    memoTimer_sec = 0
    // 시간 표시 초기화
	document.querySelector(".recording-time p").innerHTML = '00:00:00';
}
