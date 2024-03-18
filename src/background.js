import browser from 'webextension-polyfill';
let timer = null;

function bump() {
	const serverId = window.localStorage.getItem('ServerId');
	window.location = `https://disboard.org/server/bump/${serverId}`;
}

function getAutoTime() {
	let time;
	window.document
		.querySelectorAll('a[href="/server/bump/1215549399602561065"] > span[data-origin-text="Bump"]')
		.forEach((v) => (time = v.textContent));
	time = time.split(':');
	time = time.map((v) => parseInt(v));
	return Math.ceil(time[0] * 60 + time[1] + time[2] / 60);
}

if (window.localStorage.getItem('status') === 'w') {
	timer = setTimeout(bump, getAutoTime() * 60 * 1000);
}

browser.runtime.onMessage.addListener((message) => {
	if (message.action === 'stop') {
		window.localStorage.removeItem('status');
	} else if (message.action === 'start') {
		window.localStorage.setItem('ServerId', message.srvId);
		window.localStorage.setItem('status', 'w');
		clearTimeout(timer);
		setTimeout(bump, getAutoTime() * 60 * 1000);
	} else if (message.action === 'status') {
		const status = window.localStorage.getItem('status');
		const srvId = window.localStorage.getItem('ServerId');
		return Promise.resolve({ status: status, srvId: srvId });
	}
});
