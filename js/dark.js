const darkmodeBtn = document.querySelector('.darkmode-btn')

darkmodeBtn.addEventListener('click', () => {
  if (document.body.dataset.theme === 'light-mode') {
    document.body.dataset.theme = 'dark-mode'
    window.api.send("sendMemoData", "dark");
	window.api.send("sendHistoryData", "dark");
	window.api.shareSend("sendShareTranslateData", ["dark"]);
	window.api.shareSend("sendShareReservation", ["dark"]);
  } else {
    document.body.dataset.theme = 'light-mode'
    window.api.send("sendMemoData", "light");
	window.api.send("sendHistoryData", "light");
	window.api.shareSend("sendShareTranslateData", ["light"]);
	window.api.shareSend("sendShareReservation", ["light"]);
  }
})