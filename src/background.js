import browser from 'webextension-polyfill';
let timer = null;

function bump() {
	const serverId = window.localStorage.getItem('ServerId');
	window.location = `https://disboard.org/server/bump/${serverId}`;
}

function getAutoTime(srvId) {
	let time;
	window.document
		.querySelectorAll(`a[href="/server/bump/${srvId}"] > span[data-origin-text="Bump"]`)
		.forEach((v) => (time = v.textContent));
	time = time.split(':');
	time = time.map((v) => parseInt(v));
	let finalTime = Math.ceil(time[0] * 60 + time[1] + time[2] / 60);
    window.localStorage.setItem('time', finalTime)
    return finalTime
}

function main() {
    const serverId = window.localStorage.getItem('ServerId');
    timer = setTimeout(bump, getAutoTime(serverId) * 60 * 1000);
}

if (window.localStorage.getItem('status') === 'w') {
    setTimeout(main, 2000)
}

browser.runtime.onMessage.addListener((message) => {
	if (message.action === 'stop') {
		window.localStorage.removeItem('status');
	} else if (message.action === 'start') {
		window.localStorage.setItem('ServerId', message.srvId);
		window.localStorage.setItem('status', 'w');
		clearTimeout(timer);
		setTimeout(bump, getAutoTime(message.srvId) * 60 * 1000);
	} else if (message.action === 'status') {
		const status = window.localStorage.getItem('status');
		const srvId = window.localStorage.getItem('ServerId');
		return Promise.resolve({ status: status, srvId: srvId });
	}
});
