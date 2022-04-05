<script lang="ts">
	import Card from '../lib/Card.svelte';
	import Deck from '../lib/Deck.svelte';
	let ele: Deck;
	if (ele) ele.shuffle();
	let l: SvelteAllProps[] = [];

	const onClick: svelte.JSX.MouseEventHandler<HTMLDivElement> = (e) => {
		const { x, y } = e.currentTarget.getBoundingClientRect();
		const cards = ele.drawCards(5, x, y, { duration: 1000 });
		setTimeout(() => {
			l = l.concat(cards[2]);
		}, 2000);
	};

	const onDrop: svelte.JSX.DragEventHandler<HTMLDivElement> = (e) => {
		const c = ele.drawTopCard();
		ele.drop(c[1])(e);
	};
	$: console.log(l);
</script>

<main style="background-color: aqua;">
	<Deck bind:this={ele} />
	<button
		on:click={(e) => {
			ele.shuffle();
		}}>shuffle</button
	>
	<div
		style="width: 500px;height:1000px;background-color:rgba(200,200,200,0.5);position:relative"
		on:dragenter={(e) => e.preventDefault()}
		on:dragover={(e) => e.preventDefault()}
		on:drop={onDrop}
		on:click={onClick}
	>
		{#each l as a, index (`${a.card}-${index}`)}
			<svelte:component this={Card} {...a} />
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
