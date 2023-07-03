let isFirstLoad = true

// 자막 모드 창 전용 불투명도 리스트 값
let dark_trans_class_dict = {
	"text-section": {
		"background-color": "rgba(249, 249, 253, 0)",
	},
	"text-sec-sec": {
		"background-color": "rgba(38, 41, 46, transColorThisHere)",
		"border-left": "rgba(38, 41, 46, transColorThisHere)",
		"border-right": "rgba(38, 41, 46, transColorThisHere)",
	},
	// setTransparent: {
	// 	"background-color": "rgba(35, 38, 43, transColorThisHere)",
	// },
};
let light_trans_class_dict = {
	"text-section": {
		"background-color": "rgba(249, 249, 253, 0)",
	},
	"text-sec-sec": {
		"background-color": "rgba(255, 255, 255, transColorThisHere)",
		"border-left": "rgba(255, 255, 255, transColorThisHere)",
		"border-right": "rgba(255, 255, 255, transColorThisHere)",
	},
	// setTransparent: {
	// 	"background-color": "rgba(255, 255, 255, transColorThisHere)",
	// },
};
let transValue;
let currentFontValue = 16;

$(document).ready(function () {
	// getDivElement()
	window.api.send("getConfigData", "getRangeData");
	window.api.receive("resultRangeData", (font, trans) => {
		if (16 > font || 80 < font) {
			font = 16;
			saveConfig("set_font", font);
		}
		if (1 > trans || 100 < trans) {
			trans = 100;
			saveConfig("set_transparent", trans);
		}
		// 폰트 크기
		$("#range-1").range({
			min: 16,
			max: 80,
			start: font,
			onChange: function (value) {
				currentFontValue = value;
				// 값이 변동됨에 따라 그에 해당하게 싸이즈 변경
				// 자막 모드 일때, 텍스트 출력 영역이 한개일때만
				if ($(".setbtn")[0].className === "setbtn") {
					// if (is_engineReadyStatus) {
					// 	$(".voice-text").css(
					// 		"height",
					// 		`calc(100% + ${currentFontValue / 2}px)`
					// 	);
					// } else {
					// 	$(".voice-text").css(
					// 		"height",
					// 		`calc(100% + ${currentFontValue / 2}px)`
					// 	);
					// }

					// window.api.windowaction(
					// 	"ChangeWindowSize",
					// 	minWindowWidth + addWindowWidth,
					// 	minWindowHeight + addWindowHeight
					// );
					
					// console.log(
					// 	minWindowWidth + addWindowWidth,
					// 	"$$$",
					// 	minWindowHeight + addWindowHeight
					// );
				}
				// changeWindowWithFontSize(value);
				$("#display-1").html(value);
				$(".text-sec-sec").css("font-size", `${value}px`);
				saveConfig("set_font", value);
				window.api.send("sendHistoryData", `setTextSize$$${value}`);
			},
		});
		// 불투명도
		$("#range-2").range({
			min: 1,
			max: 100,
			start: trans,
			onChange: function (value) {
				$("#display-2").html(value);
				// convertStyleRgbaAndApply(value)
				transValue = String(value * 0.01).substring(0, 4);
				// html 이 첫 로딩 할때는 100으로 설정되게
				if (isFirstLoad) {
					changeTransportValue(100)
					isFirstLoad = false
				} else {
					changeTransportValue(transValue)
				}
				saveConfig("set_transparent", value);
			},
		});
	});
});

function changeTransportValue(value) {
	if ($("body")[0].getAttribute("data-theme").includes("dark-mode")) {
		for (let _list in dark_trans_class_dict) {
			for (let _item in dark_trans_class_dict[_list]) {
				$("." + _list).css(
					_item,
					dark_trans_class_dict[_list][_item].replace(
						"transColorThisHere",
						value
					)
				);
			}
		}
	} else if (
		$("body")[0].getAttribute("data-theme").includes("light-mode")
	) {
		for (let _list in light_trans_class_dict) {
			for (let _item in light_trans_class_dict[_list]) {
				$("." + _list).css(
					_item,
					light_trans_class_dict[_list][_item].replace(
						"transColorThisHere",
						value
					)
				);
			}
		}
	}
}

// Config 값 저장
function saveConfig(key, val) {
	if (typeof val === "boolean") window.api.send("setConfigData", key, val);
	else window.api.send("setConfigData", key, String(val));
}

// 다크 모드 전환 눌렀을 떄도 한번 적용
$(".darkmode-btn").on("click", function (e) {
	if ($("body")[0].getAttribute("data-theme").includes("dark-mode")) {
		document.querySelector(".real-time-single").style.color = "#ffffff";
		for (let _list in dark_trans_class_dict) {
			for (let _item in dark_trans_class_dict[_list]) {
				if (isCaptionMode) {
					$("." + _list).css(_item, dark_trans_class_dict[_list][_item].replace("transColorThisHere", transValue));
				} else {
					$("." + _list).css(_item, dark_trans_class_dict[_list][_item].replace("transColorThisHere", 100));
				}
			}
		}
	} else if ($("body")[0].getAttribute("data-theme").includes("light-mode")) {
		document.querySelector(".real-time-single").style.color = "#26292e";
		for (let _list in light_trans_class_dict) {
			for (let _item in light_trans_class_dict[_list]) {
				if (isCaptionMode) {
					$("." + _list).css(_item, light_trans_class_dict[_list][_item].replace("transColorThisHere", transValue));
				} else {
					$("." + _list).css(_item, light_trans_class_dict[_list][_item].replace("transColorThisHere", 100));
				}
			}
		}
	}
});

// 이전에 불투명도 하다가 실패한 코드 인데
// 사실 이렇게 할 필요가 없었음

// function applyCSS (elem, prop, target, val, type=false) {
//     // 기존에 저장된 값을 이용해서 매번 백그라운드 컬러 정보를 찾지 않으려 했는데 모드 변경에 따라 값이 유동적으로 바뀌어 실시간으로 값을 찾아야함
//     if (type) {
//         elem.style = `${prop}: ` +
//             target.replace(
//                 /rgb\(/gi, "rgba("
//             ).replace(
//                 ")", `, ${String(val*0.01).substring(0,4)}); `
//             ) + getWidth(elem)
//     } else {
//         if (prop === "background") {
//             elem.style = `${prop}: ` +
//                 target.replace(
//                     /rgb\(/gi, "rgba("
//                 ).replace(
//                     "), ", `, ${String(val*0.01).substring(0,4)}), `
//                 ).replace(
//                     ")) ", `, ${String(val*0.01).substring(0,4)})) `
//                 )
//         } else {
//             elem.style = `${prop}: ` +
//                 target.replace(
//                     /rgb\(/gi, "rgba("
//                 ).replace(
//                     ")", ", "
//                 ) +
//                 String(val*0.01).substring(0,4) + ")"
//         }
//     }
// }
//
// function pushCSS (elem, prop) {
//     trans_class_value_list.push(getBackgroundColor(elem))
// }
//
// function getElement (tag, name) {
//     let element;
//     if (tag.includes('body')) element = $(`${name}`);
//     else element = $(`.${name}`);
//     return element
// }
//
// function getBackgroundColor (elem) {
//     return document.defaultView.getComputedStyle(elem).backgroundColor
// }
//
// function getWidth (elem) {
//     let data = elem.style.width
//     if (data === "") return ""
//     else return 'width: ' + data + ";"
// }
//
// // rgb 로 된거 rgba로 변환
// function convertStyleRgbaAndApply (val) {
//     for (let i = 0; i < trans_class_list.length; i++) {
//         let element_name = trans_class_list[i].split("/")
//         let element = getElement(element_name[0], element_name[1])
//
//         // 클래스 직접 지정 했을 때
//         if (element_name[1] === 'setTransparent') {
//             for (let j = 0; j < element.length; j++) {
//                 applyCSS(element[j], 'background-color', trans_class_value_list[j], val, true)
//             }
//         } else if (element_name[1] === 'setTransparent-bottom') {
//             applyCSS(element[0], 'background', trans_class_value_list[i], val)
//         }
//
//         // 기존 클래스 명 활용 했을 떄
//         // if (element_name[0].includes('p')) {
//         //     applyCSS(element.children(), 'color', trans_class_value_list[i], val)
//         // } else if (element_name[0].includes('div') && element_name[1].includes('border-14')) {
//         //     for (let j = 0; j < element.length; j++) {
//         //         applyCSS(element[j], 'border-bottom', trans_class_value_list[i], val)
//         //     }
//         // } else if (element_name[0].includes('div') && element_name[1].includes('select')) {
//         //     for (let j = 0; j < element.length; j++) {
//         //         applyCSS(element[j], 'background-color', trans_class_value_list[i], val)
//         //     }
//         // } else if (element_name[0].includes('div') && element_name[1].includes('text-sec-bottom')) {
//         //     applyCSS(element[0], 'background', trans_class_value_list[i], val)
//         // } else {
//         //     applyCSS(element[0], 'background-color', trans_class_value_list[i], val)
//         // }
//     }
// }
//
// // 지정된 요소 rgb 정보 저장
// function getDivElement () {
//     for (let i = 0; i < trans_class_list.length; i ++) {
//         let element_name = trans_class_list[i].split("/")
//         let element = getElement(element_name[0], element_name[1])
//
//         // 클래스 직접 지정 했을 때
//         if (element_name[1] === 'setTransparent') {
//             for (let j = 0; j < element.length; j++) {
//                 pushCSS(element[j], 'background-color')
//             }
//         } else if (element_name[1] === 'setTransparent-bottom') {
//             pushCSS(element, 'background')
//         }
//
//         // 기존 클래스 명 활용 했을 떄
//         // if (element_name[0].includes('p')) {
//         //     pushCSS(element.children(), 'color')
//         // } else if (element_name[0].includes('div') && element_name[1].includes('border-14')) {
//         //     pushCSS(element, 'border-bottom')
//         // }
//         // else if (element_name[0].includes('div') && element_name[1].includes('text-sec-bottom')) {
//         //     pushCSS(element, 'background')
//         // }
//         // else {
//         //     pushCSS(element, 'background-color')
//         // }
//     }
// }
