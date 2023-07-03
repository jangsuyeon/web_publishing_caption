let mic_list = [];
let select_mic = -1;
let available_port;
let health_time;
let config;
let recorder = undefined;
let url = "ws://127.0.0.1";
let soc;
let resultSTT;
let nowListID = undefined;
let db_path = undefined;
const mic_list_templet = `<li class="select-dot"><input type="hidden" value="setValue"><a class="mic_list_item">setItem</a></li>`;
let system_ready = false;

let healthcheck_intervalID;
let getWordFile_intervalID;
let getWordFile_request = false;
// 설정 파일이 로딩 되었는지 여부 체크용
let is_config_load = false;
// 내부에서 녹음 시작 상태를 저장 하기위한 변수
let is_engineStatus = false;
// 녹음 시작 후 엔진이 준비가 끝나서 바로 시작 할 수 있는 상태인지 확인
let is_engineReadyStatus = false;
// 파일 다운로드 중인지 확인 인터벌 ID
let engineFileDownload_intervalID;
// 메모 데이터 보관
let memoText = "";
// 녹음 타이머 결과물 보관
let recordTime = "[00:00:00]";
// 번역 결제 여부에 따라 트루 펄스
let translate_option = false;
// 번역을 켰을 떄 DB 저장을 위해 대기할 배열
let translate_list = [];
// 엔진 파일 다운로드 중인지 확인하는 변수
// 기본값으로 트루이고 파일을 다운로드 중이면 펄스로 바꾸고 준비가 되면 다시 트루
let isEngineFileReady = true;
// DB에서 사용량 정보 불러와서 저장할 변수
let userRecordData = {};
// 처음 로그인 넘어 와 진입할 때 서버와 사용량 동기화 체크할 변수
// 딱 한번 할꺼라서 대충 만듬
let isFirstCheckRecordData = true;
// 번역 이전 문장 저장용 변수
let beforeTranslateText = '';

$(document).ready(function () {
	if (!is_engineStatus) {
		// 시스템 준비전 기능 경고 기능 연결
		notSystemReady(false);
		// 데이터 베이스 경로 조회
		window.api.database("getDatabasePath");
		// 포트 번호 셋팅 시작
		window.api.engine("setAvailablePort");
		// 핼스카운트 받아오기
		window.api.engine("getHealthTime");
		// config 값 받아오기
		window.api.send("getConfigForEngine");
		// 포트 번호 값 받아오기;
		window.api.engine("getAvailablePort");
		// 엔진 가동
		window.api.engine("engineStart");
		// 사용량 정보 불러오기
		window.api.database("getRecordInfo");
	}
	// 업데이트 확인하기
	window.api.send("getIsUpdate");
});

// 녹음 시작 후 도는 타이머의 데이터 받기
// 받은 데이터 메모 창에 전달 하기
window.api.receive("responseRecordTime", (data) => {
	recordTime = data;
	window.api.send("sendMemoData", data);
});

// 자막창 모드로 부터 수신 받은 데이터
window.api.receive("captionWindowEvent", (data) => {
	$("." + data)[0].click();
});

// 메모 창으로 부터 수신 받은 데이터
window.api.receive("memoWindowEvent", (data) => {
	if (memoText === "") memoText = data;
	else memoText = memoText + "\n" + data;
});

window.api.receive("resultEngineStatus", (response) => {
	console.log("엔진 가동 완료 및 연결 시작");
	if (response === "success") {
		connectEngineSoc();
	} else {
		systemAlertOn("시스템에 문제가 발생했습니다. 관리자에게 문의 바랍니다.");
	}
});

// 초기 config 값 받아오기
window.api.receive("resultConfigForEngine", (response) => {
	// if (isNetworkAuthLevelType === 'Online') response["network"] = true
	// else if (isNetworkAuthLevelType === 'Offline') response["network"] = false
	// else if (isNetworkAuthLevelType === 'OnOffline') response["network"] = true
	setTranslateOption(response);
	config = response;
	is_config_load = true;
	console.log("resultConfigForEngine :", config);
});

// 데이터 베이스 경로 받아오기
window.api.receive("resultDatabasePath", (response) => {
	db_path = response;
});

// 핼스카운트 받아오기
window.api.receive("resultHealthTime", (response) => {
	health_time = response;
	try_count = response;
});

// 포트 번호 받아오기
window.api.receive("resultGetAvailablePort", (response) => {
	available_port = response;
});

// 번역 가능 여부 가져오기 (settingf.js 에서도 받고 있음)
window.api.receive("resultTranslateInfo", (status) => {
	console.log("resultTranslateInfo :", status);
	translate_option = status;
	if (!translate_option) {
		disableTransArea();
	}
});

// 사용량 정보 가져오고 메모리 저장하기
window.api.receive("resultRecordInfo", (response) => {
	userRecordData = response;
	if (isFirstCheckRecordData) {
		// 만약 서버와 동기화가 안됐고 사용량 기록이 있으면 서버에 정보 전송
		if (response.isSyncServer === false) {
			if (response.useSTTTime !== 0 || response.useTRLTime !== 0) {
				console.log("사용량 서버와 동기화 안됨");
				window.api.record("recordServer", response);
			}
		}
	}
	isFirstCheckRecordData = false;
	console.log("resultRecordInfo :", userRecordData);
});

// config 값 받아 오는데 번역에 대한 설정 이때 해야함
// 엔진 옵션에 따라서 동일한 언어로 번역 옵션이 있으면 안되므로 가려야함
// 처음 config 값이 없을땐 대상을 그냥 가리면 되지만 만약 config 값이 존재하는데
// 엔진 언어를 바꾸면 이전 번역 옵션이 가려져 있을테니 다시 해제하고 바뀐 언어는 가려야함
function setTranslateOption(new_config) {
	if (is_config_load) {
		$("#translate-id-" + config["engine_language"]).css({ display: "" });
		$("#translate-id-" + new_config["engine_language"]).css({
			display: "none",
		});
	} else {
		$("#translate-id-" + new_config["engine_language"]).css({
			display: "none",
		});
	}
	if (new_config["engine_language"] === new_config["translate_language"]) {
		$("#translate-language")[0].innerHTML = "없음";
		window.api.send("setConfigData", "translate_language", "없음");
		$(".translate-sec")[0].style = "display: none";
	}
}

function notSystemReady(e) {
	system_ready = e;
	if (e) {
		$(
			".playbtn, .pausebtn, .stopbtn, .export-text, .export-docx, .export-hwpx, .export-wav, .export-word"
		).unbind("click");
	} else {
		$(
			".playbtn, .pausebtn, .stopbtn, .export-text, .export-docx, .export-hwpx, .export-wav, .export-word"
		).on("click", function () {
			systemAlertOn(
				"시스템이 준비 되지 않았습니다. 잠시 후 시도해주시기 바랍니다."
			);
			return;
		});
	}
}

function cancelConnection() {
	soc.send("EngineStop");
	is_engineStatus = false;
	// 번역 리스트 초기화
	translate_list = [];
	is_engineReadyStatus = false;
	if (recorder !== undefined) {
		recorder.stopRecording();
		console.log("recorder stop");
	}
	// 타이머 인터벌 종료
	clearRecordTimer();
	// 버튼 상태 변경
	recordStopAction();
	// 실시간 STT 인터벌 종료
	disableSTTAdjustInterval();
	// 자막모드 상하단 메뉴 가리기 타이머 종료
	clearMenuHideTimer();
	window.api.send("sendHistoryData", "recordStop");
	window.api.send("sendCaptionData", "recordStop");
	window.api.send("sendMemoData", "recordStop");
	$("#loading-text")[0].innerHTML = "Loading...";
	$("#loadingServer").removeClass("on");
}

function sendHealthCount() {
	try {
		soc.send("HealthTime$$" + String(health_time));
	} catch (e) {
		clearInterval(healthcheck_intervalID);
	}
}

function recordUserUseService() {
	window.api.database(
		"updateRecordInfo",
		userRecordData.email,
		userRecordData.password,
		userRecordData.license,
		userRecordData.level,
		userRecordData.levelType,
		userRecordData.totalSTTTime,
		userRecordData.totalTRLTime,
		userRecordData.ableSTTTime,
		userRecordData.ableTRLTime,
		userRecordData.useSTTTime,
		userRecordData.useSTTWord,
		userRecordData.useTRLTime,
		userRecordData.useTRLWord,
		userRecordData.isPromotion,
		userRecordData.isSyncServer,
		userRecordData.isAvailable,
		userRecordData.expirationDate
	);
}

function waitWordFilePath() {
	try {
		soc.send("not yet ??");
	} catch (e) {
		clearInterval(getWordFile_intervalID);
	}
}

function waitEngineFileDownload() {
	try {
		soc.send("download not yet ??");
	} catch (e) {
		clearInterval(engineFileDownload_intervalID);
	}
}

function connectEngineSoc() {
	//웹소켓 연결
	soc = new WebSocket(url + ":" + available_port);
	soc.onopen = function () {
		soc.send(JSON.stringify(config));
		soc.send("HealthTime$$" + String(health_time));
		// 엔진 가동 옵션 정보 불러오기
		soc.send('getEngineSetting')
		soc.send('saveUIDEngineSetting$$' + userData.localId)
		TransferData();
	};
	soc.onerror = function (evt) {
		setTimeout(() => {
			connectEngineSoc();
		}, 2000);
	};
}

function TransferData() {
	healthcheck_intervalID = setInterval(() => {
		sendHealthCount();
		// 엔진이 작동 중 일때만 2초마다 사용량 갱신
		if (is_engineStatus) {
			recordUserUseService();
		}
	}, 2000);

	// 웹소켓 결과물 받기
	// 웹소켓으로 받아서 처리 하는 행위는 ReceiveSoc.js 에서 모두 처리
	soc.onmessage = function (event) {
		resultSTT = event.data.split("$$");
		// 엔진 상태 결과물 웹소켓 받기
		exportWordFilePathCheck();
		engineStatusCheck();
		networkCheck();

		// 엔진 가동 설정값 확인
		let temp = statusEngineSettingOption();
		if (temp) return;

		// 엔진 사용 가능 신호 들어오면 작동 할 수 있게 시그널 다시 보내기
		if (resultSTT[0] === "EngineAvailable") {
			soc.send("EngineStartSignal");
		}
		// 시그널 오고 답변이 오면 그때 엔진 연결
		// 너무 빠르게 동시에 작동 옵션이 작동해서 생겼던 오류라서 이렇게 구조 바꿈
		if (resultSTT[0] === "EngineStartSignalAccept") {
			activateEngine();
		}
		activateEngineSoc();
	};

	// 엔진 준비 완료 이벤트
	notSystemReady(true);

	// 로그아웃 시 엔진 종료
	window.api.receive("disconnectEngine", () => {
		soc.send("SystemShutDown");
	});

	//config 파일 정보 받아옴
	window.api.receive("setConfigForEngine", (response) => {
		// if (isNetworkAuthLevelType === 'Online') response["network"] = true
		// else if (isNetworkAuthLevelType === 'Offline') response["network"] = false
		if (config !== response) {
			setTranslateOption(response);
			if (
				config["input_device"] !== response["input_device"] ||
				config["input_device_volume"] !== response["input_device_volume"] ||
				config["engine_weight"] !== response["engine_weight"] ||
				config["network"] !== response["network"] ||
				config["engine_language"] !== response["engine_language"] ||
				config["performance"] !== response["performance"] ||
				config["word"] !== response["word"]
			) {
				if (is_engineStatus) {
					systemAlertOn(
						"지금은 기록 중 입니다. 변경 사항은 다음 기록 시작 시 적용 됩니다."
					);
				} else {
					soc.send(JSON.stringify(response));
				}
			}
			config = response;
		}
	});

	window.api.receive("resultDatabaseNowList", (response) => {
		try {
			nowListID = response[0]["id"];
			console.log("DB 조회 결과물 :", response[0]["id"]);
			soc.send("AutoSave$$" + db_path + "$$" + nowListID);
		} catch (error) {
			nowListID = undefined;
			console.log("DB 저장 오류 :", response);
		}
	});

	function activateEngine() {
		record_audio();
		window.api.send("sendHistoryData", "recordStart");
		window.api.send("sendCaptionData", "recordActivate");
		window.api.send("sendMemoData", "recordStart");
		let nowListName = new Date().getTime();
		console.log("nowListName :", nowListName);
		window.api.database(
			"insertDatabaseList",
			"제목없음",
			nowListName,
			false,
			false,
			"변환중"
		);
		is_engineStatus = true;
		// 타이머 작동
		startRecordTimer();
		// 버튼 상태 변경
		activatePlayAction();
		// 실시간 STT 출력용 인터벌
		setSTTAdjustInterval();
	}

	// 재생버튼 이벤트 연결
	$(".playbtn").on("click", function () {
		// 시작 전 엔진 권한 설정 값 확인
		// 어드민 계정은 항상 모든 엔진 사용가능
		if (userData.isAdminAccount) {
			isOnlineEngineAuth = true
			isLocalEngineAuth = true
		}
		if (!isOnlineEngineAuth && config.network) {
			saveConfig("network", false);
			config.network = false;
			soc.send(JSON.stringify(config));
			console.log("Online Engine Access Deny");
		}
		if (!isLocalEngineAuth && config.network === false) {
			saveConfig("network", true);
			config.network = true;
			soc.send(JSON.stringify(config));
			console.log("Local Engine Access Deny");
		}
		// 네트워크 상태가 True 면 온라인이므로 서버 연결
		// 아니면 로컬 엔진 작동
		if (!is_engineStatus) {
			// 사용량 정보 불러오기
			window.api.database("getRecordInfo");

			if (!is_config_load) {
				// alert("설정 파일이 로드 되지 않았습니다. 잠시후 시도해 주세요.")
				systemAlertOn(
					"설정 파일이 로드 되지 않았습니다. 잠시후 시도해 주세요."
				);
				return;
			}

			if (mic_list.length === 0) {
				// alert("마이크 설정이 로드 되지 않았거나 입력장치가 없습니다. 잠시후 시도해 주세요.")
				systemAlertOn(
					"마이크 설정이 로드 되지 않았거나 입력장치가 없습니다. 잠시후 시도해 주세요."
				);
				return;
			}

			if (!isEngineFileReady) {
				systemAlertOn("엔진 파일 준비중 입니다. 잠시후 시도해 주세요.");
				return;
			}

			let find_mic_flag = true;

			for (let i = 0; i < mic_list.length; i++) {
				if (config.input_device === mic_list[i].label) {
					find_mic_flag = false;
					select_mic = i;
				}
			}

			if (find_mic_flag) {
				// alert("마이크를 선택해주세요.");
				systemAlertOn("마이크를 선택해주세요.");
				return;
			} else if (userData.isAdminAccount) {
				// 어드민 계정은 프리패스
			} else if (!userData.isPromotion) {
				console.log("userRecordData :", userRecordData);
				console.log("userRecordData config :", config);
				if (!networkStatus) {
					// 조건 걸게 없넹
				} else if (!config.network) {
					// 로컬 사용이니까 패스
				} else if (userRecordData.useSTTTime >= userRecordData.ableSTTTime) {
					systemAlertOn("사용시간을 모두 소진 하였습니다.");
					return;
				}
			}

			$("#loadingServer").addClass("on");
			$("#loading-text")[0].innerHTML = "작동 준비 중입니다.";

			soc.send("EngineStart");
			soc.send(JSON.stringify(config));
		} else {
			let recordbtnname = recordPlayAction();
			window.api.send("sendCaptionData", "recordStart");
			if (recordbtnname.includes("play")) {
				// alert('이미 기록 중 입니다.')
				systemAlertOn("이미 기록 중 입니다.");
			}
			if (recordbtnname.includes("pause")) {
				soc.send("EnginePause$$False");
			}
		}
	});

	// 일시정지 이벤트 연결
	$(".pausebtn").on("click", function () {
		if (!is_engineStatus) {
			// alert('기록 중이 아닙니다.')
			systemAlertOn("기록 중이 아닙니다.");
		} else {
			let recordbtnname = recordPauseAction();
			window.api.send("sendCaptionData", "recordPause");
			if (recordbtnname.includes("play")) {
				soc.send("EnginePause$$True");
			}
			if (recordbtnname.includes("pause")) {
				// alert('이미 일시정지 상태입니다.')
				systemAlertOn("이미 일시정지 상태입니다.");
			}
		}
	});

	// 정지버튼 이벤트 연결
	$(".stopbtn").on("click", function () {
		if (!is_engineStatus) {
			console.log("Engine is Not Activate");
		} else {
			soc.send("EngineStop");
			is_engineStatus = false;
			is_engineReadyStatus = false;
			if (recorder !== undefined) {
				recorder.stopRecording();
				console.log("recorder stop");
			}
			// 타이머 인터벌 종료
			clearRecordTimer();
			// 버튼 상태 변경
			recordStopAction();
			// 실시간 STT 인터벌 종료
			disableSTTAdjustInterval();
			// 자막모드 상하단 메뉴 가리기 타이머 종료
			clearMenuHideTimer();
			// 사용량 DB에 기록하기
			// 엔진이 작동 중일 때만 2초마다 저장하고 녹음 종료전 마지막으로 한번 더 저장
			recordUserUseService();
			window.api.send("sendHistoryData", "recordStop");
			window.api.send("sendCaptionData", "recordStop");
			window.api.send("sendMemoData", "recordStop");
			// 사용시간 서버에 기록하기
			window.api.record("recordServer", userRecordData);

			// 공유기능이 켜져 있으면 같이 종료 할건지 물어보는 이벤트
			if (isConnectSocket || $('.share-start')[0].className.includes('active')) {
				shareDisconnectAlertOnOff(true);
			}
		}
	});

	// 자주쓰는 단어 내보내기
	$(".export-word").on("click", function (e) {
		if (!getWordFile_request) {
			getWordFile_request = true;
			getWordFile_intervalID = setInterval(() => {
				waitWordFilePath();
			}, 500);
			soc.send("getWordFilePath");
		} else {
			console.log("이미 실행 중임");
		}
	});

	// 내보내기 WAV 이벤트 연결
	$(".export-wav").on("click", function (e) {
		let checkmode = $(".list-btn.all-selectbtn")[0].className;
		if (checkmode.includes("active")) {
			if (db_path !== undefined) {
				let list = $(".note-list").find("input");
				for (let i = 0; i < list.length; i++) {
					if ($(".NoteItemNumber-" + String(i)).is(":checked")) {
						soc.send(
							"ExportWAV$$" +
								db_path +
								"$$" +
								$(".NoteItemNumber-" + String(i))[0].className.split(" ")[2]
						);
					}
				}
				console.log("Export Select WAV file");
			}
		} else {
			if (db_path !== undefined) {
				soc.send(
					"ExportWAV$$" + db_path + "$$" + $(".export-NoteSEQ")[0].innerHTML
				);
				console.log("Export WAV file");
			}
		}
	});

	// 내보내기 TXT 이벤트 연결
	$(".export-text").on("click", function (e) {
		let checkmode = $(".list-btn.all-selectbtn")[0].className;
		if (checkmode.includes("active")) {
			if (db_path !== undefined) {
				let list = $(".note-list").find("input");
				for (let i = 0; i < list.length; i++) {
					if ($(".NoteItemNumber-" + String(i)).is(":checked")) {
						soc.send(
							"ExportTXT$$" +
								db_path +
								"$$" +
								$(".NoteItemNumber-" + String(i))[0].className.split(" ")[2]
						);
					}
				}
				console.log("Export Select TEXT file");
			}
		} else {
			if (db_path !== undefined) {
				soc.send(
					"ExportTXT$$" + db_path + "$$" + $(".export-NoteSEQ")[0].innerHTML
				);
				console.log("Export TEXT file");
			}
		}
	});

	// 내보내기 docx 이벤트 연결
	$(".export-docx").on("click", function () {
		let checkmode = $(".list-btn.all-selectbtn")[0].className;
		if (checkmode.includes("active")) {
			if (db_path !== undefined) {
				let list = $(".note-list").find("input");
				for (let i = 0; i < list.length; i++) {
					if ($(".NoteItemNumber-" + String(i)).is(":checked")) {
						soc.send(
							"ExportDOCX$$" +
								db_path +
								"$$" +
								$(".NoteItemNumber-" + String(i))[0].className.split(" ")[2]
						);
					}
				}
				console.log("Export Select DOCX file");
			}
		} else {
			if (db_path !== undefined) {
				soc.send(
					"ExportDOCX$$" + db_path + "$$" + $(".export-NoteSEQ")[0].innerHTML
				);
				console.log("Export DOCX file");
			}
		}
	});

	// 내보내기 hwpx 이벤트 연결
	// $(".export-hwpx").on("click", function () {
	// 	// alert("해당 기능은 현재 지원하지 않습니다.")
	// 	systemAlertOn("해당 기능은 현재 지원하지 않습니다.");
	// 	return;
	// });
	$(".export-hwpx").on("click", function () {
		let checkmode = $(".list-btn.all-selectbtn")[0].className;
		if (checkmode.includes("active")) {
			if (db_path !== undefined) {
				let list = $(".note-list").find("input");
				for (let i = 0; i < list.length; i++) {
					if ($(".NoteItemNumber-" + String(i)).is(":checked")) {
						soc.send(
							"ExportHWPX$$" +
								db_path +
								"$$" +
								$(".NoteItemNumber-" + String(i))[0].className.split(" ")[2]
						);
					}
				}
				console.log("Export Select HWPX file");
			}
		} else {
			if (db_path !== undefined) {
				soc.send(
					"ExportHWPX$$" + db_path + "$$" + $(".export-NoteSEQ")[0].innerHTML
				);
				console.log("Export HWPX file");
			}
		}
	});

	// 초기에 마이크 선택시 사용안함으로 선택함
	// settingf.js 에서 컨트롤 함
	// $($("#mic_select_display").children()[1]).text("사용안함")

	// 마이크 사용권한 획득하고 마이크찾기 함수 실행
	// 스테레오 믹스 있을시에 스테레오 믹스 아이템 먼저 선택이후 없을시에 다른 장치 선택이후 마이크 입력장치 없을시에 마이크 입력안함
	navigator.mediaDevices.enumerateDevices().then(gotDevices);

	// 마이크 선택시에 입력장치 설정 내용 변경하고 입력장치 변경하는 이벤트
	$(document).on("click", ".mic_list_item", function (e) {
		// console.log("mic_list_item");
		// console.log("e", e)

		let user_select_item = parseInt(
			$($(e.target).parent().children()[0]).val()
		);
		select_mic = user_select_item;

		if (user_select_item === 999) {
			// console.log("사용안함 선택")
			$($("#mic_select_display").children()[1]).text("사용안함");
			window.api.send("setConfigData", "input_device", "null");
			p5Mic.disconnect();
		} else {
			$($("#mic_select_display").children()[1]).text(
				mic_list[parseInt(user_select_item)].label
			);
			window.api.send(
				"setConfigData",
				"input_device",
				mic_list[parseInt(user_select_item)].label
			);
			p5Mic.setSource(select_mic);
			fft.setInput(p5Mic);
		}
	});

	//녹음하는 메소드
	function record_audio() {
		navigator.mediaDevices
			.getUserMedia({
				audio: {
					deviceId: mic_list[select_mic].deviceId,
					// echoCancellation: true,
					// noiseSuppression: true,
					autoGainControl: true,
				},
			})
			.then(async function (stream) {
				recorder = RecordRTC(stream, {
					type: "audio",
					recorderType: StereoAudioRecorder,
					timeSlice: 100,
					desiredSampRate: 16000,
					numberOfAudioChannels: 1,
					ondataavailable: function (blob) {
						// console.log(recorder.getInternalRecorder());
						// console.log("recorder", recorder);
						// var data = recorder.getInternalRecorder();
						// console.log("data", data);

						// console.log("data-left", data.leftchannel);
						// console.log("data-right", data.rightChannel);
						const reader = new FileReader();

						reader.addEventListener("loadend", () => {
							// if (!mic_mute) {
							soc.send(reader.result);
							// }
						});
						reader.readAsArrayBuffer(blob);
					},
				});
				recorder.startRecording();
			});
	}
}

// 마이크 찾기 함수 실행
function gotDevices(deviceInfos) {
	mic_list = [];

	let set_once = true;
	let count = 0;

	let stereo_mix_flag = false;

	for (let i = 0; i !== deviceInfos.length; ++i) {
		const deviceInfo = deviceInfos[i];
		// 마이크 찾기 시에 kind를 입력으로 고르고 디폴트인경우랑 아닌경우 2가지가 나오기때문에 디폴트 (기본장치) 인경우 검색 제외
		if (
			deviceInfo.kind === "audioinput" &&
			deviceInfo.deviceId.toLowerCase() !== "default"
		) {
			// console.log("deviceInfo.kind :", deviceInfo.kind);
			// console.log("deviceInfo :", deviceInfo);
			mic_list.push(deviceInfo);
		}
	}

	let templet = mic_list_templet;
	const mic_select_list = $("#mic_select_list");
	mic_select_list.children().remove();
	mic_select_list.append(
		templet.replace("setValue", "999").replace("setItem", "사용안함")
	);
	for (let i = 0; i < mic_list.length; i++) {
		// $("#mic_select_list").append("<li><input type='hidden' value='" + String(i) + "'><a class='mic_list_item'>" + mic_list[i].label + "</a></li>");
		mic_select_list.append(
			templet
				.replace("setValue", String(i))
				.replace("setItem", mic_list[i].label)
		);
	}
	console.log("gotDevices mic list :", mic_list);
	p5Mic.start();
}
