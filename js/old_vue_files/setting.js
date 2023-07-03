// import './jquery/3.6.0/jquery.min.js'
// import './script.js'
// import './script.js'

export default {
    template: `
    <div id="tab1" class="cont" style="display: block;">
        <div class="setting-info border-14 padding-set">
            <p class="setting-warning">
                <span>설정</span>
                <img src="../img/!.svg" alt="설정"/>
            </p>
            <div class="setting-hover">
                <p>회원정보, 캡션 멤버십, 서비스 기간, 업데이트 등 정보를 확인하고 설정하세요 </p>
            </div>
        </div>
        <div class="setting-select border-14 padding-set">
            <div class="setting-box">
                <div id="setting1" class="inline-box" data-langNum="7">입력장치 설정</div>
                <div class="inline-box select-box-empty" style="height: 60px;">
                    <div class="select-box" id="audio-select">
                        <div id="mic_select_display" class="select-choice">
                            <span class="select-arrow"></span>
                            <p class="ellipsis">스테레오 믹스(Realtek high Definition)</p>
                        </div>
                        <div class="select-list">
                            <ul id="mic_select_list">
                                <li>
                                    <!--                      <a href="">사용안함</a>-->
                                    <a>사용안함</a>
    
                                </li>
                                <!--                    <li>-->
                                <!--                      <a href="">시스템 기본스피커</a>-->
                                <!--                    </li>-->
                                <!--                    <li>-->
                                <!--                      <a href="">스테레오 믹스</a>-->
                                <!--                    </li>-->
                                <!--                    <li>-->
                                <!--                      <a href="">기타장치</a>-->
                                <!--                    </li>-->
                            </ul>
                        </div>
                    </div>
                    <div class="slidecontainer-s">
                        <input type="range" min="16" max="40" value="50" class="slider-s" id="myRange">
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting2" class="inline-box" data-langNum="9">음성인식언어</div>
                <div class="inline-box">
                    <div class="swichbox right" id="engine_language">
                        <a class="swichbtn">한국어</a>
                        <a class="swichbtn">영어</a>
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting3" class="inline-box" data-langNum="10">성능품질</div>
                <div class="inline-box">
                    <div class="swichbox right" id="performance">
                        <a class="swichbtn" data-langNum="11">성능</a>
                        <a class="swichbtn" data-langNum="12">품질</a>
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting4" class="inline-box" data-langNum="13">시스템 언어</div>
                <div class="inline-box select-box-empty">
                    <div class="select-box" id="system-select">
                        <div class="select-choice">
                            <span class="select-arrow"></span>
                            <p id="system_language_text">한국어</p>
                        </div>
                        <div class="select-list">
                            <ul>
                                <li>
                                    <a href="javascript:void(0);" id="system_language_ko" data-lang="ko">한국어</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" id="system_language_en" data-lang="en">영어</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting5" class="inline-box" data-langNum="14">힌트텍스트</div>
                <div class="inline-box">
                    <div class="swichbox right" id="hint">
                        <a class="swichbtn">on</a>
                        <a class="swichbtn">off</a>
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting6" class="inline-box" data-langNum="15">작동방식설정</div>
                <div class="inline-box">
                    <div class="swichbox right" id="network">
                        <a class="swichbtn" data-langNum="16">온라인</a>
                        <a class="swichbtn" data-langNum="17">오프라인</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-select padding-set">
            <div class="setting-box">
                <div id="setting7" class="inline-box">번역언어<span class="payimg"></span></div>
                <div class="inline-box select-box-empty">
                    <div class="select-box" id="lang-select">
                        <div class="select-choice">
                            <span class="select-arrow"></span>
                            <p>한국어</p>
                        </div>
                        <div class="select-list select-list-up">
                            <ul>
                                <li>
                                    <a href="">한국어</a>
                                </li>
                                <li>
                                    <a href="">영어</a>
                                </li>
                                <li>
                                    <a href="">중국어</a>
                                </li>
                                <li>
                                    <a href="">일본어</a>
                                </li>
                                <li>
                                    <a href="">태국어</a>
                                </li>
                                <li>
                                    <a href="">몽골어</a>
                                </li>
                                <li>
                                    <a href="">러시아어</a>
                                </li>
                                <li>
                                    <a href="">스페인어</a>
                                </li>
                                <li>
                                    <a href="">베트남어</a>
                                </li>
                                <li>
                                    <a href="">필리핀어</a>
                                </li>
                                <li>
                                    <a href="">말레이어</a>
                                </li>
                                <li>
                                    <a href="">우즈베크어</a>
                                </li>
                                <li>
                                    <a href="">인도네시아어</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-box">
                <div id="setting8" class="inline-box">번역 보기 설정<span class="payimg"></span></div>
                <div class="inline-box select-box-empty">
                    <div class="select-box" id="trans-select">
                        <div class="select-choice">
                            <span class="select-arrow"></span>
                            <p>원문 + 번역문</p>
                        </div>
                        <div class="select-list select-list-up">
                            <ul>
                                <li>
                                    <a href="">원문 + 번역문</a>
                                </li>
                                <li>
                                    <a href="">번역문</a>
                                </li>
                                <li>
                                    <a href="">꺼짐</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}


// import {createApp} from "./vue@3.2.37/vue.esm-browser.js";

// createApp({
//   data: () => ({
//     pagelist: ['setting', 'mypage', 'list', 'word'],
//     currentpage: 'setting',
//   }),
//
//   created() {
//     // fetch on init
//     this.fetchData()
//   },
//
//   watch: {
//     // re-fetch whenever currentBranch changes
//     currentpage: 'ChangePage'
//   },
//
//   methods: {
//     ChangePage(v) {
//       const newline = v.indexOf('\n')
//       return newline > 0 ? v.slice(0, newline) : v
//     },
//   }
// }).mount('#app')

