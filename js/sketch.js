let p5Mic, fft;

function setup() {
	let cnv = createCanvas(80, 37);
	cnv.parent("micCanvas");
	background("rgba(0,0,0,0)");
	p5Mic = new p5.AudioIn();
	p5Mic.getSources(gotSources);
	fft = new p5.FFT();
	frameRate(30);
}

function gotSources(deviceList) {
	//default값 맨앞거 지우고 기존 config데이터와 매칭되는 마이크로 셋팅
	// console.log("deviceList 1 :", deviceList)
	deviceList.shift();
	// console.log("deviceList 2 :", deviceList)
	if (deviceList.length > 0) {
		const defaultIdx = (el) => {
			return el.label === config.input_device;
		};
		// console.log("deviceList 3 :", deviceList.findIndex(defaultIdx))
		p5Mic.setSource(deviceList.findIndex(defaultIdx));
		//마이크 시작하고 주파수 감지 시작
		p5Mic.start();
		fft.setInput(p5Mic);
	}
}

function draw() {
	clear();
	let spectrum = fft.analyze();
	let average = fft.linAverages();
	average = average.map(average => average * 2.5);
	noStroke();
	if (document.body.dataset.theme === 'light-mode') {
		fill("rgba(51, 95, 255, 0.8)");
	} else {
		fill("rgba(255, 255, 153, 0.8)");
	}
	for (let i = 0; i < average.length; i++) {
		let h = - height + map(average[i], 0, 40, height, 0);
		rect(i * 5, 20, 2, average[i] / 25, 5, 5, 5, 5);
		rect(i * 5, 20, 2, h / 25, 5, 5, 5, 5);
	}
}
