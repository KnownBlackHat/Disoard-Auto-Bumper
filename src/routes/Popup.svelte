<script>
	import browser from 'webextension-polyfill';
	let srvId;
	let duration;

	async function getStatus() {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		const response = await browser.tabs.sendMessage(tabs[0].id, { action: 'status' });
		return response;
	}

	async function start() {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		await browser.tabs.sendMessage(tabs[0].id, { action: 'start', srvId: srvId, mins: duration });
		window.location.reload();
	}

	async function stop() {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		await browser.tabs.sendMessage(tabs[0].id, { action: 'stop' });
		window.location.reload();
	}
</script>

<div class="p-4 bg-black text-white">
	<div class="text-2xl text-center font-bold mb-4">
		Disboard AutoBumper
		<div class="text-xs">By Known Black Hat</div>
	</div>

	{#await getStatus()}
		Getting status
	{:then stat}
		{#if stat.status === 'w'}
			<div class="flex flex-col">
				Auto Bump Server Id: {stat.srvId}
				<button class="rounded bg-red-600 hover:bg-red-500 p-2" on:click={stop}>stop</button>
			</div>
		{:else}
			<div class="flex flex-col">
				Enter Server Id: <input
					type="text"
					required
					bind:value={srvId}
					class="rounded p-2 text-black"
				/>
				Enter Time Left:
				<input
					type="number"
					required
					bind:value={duration}
					class="rounded p-2 text-black"
					max="120"
					min="1"
					step="1"
				/>
			</div>
			<div class="flex justify-center mt-4">
				<button class="rounded bg-green-600 hover:bg-blue-500 p-2" on:click={start}>Set</button>
			</div>
		{/if}
	{:catch err}
		<div class="text-center text-red-600">
			Only works on <a href="https://disboard.org/dashboard/servers">Disboard</a>
			{err}
		</div>
	{/await}
</div>
