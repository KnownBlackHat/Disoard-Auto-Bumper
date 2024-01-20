import browser from 'webextension-polyfill';
let timer = null;

function bump() {
	const serverId = window.localStorage.getItem('ServerId');
	window.location = `https://disboard.org/server/bump/${serverId}`;
}

browser.runtime.onMessage.addListener((message) => {
	if (message.action === 'stop') {
		window.localStorage.removeItem('status');
	} else if (message.action === 'start') {
		window.localStorage.setItem('ServerId', message.srvId);
		window.localStorage.setItem('status', 'w');
		clearTimeout(timer);
		setTimeout(bump, parseInt(message.mins) * 60 * 1000);
	} else if (message.action === 'status') {
		const status = window.localStorage.getItem('status');
		const srvId = window.localStorage.getItem('ServerId');
		return Promise.resolve({ status: status, srvId: srvId });
	}
});

if (window.localStorage.getItem('status') === 'w') {
	timer = setTimeout(bump, 2 * 60 * 60 * 1000);
}
