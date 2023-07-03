function exportWordFilePathCheck() {
	// 상태에 대한 str만 왔으면 $$ 스플릿 하면 어차피 무조건 0번 배열이기에 [0] 배열 체크
	if (resultSTT[0] === "resultExportWordFilePath") {
		getWordFile_request = false;
		clearInterval(getWordFile_intervalID);
		window.api.send("ExportNewWordFilePath", resultSTT[1]);
	}
}

function engineStatusCheck() {
	if (resultSTT[0] === "EngineFilesDownloading") {
		// alert('프로그램 작동에 필요한 파일을 다운로드 중입니다. 잠시만 기다려 주십시오.')
		systemAlertOn(
			"프로그램 작동에 필요한 파일을 다운로드 중입니다. 잠시만 기다려 주십시오."
		);
	}
	if (resultSTT[0] === "engineFileDownloadStatus") {
		isEngineFileReady = false;
		$(".download-count").text(resultSTT[1]);
		$(".gauge").css({ width: resultSTT[1] });
	}
	if (resultSTT[0] === "engineFileDownloadComplete") {
		$(".download-loading").text("파일 다운로드 완료");
	}
	if (resultSTT[0] === "engineFileExtractFile") {
		$(".download-loading").text("압축 해제 중...");
	}
	if (resultSTT[0] === "engineFileExtractFileStatus") {
		$(".download-count").text(resultSTT[1]);
		$(".gauge").css({ width: resultSTT[1] });
	}
	if (resultSTT[0] === "engineFileExtractFileName") {
		$(".download-loading").text(resultSTT[1]);
	}
	if (resultSTT[0] === "engineFileExtractFileComplete") {
		// 엔진 바로 시작하기위해 직전에 설정 값 가져오고
		window.api.send("getConfigForEngine");
		$(".download-com").show();
		$(".download-loading").hide();
		isEngineFileReady = true;
		// 확인용 인터벌 종료 시키고
		clearInterval(engineFileDownload_intervalID);
		// 서버에 설정 데이터 보내면
		// 서버에서 로컬 엔진 설정 읽고 자동 시작함
		soc.send(JSON.stringify(config));
	}
	if (resultSTT[0] === "completeEngineFilesDownload") {
		if (resultSTT[1] === "complete") {
			clearInterval(engineFileDownload_intervalID);
		}
	}
	if (resultSTT[0] === "EngineFilesNotExist") {
		is_engineStatus = false;
		systemFileDownloadOn(
			"프로그램 작동에 필요한 파일이 없습니다. 파일 다운로드를 하시겠습니까?"
		);
	}
	if (resultSTT[0] === "EngineFileDownloadFail") {
		cancelConnection();
		isEngineFileReady = true;
		clearInterval(engineFileDownload_intervalID);
		$(".download-loading").text("");
		$(".file-download-box").css({ display: "none" });
		systemAlertOn("엔진 파일 다운로드에 실패 하였습니다.");
	}
}

function fileDownloadActivate() {
	// 0.01초 마다 엔진 다운로드가 완료 되었는지 확인하기
	engineFileDownload_intervalID = setInterval(() => {
		waitEngineFileDownload();
	}, 1);
	soc.send("EngineFilesDownload");
	cancelConnection();
	systemFileDownloadOff();
	$(".download-loading").text("다운로드 중...");
	$(".file-download-box").css({ display: "" });
}

function networkCheck() {
	if (resultSTT[0] === "systemNetworkStatus") {
		if (resultSTT[1] === "False") {
			systemAlertOn("PC 인터넷 연결이 없습니다.");
			window.api.send("setSystemNetworkStatus", false);
		} else {
			window.api.send("setSystemNetworkStatus", true);
		}
	}
	if (resultSTT[0] === "pleaseConfirmSystemNetWork") {
		cancelConnection();
		isEngineFileReady = true;
		clearInterval(engineFileDownload_intervalID);
		$(".download-loading").text("");
		$(".file-download-box").css({ display: "none" });
		systemAlertOn("시스템 인터넷 연결을 확인하여 주십시오.");
	}
}

function activateEngineSoc() {
	if (is_engineStatus) {
		if (resultSTT[0] === "isAlive") {
			// console.log("Engine is Alive")
			return;
		}
		// console.log("result STT :", resultSTT)
		// 상태에 대한 결과가 모두 아니면 배열안에는 아래 항목이 있음
		// resultSTT[0] = 실시간 자막 여부 True 면 실시간
		// resultSTT[1] = 문장 완성 여부 True 면 완성
		// resultSTT[2] = 처리된 문장
		// resultSTT[3] = 시작 시간
		// resultSTT[4] = 종료 시간
		// 엔진 서버로부터 받는 시그널
		if (resultSTT[0].includes("WatingNumberis")) {
			if ($("#loadingServer")[0].className.includes("on")) {
				// ㅇㅅㅇ
			} else {
				$("#loadingServer").addClass("on");
			}
			$("#loading-text")[0].innerHTML =
				"온라인 서버가 준비 중입니다.<br>대기열 " + resultSTT[0].split("_")[1];
			return;
		} else if (resultSTT[0].includes("TkitaServeServer")) {
			if ($("#loadingServer")[0].className.includes("on")) {
				// ㅇㅅㅇ
			} else {
				$("#loadingServer").addClass("on");
			}
			if (resultSTT[0].includes("IsDead")) {
				$("#loading-text")[0].innerHTML =
					"서버와 연결을 실패 했습니다. 잠시 후 다시 시도 해주시기 바랍니다.";
			}
			if (resultSTT[0].includes("EngineConfigComplete")) {
				$("#loading-text")[0].innerHTML = "엔진 설정이 완료 되었습니다.";
			}
			if (resultSTT[0].includes("PunctuationIsReady")) {
				$("#loading-text")[0].innerHTML = "구둣점 기능 연결이 완료 되었습니다.";
			}
			if (resultSTT[0].includes("EngineIsReady")) {
				$("#loading-text")[0].innerHTML = "엔진 준비가 완료 되었습니다.";
			}
			if (resultSTT[0].includes("EngineActivate")) {
				$("#loading-text")[0].innerHTML = "엔진이 작동 되었습니다.";
				$("#loadingServer").removeClass("on");
				is_engineReadyStatus = true;
			}
			// 에러처리
			if (resultSTT[0].includes("EngineConfigError")) {
				$("#loading-text")[0].innerHTML = "엔진 작동 설정 문제가 있습니다.";
				cancelConnection();
			}
			return;
		}
		// 로컬 엔진으로부터 받는 시그널
		if (resultSTT[0].includes("EngineActivate")) {
			$("#loading-text")[0].innerHTML = "엔진이 작동 되었습니다.";
			$("#loadingServer").removeClass("on");
			return;
		}
		if (resultSTT[0].includes("UserNotAuthorized")) {
			$("#loading-text")[0].innerHTML = "서버 인증에 문제가 있습니다.";
			cancelConnection();
			return;
		}
		if (resultSTT[0].includes("DisconnectServerEngine")) {
			$("#loading-text")[0].innerHTML = "엔진과 연결이 종료 되었습니다.";
			cancelConnection();
			return;
		}
		// 0번 배열이 번역이고
		// 웹소켓 요청의 번역
		if (resultSTT[0] === "Translate") {
			// 1번 배열이 성공이면 자막 표시
			let translate_result = "";
			let translate_result_stt = "";
			// console.log("번역 결과물 :", resultSTT);
			if (resultSTT[1] === "success") {
				if (resultSTT[2] !== undefined) {
					translate_result = resultSTT[2];
					translate_result_stt = resultSTT[3];
				} else {
					return;
				}
			}
			let temp = {};
			for (let i in translate_list) {
				if (translate_result_stt === translate_list[i]["stt"]) {
					temp = translate_list.shift();
					break;
				} else {
					let trash = translate_list.shift();
					// 히스토리 창에 이전 문장 넣기
					setHistoryText(recordTime + " " + trash["stt"]);
					window.api.send("sendHistoryData", recordTime + " " + trash["stt"] + '$$');
					// DB 에 기록 저장
					window.api.database(
						"insertDatabaseListData",
						trash["id"],
						trash["stt"],
						trash["memo"],
						"",
						trash["starttime"],
						trash["endtime"]
					);
				}
			}
			if (temp.length === 0) return;

			// TRL 사용량 계산 및 기록하기
			userRecordData.useTRLTime += parseInt(
				parseFloat(temp["endtime"]) - parseFloat(temp["starttime"])
			);
			userRecordData.useTRLWord += temp["stt"].length;

			if (userData.isAdminAccount) {
				// 어드민 계정은 프리패스
			} else {
				recordCheck("TRL");
			}

			if (config.translate_type === "original_translate") {
				$('.trans-before').css({'display': ''})
				$(".trans-before")[0].innerHTML = temp["stt"]
				$(".trans-recent")[0].innerHTML = translate_result
			} else if (config.translate_type === "translate") {
				// 번역만 보여주는 상황 일 때
				// 번역 영역이 빈킨이면 그냥 바로 교체
				if (beforeTranslateText === '') {
					beforeTranslateText = translate_result
					$(".trans-recent")[0].innerHTML = translate_result;
				// 이전에 번역한 내역이 있으면 이전 번역이 남아 있도록
				} else {
					$('.trans-before').css({'display': ''})
					$(".trans-before")[0].innerHTML = beforeTranslateText
					$(".trans-recent")[0].innerHTML = translate_result
					beforeTranslateText = translate_result
				}
			}
			// 자막모드 창에 번역 결과 보내기
			// window.api.send('sendCaptionData', 'trans-recent$$' + translate_result)
			// 히스토리 창에 이전 문장 넣기
			setHistoryText(recordTime + " " + temp["stt"], "[번역] " + translate_result);
			window.api.send("sendHistoryData", recordTime + " " + temp["stt"] + "$$[번역] " + translate_result
			);
			// 결과물 DB에 저장 하기
			window.api.database(
				"insertDatabaseListData",
				temp["id"],
				temp["stt"],
				temp["memo"],
				translate_result,
				temp["starttime"],
				temp["endtime"]
			);
			// 사용 내용 마이페이지 업데이트
			if (userData.isAdminAccount) {
				// 어드민 계정은 프리패스
			} else if (userData.isPromotion) {
				updateUserTime(
					userData.promotion_limit - userRecordData.useTRLTime,
					false
				);
			} else {
				updateUserTime(
					userRecordData.ableTRLTime - userRecordData.useTRLTime,
					false
				);
			}

		// POST 방식의 번역 요청
		} else if (resultSTT[0] === "TranslatePOST") {
			let resultResponseData = JSON.parse(resultSTT[1])
			if (resultResponseData.isSelf) {
				// TRL 사용량 계산 및 기록하기
				userRecordData.useTRLTime += parseInt(
					parseFloat(resultResponseData["endtime"]) - parseFloat(resultResponseData["starttime"])
				);
				userRecordData.useTRLWord += resultResponseData["stt"].length;

				if (userData.isAdminAccount) {
					// 어드민 계정은 프리패스
				} else {
					recordCheck("TRL");
				}

				if (config.translate_type === "original_translate") {
					$('.trans-before').css({'display': ''})
					$(".trans-before")[0].innerHTML = resultResponseData["stt"]
					$(".trans-recent")[0].innerHTML = resultResponseData['trl']
				} else if (config.translate_type === "translate") {
					// 번역만 보여주는 상황 일 때
					// 번역 영역이 빈킨이면 그냥 바로 교체
					if (beforeTranslateText === '') {
						beforeTranslateText = resultResponseData['trl']
						$(".trans-recent")[0].innerHTML = resultResponseData['trl'];
					// 이전에 번역한 내역이 있으면 이전 번역이 남아 있도록
					} else {
						$('.trans-before').css({'display': ''})
						$(".trans-before")[0].innerHTML = beforeTranslateText
						$(".trans-recent")[0].innerHTML = resultResponseData['trl']
						beforeTranslateText = resultResponseData['trl']
					}
				}
				// 자막모드 창에 번역 결과 보내기
				// window.api.send('sendCaptionData', 'trans-recent$$' + translate_result)
				// 히스토리 창에 이전 문장 넣기
				setHistoryText(recordTime + " " + resultResponseData["stt"], "[번역] " + resultResponseData['trl']);
				window.api.send("sendHistoryData", recordTime + " " + resultResponseData["stt"] + "$$[번역] " + resultResponseData['trl']
				);
				// 결과물 DB에 저장 하기
				window.api.database(
					"insertDatabaseListData",
					resultResponseData["id"],
					resultResponseData["stt"],
					resultResponseData["memo"],
					resultResponseData['trl'],
					resultResponseData["starttime"],
					resultResponseData["endtime"]
				);
				// 사용 내용 마이페이지 업데이트
				if (userData.isAdminAccount) {
					// 어드민 계정은 프리패스
				} else if (userData.isPromotion) {
					updateUserTime(
						userData.promotion_limit - userRecordData.useTRLTime,
						false
					);
				} else {
					updateUserTime(
						userRecordData.ableTRLTime - userRecordData.useTRLTime,
						false
					);
				}
			} else {
				// 만약 공유 기능을 사용가능한 사람이면 번역 결과 보내기
				shareProcess(resultResponseData, true, false)
			}
		} else if (
			resultSTT[1] === "False" &&
			resultSTT[0] !== "systemNetworkStatus"
		) {
			// STTAdjust.js 에서 실시간 문장은 따로 로직 돌리고 있음
			// 공유 기능 쓰는거 한번에 보기 위해 여기에 코드 배치함
			if (resultSTT[2] !== "") {
				// Tkita Share 기능 프로세스 따로 분리 해서 글로 보내기
				shareProcess(resultSTT, false, false);
			}
		} else if (
			resultSTT[1] === "True" &&
			resultSTT[0] !== "systemNetworkStatus"
		) {
			// STT 사용량 계산 및 기록하기
			// 기록하는 대신 온라인 사용일때만 기록
			if (userData.isAdminAccount) {
				// 어드민 계정은 프리패스
			} else if (config.network) {
				userRecordData.useSTTTime += parseInt(
					parseFloat(resultSTT[4]) - parseFloat(resultSTT[3])
				);
				userRecordData.useSTTWord += resultSTT[2].length;
				recordCheck("STT");
			}
			// console.log('사용량 계산기 :', userRecordData)
			if (userData.isAdminAccount) {
				// 어드민 계정은 프리패스
			} else if (userData.isPromotion) {
				updateUserTime(
					userData.promotion_limit - userRecordData.useSTTTime,
					true
				);
			} else {
				updateUserTime(
					userRecordData.ableSTTTime - userRecordData.useSTTTime,
					true
				);
			}
			// 사용량 계산에 의해 중간 꺼져도 아래 코드가 작동하기에 조건 추가
			if (is_engineStatus) {
				// 이전 문장에 넣기
				$(".trans-prev-text")[0].innerHTML = resultSTT[2];
				// 캡션 모드에 이전 문장 넣기
				// window.api.send('sendCaptionData', 'trans-prev-text$$' + resultSTT[2])
				// DB에 최종 데이터 기록
				if (nowListID !== undefined) {
					// 번역 여부에 따라 번역 보내기
					// 번역 결제가 되어 있고, 번역 옵션이 켜져 있고, 번역 언어가 없음이 아닐때만
					// console.log('Translate$$' + resultSTT[2] + '$$' + config['translate_language'])
					if (
						translate_option &&
						config["translate_type"] !== "off" &&
						config["translate_language"] !== "none"
					) {
						// 웹소켓으로 번역 연결 할 떄
						// soc.send("Translate$$" + resultSTT[2] + "$$" + config["translate_language"]);

						// POST 로 번역 요청할 때
						let tempPOSTData = {
							id: nowListID,
							stt: resultSTT[2],
							trl: '',
							memo: memoText,
							starttime: resultSTT[3],
							endtime: resultSTT[4],
							idx: shareContextCount,
							target: config['translate_language'],
							source: config['engine_language'],
							isSelf: true
						}
						soc.send("TranslatePOST$$" + JSON.stringify(tempPOSTData));

						// // 결과 받아 올떄까지 일단 임시 배열에 넣어 두기
						// translate_list.push({
						// 	id: nowListID,
						// 	stt: resultSTT[2],
						// 	memo: memoText,
						// 	starttime: resultSTT[3],
						// 	endtime: resultSTT[4],
						// 	idx: shareContextCount
						// });
						// 메모 내용 초기화
						memoText = "";
					} else {
						// 히스토리 창에 이전 문장 넣기
						setHistoryText(recordTime + " " + resultSTT[2]);
						window.api.send("sendHistoryData", recordTime + " " + resultSTT[2] + '$$');
						// DB 에 기록 저장
						window.api.database(
							"insertDatabaseListData",
							nowListID,
							resultSTT[2],
							memoText,
							"",
							resultSTT[3],
							resultSTT[4]
						);
						// 메모 내용 초기화
						memoText = "";
					}
					if (isConnectSocket && shareData.target.length !== 0) {
						// POST 로 번역 요청할 때
						let tempPOSTData = {
							id: nowListID,
							stt: resultSTT[2],
							trl: '',
							memo: memoText,
							starttime: resultSTT[3],
							endtime: resultSTT[4],
							idx: shareContextCount,
							target: '',
							source: config['engine_language'],
							isSelf: true
						}
						for (let i in shareData.target) {
							const lanCode = shareData.target[i]
							if (lanCode !== tempPOSTData.target) {
								tempPOSTData.target = lanCode
								tempPOSTData.isSelf = false
								console.log('공유 번역 요청 :', tempPOSTData)
							}
							soc.send("TranslatePOST$$" + JSON.stringify(tempPOSTData));
						}
					}
					// Tkita Share 기능 프로세스 따로 분리 해서 글로 보내기
					shareProcess(resultSTT, false, true);


				}
			}
		}
	}
}

function recordCheck(type) {
	userRecordData.isSyncServer = false;
	// console.log('무료사용자 사용략 확인용 :', userData.promotion_limit)
	if (type === "STT") {
		if (userData.isPromotion) {
			if (userRecordData.useSTTTime >= userData.promotion_limit) {
				systemAlertOn(
					"무료 사용량을 모두 사용하였습니다. 다시 시작하여 주십시오."
				);
				$(".stopbtn").click();
			}
		} else {
			if (userRecordData.useSTTTime >= userRecordData.ableSTTTime) {
				userRecordData.isAvailable = false;
				systemAlertOn("사용시간을 모두 소진 하였습니다.");
				$(".stopbtn").click();
			}
		}
	}
	if (type === "TRL") {
		if (userRecordData.useTRLTime >= userRecordData.ableTRLTime) {
			translate_option = false;
		}
	}
}

function updateUserTime(sec, isSTT = true) {
	let result = timecal(sec);
	if (isSTT) $(".stt-expire-time")[0].innerHTML = `${result[0]} : ${result[1]}`;
	else $(".translate-expire-time")[0].innerHTML = `${result[0]} : ${result[1]}`;
}
