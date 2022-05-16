<script lang="ts">
	import Card from '../lib/Card.svelte';
	import Deck from '../lib/Deck.svelte';
	import Custom from './Custom.svelte';

	let ele: Deck;
	if (ele) ele.shuffle();
	let cardsProps: SvelteAllProps[] = [];

	const onClick: svelte.JSX.MouseEventHandler<HTMLDivElement> = async (e) => {
		const { x, y } = e.currentTarget.getBoundingClientRect();
		const cards = await ele.drawCards(5, x, y, { duration: 1000 });

		cardsProps = cardsProps.concat(cards[2]);
	};

	const onDrop: svelte.JSX.DragEventHandler<HTMLDivElement> = async (e) => {
		const cards = await ele.drawTopCard();
		ele.drop(cards[1])(e);
	};
</script>

<main style="background-color: aqua;">
	<Deck bind:this={ele} onClick={async () => await ele.flipTopCard()} />
	<Deck
		deck={['10-of-CLUBS', '10-of-DIAMONDS']}
		frontShowingCards={['10-of-CLUBS']}
		cardCustomBackComp={Custom}
		cardCustomBackCompProps={{ text: 'custom back' }}
		cardCustomFronts={[['10-of-CLUBS', Custom, { text: 'custom front' }]]}
	/>
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
		{#each cardsProps as a, index (`${a.card}-${index}`)}
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
