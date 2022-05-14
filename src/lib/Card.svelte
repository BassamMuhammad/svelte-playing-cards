<script context="module" lang="ts">
	/**typescript type - all the 4 suits */
	export type Suit = 'SPADES' | 'DIAMONDS' | 'HEARTS' | 'CLUBS';
	/**typescript type - all the values a card can take except JOKER*/
	export type ValueWithoutJoker =
		| '2'
		| '3'
		| '4'
		| '5'
		| '6'
		| '7'
		| '8'
		| '9'
		| '10'
		| 'JACK'
		| 'QUEEN'
		| 'KING'
		| 'ACE';
	/**typescript type - all the values a card can take including JOKER*/
	export type Value = ValueWithoutJoker | 'JOKER';
	/**typescript type - all 54 value-of-suit a card can take*/
	export type CardType = `${ValueWithoutJoker}-of-${Suit}` | 'BLACK-JOKER' | 'RED-JOKER';
</script>

<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	/**Swidth of card @default 200px*/
	export let width = '200px';
	/**height of card @default 250px*/
	export let height = '250px';
	/**css top (in case of position = absolute) @default 0px*/
	export let topPosition = '0px';
	/**css left (in case of position = absolute) @default 0px*/
	export let leftPosition = '0px';
	/**@default absolute*/
	export let position = 'absolute';
	/**@default true*/
	export let showBackSide = true;
	/**the value and suit of card (format like value-of-suit)*/
	export let card: CardType;
	/**Provide if need to customize backside of card*/
	export let customBack: typeof SvelteComponent = null;
	/** Provide if need to customize frontside of card*/
	export let customFront: typeof SvelteComponent = null;
	/**@default true*/
	export let enableDrag = true;
	/**rotate 90deg to swap width and height. @default false*/
	export let shouldRotate = false;
	/**Handle the on:click event (defaults to flipping the card)*/
	export let onClick: svelte.JSX.MouseEventHandler<HTMLDivElement> = () => {
		flip();
	};
	/**Handle the on:dblclick event (defaults to removing the card)*/
	export let onDblClick: svelte.JSX.MouseEventHandler<HTMLDivElement> = () => {
		remove();
	};

	let visible = true;
	let rootElem: HTMLElement;
	let srcFront: string = null;
	let altFront: string = null;
	let flyX = 0;
	let flyY = 0;
	let flyDuration = 2000;
	let flyEasing = linear;
	let flyDelay = 0;

	/**get the card value hold by this card
	 * @returns card the cardType passed
	 */
	export const getCard = () => card;

	/**
	 * flip the face of card.
	 * (time taken by transition is (180 / increment) * ms)
	 * @param allowTransition allow flip transition
	 * @param axis flip transition axis (X or Y)
	 * @param increment value to increase transition by (should satisfy condition (90 % increment === 0))
	 * @param ms milliseconds to next point in transition
	 */
	export const flip = async (
		allowTransition = true,
		axis: 'X' | 'Y' = 'Y',
		increment = 5,
		ms = 30
	) => {
		if (allowTransition) await flipTransition(!showBackSide, axis, increment, ms);
		else showBackSide = !showBackSide;
	};
	/**
	 * remove the card
	 */
	export const remove = () => (rootElem ? rootElem.remove() : null);
	/**
	 * transition the card to target
	 * @param targetX x-coordinate of target
	 * @param targetY y-coordinate of target
	 * @param options  options to control transition
	 * @param options.duration milliseconds to complete transition
	 * @param options.easing easing function
	 * @param options.delay milliseconds after which transition starts
	 * @returns props passed to the card
	 */
	export const transitionToTarget = async (
		targetX: number,
		targetY: number,
		options: {
			duration?: number;
			easing?: (x: any) => any;
			delay?: number;
		} = { duration: 2000, easing: linear, delay: 0 }
	) => {
		const { delay, duration, easing } = options;
		const { x, y } = rootElem.getBoundingClientRect();
		flyX = targetX - x;
		flyY = targetY - y;
		flyDelay = delay;
		flyDuration = duration;
		flyEasing = easing;
		visible = false;
		await new Promise((resolve) => setTimeout(resolve, duration));
		return $$props;
	};
	/**
	 * show the front of card.
	 * (time taken by transition is (180 / increment) * ms)
	 * @param allowTransition allow flip transition
	 * @param axis flip transition axis (X or Y)
	 * @param increment value to increase transition by (should satisfy condition (90 % increment === 0))
	 * @param ms milliseconds to next point in transition
	 */
	export const showFront = async (
		allowTransition = true,
		axis: 'X' | 'Y' = 'Y',
		increment = 5,
		ms = 30
	) => {
		if (allowTransition) await flipTransition(false, axis, increment, ms);
		else showBackSide = true;
	};
	/**
	 * show the back of card.
	 * (time taken by transition is (180 / increment) * ms)
	 * @param allowTransition allow flip transition
	 * @param axis flip transition axis (X or Y)
	 * @param increment value to increase transition by (should satisfy condition (90 % increment === 0))
	 * @param ms milliseconds to next point in transition
	 */
	export const showBack = async (
		allowTransition = true,
		axis: 'X' | 'Y' = 'Y',
		increment = 5,
		ms = 30
	) => {
		if (allowTransition) await flipTransition(true, axis, increment, ms);
		else showBackSide = false;
	};
	/**
	 * function to call on on:drop event of element where card could be drag and drop to
	 * @param options  options to change card after drop
	 * @param options.enableDrag allow dragging
	 * @param options.position css position of card
	 * @param options.height height of card
	 * @param options.width width of card
	 * @param options.topPos css top of card
	 * @param options.leftPos css left of card
	 *
	 * @returns a function which accepts drag event
	 *
	 * @example
	 * ```svelte
	 * <div on:drop={card.drop()}  on:dragenter={(e) => e.preventDefault()}
	 * on:dragover={(e) => e.preventDefault()}></div>
	 * ```
	 * where card is instance of Card. Notice you have to call the function as
	 * it returns another function which accepts the event
	 *
	 */
	export const drop =
		(
			options = {
				enableDrag: false,
				position: 'static',
				height,
				width,
				topPos: '0px',
				leftPos: '0px'
			}
		): svelte.JSX.MouseEventHandler<HTMLElement> =>
		(event) => {
			const {
				enableDrag: paraEnableDrag,
				position: paraPosition,
				height: paraHeight,
				width: paraWidth,
				topPos,
				leftPos
			} = options;
			event.preventDefault();
			if (paraEnableDrag !== undefined) enableDrag = paraEnableDrag;
			if (paraPosition) position = paraPosition;
			if (paraHeight) height = paraHeight;
			if (paraWidth) width = paraWidth;
			if (topPos) topPosition = topPos;
			if (leftPos) leftPosition = leftPos;
			rootElem.remove();
			event.currentTarget.appendChild(rootElem);
		};
	/**
	 * get css top and left of card (position refers to css top and left)
	 * @returns [cssTop, cssLeft]
	 */
	export const getPosition = (): [string, string] => [topPosition, leftPosition];
	/**
	 * set css top and left of card
	 * @param pos
	 * @param pos.top css top of card
	 * @param pos.left css left of card
	 */
	export const setPosition = (pos: { top: string; left: string }) => {
		topPosition = pos.top;
		leftPosition = pos.left;
	};

	/**
	 * get the props given to the component
	 * @returns props
	 */
	export const getSuppliedProps = () => $$props;

	/**
	 * make shuffling transition. (does not make sense to use it alone. Better to use in a deck)
	 * total time for transition = ((2 * offset) / increment) * ms
	 * @param axis axis of shuffling
	 * @param offset how far card goes before coming back
	 * @param increment increment per ms milliseconds
	 * @param ms  number of milliseconds to next point in transition
	 */
	export const shufflingTransition = async (
		axis: 'X' | 'Y' = 'Y',
		offset = 100,
		increment = 40,
		ms = 50
	) => {
		let translate = 0;
		const initialIncrement = increment;
		const rootEle = rootElem; // make rootElement available in setInterval and setTimeout
		const interval = setInterval(() => {
			if (translate >= 100) {
				increment *= -1;
				rootEle.style.zIndex = '1';
			}
			rootEle.style.transform = `translate${axis}(${(translate += increment)}px)`;
		}, ms);
		await new Promise((resolve) =>
			setTimeout(() => {
				clearInterval(interval);
				rootEle.style.transform = `translate${axis}(0px)`;
				rootEle.style.zIndex = '0';
				resolve(true);
			}, ((2 * offset) / initialIncrement) * ms)
		);
	};

	/**
	 * flip transition.
	 * (time taken by transition is (180 / increment) * ms)
	 * @param axis flip transition axis (X or Y)
	 * @param increment value to increase transition by (should satisfy condition (90 % increment === 0))
	 * @param ms milliseconds to next point in transition
	 */
	const flipTransition = async (
		newShowBackSide: boolean,
		axis: 'X' | 'Y' = 'Y',
		increment = 5,
		ms = 30
	) => {
		if (90 % increment !== 0)
			throw new Error(
				'Increment should be a divisor of 90 i.e should satisfy condition (90 % increment === 0)'
			);

		let rotate = 0;
		const initialIncrement = increment;
		const rootEle = rootElem; // make rootElement available in setInterval and setTimeout
		const interval = setInterval(() => {
			if (rotate === 90) {
				showBackSide = newShowBackSide;
				increment *= -1;
			}
			rootEle.style.transform = `rotate${axis}(${(rotate += increment)}deg)`;
		}, ms);
		await new Promise((resolve) =>
			setTimeout(() => {
				clearInterval(interval);
				rootEle.style.transform = `rotate${axis}(0deg)`;
				resolve(true);
			}, (180 / initialIncrement) * ms)
		);
	};

	/**
	 * get srcFront and altFront
	 */
	const getFrontDesign = () => {
		let src = ``;
		if (card.includes('CLUBS')) {
			src += `clubs/`;
		} else if (card.includes('HEARTS')) {
			src += `hearts/`;
		} else if (card.includes('DIAMONDS')) {
			src += `diamonds/`;
		} else if (card.includes('SPADES')) {
			src += `spades/`;
		} else if (card.includes('JOKER')) {
			src += `jokers/`;
		}
		if (card.includes('http')) {
			const strParts = card.split('/');
			src += strParts[strParts.length - 1];
			srcFront = src;
			altFront = strParts[strParts.length - 1].replace('.svg', '');
		} else {
			src += card;
			srcFront = src;
			altFront = card;
		}
	};
	if (!customFront) getFrontDesign();
</script>

<!-- @component
Component to render a card
    Import component by
    ```svelte
    import Card from "svelte-playing-cards"
    ```
    and use it in your code 
    ```svelte
    <Card card="10-of-CLUBS" />
    ```    
-->
{#if visible}
	<div
		data-testid="card"
		bind:this={rootElem}
		on:click={onClick}
		on:dblclick={onDblClick}
		transition:fly={{
			x: flyX,
			y: flyY,
			duration: flyDuration,
			opacity: 1,
			delay: flyDelay,
			easing: flyEasing
		}}
		draggable={!enableDrag ? 'false' : 'true'}
		on:dragstart={(event) => (!enableDrag ? event.preventDefault() : null)}
		style={`cursor:pointer;width: ${width};height:${height};position:${position};top:${topPosition};left:${leftPosition};transform:rotate(${
			shouldRotate ? '9' : ''
		}0deg)`}
	>
		{#if showBackSide}
			{#if customBack}
				<svelte:component this={customBack} />
			{:else}
				{#await import('./cards/card-back.svg') then backImg}
					<img src={backImg.default} alt="backside of card" />
				{/await}
			{/if}
		{:else if customFront}
			<svelte:component this={customFront} />
		{:else}
			{#await import(`./cards/${srcFront}.svg`) then frontImg}
				<img src={frontImg.default} alt={altFront} />
			{/await}
		{/if}
	</div>
{/if}
