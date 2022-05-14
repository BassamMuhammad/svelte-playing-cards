<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { linear } from 'svelte/easing';
	import type { CardType, Suit, ValueWithoutJoker } from './Card.svelte';
	import Card from './Card.svelte';

	/**
	 * list of cards to render (pushes all 52 cards without jokers if nothing or empty array is supplied).
	 * without shuffling the last value in deck is rendered on top
	 */
	export let deck: CardType[] = [];
	/**shuffle the supplied deck*/
	export let shouldShuffle = true;
	/**width of single card @default 200px*/
	export let cardWidth = '200px';
	/**height of single card @default 250px*/
	export let cardHeight = '250px';
	/**list of cards which should have custom front along with custom component*/
	export let cardCustomFronts: [CardType, typeof SvelteComponent][] = [];
	/**custom component for back of cards*/
	export let cardCustomBackComp: typeof SvelteComponent = null;
	/**distance from top @default 0px*/
	export let topPosition = '0px';
	/**distance from left @default 0px*/
	export let leftPosition = '0px';
	/**offset from leftPosition (helps in giving 3d look to deck) @default 0.5*/
	export let leftPositionOffset = 0.5;
	/**offset from topPosition (helps in giving 3d look to deck) @default 0.1*/
	export let topPositionOffset = 0.1;
	/**list of cards showing front*/
	export let frontShowingCards: CardType[] = [];
	/**
	 * on:click handler (default to drawTopCard)
	 * @param event onClick event
	 */
	export let onClick: svelte.JSX.MouseEventHandler<HTMLElement> = (event) => {
		drawTopCard();
	};
	/**
	 * on:dblclick handler (default to shuffle)
	 * @param event onDblClick event
	 */
	export let onDblClick: svelte.JSX.MouseEventHandler<HTMLElement> = (event) => {
		shuffle();
	};

	let deckContainer: HTMLElement;
	/**list of rendered Cards*/
	let renderedCards: Card[] = [];
	let deckFilled = false; // true it after generating deck
	let initialRender = false;
	let doneShuffling = false;
	/**
	 * Makes the deck ready to call methods upon. Only need to call this method if you want to call any method
	 * immediately on component initilization i.e. without waiting for any event to occur.
	 *
	 * @param waitTime time to wait before ready. @default 10ms
	 * @example
	 * ```js
	 * //...
	 * let deckComp;
	 * let cardProps;
	 * //...
	 *
	 * const execMethod = async()=>{
	 * 	await deckComp.gettingReady();
	 * 	// use any method on deckComp
	 * }
	 * $: if(deckComp){
	 * 	    execMethod()
	 * 	  }
	 * ```
	 */
	export const gettingReady = async (waitTime = 10) => {
		await new Promise((res) => setTimeout(res, waitTime));
	};

	/** get the deck */
	export const getDeck = () => deck;

	/**
	 * get top card
	 * @param targetX x-coordinate of target to transition to
	 * (to avoid transition either provide null or nothing)
	 * @param targetY y-coordinate of target to transition to
	 * (to avoid transition either provide null or nothing)
	 * @param options  options to control transition
	 * @param options.duration milliseconds to complete transition
	 * @param options.easing easing function
	 * @param options.delay milliseconds after which transition starts
	 * @param removeFromDom remove card from dom (if true index 1 of return array will be useless)
	 * supplying targetX and targetY automatically removes old instance of card
	 *
	 * @returns [card face (value-of-suit), the card component, props passed to card component] or null if deck is empty
	 * @example
	 * ```js
	 * //...
	 * let deckComp
	 * let cardProps;
	 * //...
	 * ```
	 * ```svelte
	 * <Deck bind:this={deckComp}/>
	 * <div on:click={(e)=>{
	 *  const { x, y } = e.currentTarget.getBoundingClientRect();
	 *  const cards= deckComp.drawTopCard(x,y)
	 *  setTimeout(()=>cardProps = cards[2] , 2000) //set timeout according to animation options provided
	 * }}>
	 * {#if cardProps}
	 *	<svelte:component this={Card} {...cardProps} />
	 *	{/if}
	 * </div>
	 * ```
	 */
	export const drawTopCard = (
		targetX: number = null,
		targetY: number = null,
		options: {
			duration?: number;
			easing?: (x: any) => any;
			delay?: number;
		} = { duration: 2000, easing: linear, delay: 0 },
		removeFromDom = false
	): [CardType, Card, SvelteAllProps] | null => {
		if (deck.length === 0 || renderedCards.length === 0) return null;
		const card = deck.pop();
		const renderedCard = renderedCards.pop();
		let renderedCardProps: SvelteAllProps = null;
		if (targetX && targetY) {
			renderedCardProps = renderedCard.transitionToTarget(targetX, targetY, options);
		} else if (removeFromDom) renderedCard.remove();
		return [card, renderedCard, renderedCardProps];
	};

	/**
	 * get top n cards
	 *
	 * @param numOfCards number of cards to draw
	 * @param targetX x-coordinate of target to transition to
	 * (to avoid transition either provide null or nothing)
	 * @param targetY y-coordinate of target to transition to
	 * (to avoid transition either provide null or nothing)
	 * @param options  options to control transition
	 * @param options.duration milliseconds to complete transition
	 * @param options.easing easing function
	 * @param options.delay milliseconds after which transition starts
	 *
	 * @returns [list of  card face (value-of-suit), list of card components,list of props passed to card components]
	 * or null if deck is empty
	 * @example
	 * ```js
	 * //...
	 * let deckComp
	 * let cardsProps = [];
	 * //...
	 * ```
	 * ```svelte
	 * <Deck bind:this={deckComp}/>
	 * <div on:click={(e)=>{
	 *  const { x, y } = e.currentTarget.getBoundingClientRect();
	 *  const cards = deckComp.drawCards(5,x,y)
	 *  cardsProps = cardsProps.concat(cards[2])
	 * }}>
	 * {#each cardsProps as cardProps }
	 *  <svelte:component this={Card} {...cardProps} />
	 * {/each}
	 * </div>
	 * ```
	 */
	export const drawCards = (
		numOfCards: number,
		targetX: number = null,
		targetY: number = null,
		options: {
			duration?: number;
			easing?: (x: any) => any;
			delay?: number;
		} = { duration: 2000, easing: linear, delay: 0 }
	): [CardType[], Card[], SvelteAllProps[]] | null => {
		if (deck.length === 0 || renderedCards.length === 0) return null;
		const cardsDrawn: CardType[] = [];
		const renderedDrawnCards: Card[] = [];
		const renderedDrawnCardsProps: SvelteAllProps[] = [];
		if (numOfCards > deck.length) numOfCards = deck.length;
		for (let i = 0; i < numOfCards; i++) {
			const drawn = drawTopCard();
			cardsDrawn.push(drawn[0]);
			renderedDrawnCards.push(drawn[1]);
			renderedDrawnCardsProps.push(drawn[1].getSuppliedProps());
		}
		let i = 0;
		const perTransitionDuration = options.duration / numOfCards;
		const transition = () => {
			renderedDrawnCards[i].transitionToTarget(targetX, targetY, {
				...options,
				duration: perTransitionDuration
			});
			i++;
		};
		transition();
		const interval = setInterval(() => {
			transition();
		}, perTransitionDuration);
		setTimeout(() => {
			clearInterval(interval);
		}, perTransitionDuration * renderedDrawnCards.length - 1);
		return [cardsDrawn, renderedDrawnCards, renderedDrawnCardsProps];
	};

	/**
	 * make shuffling transition.
	 * time for one cycle = ((2 * offset) / increment) * ms
	 * total time for transition = cycles * repeatAfter
	 * @param axis axis of shuffling
	 * @param offset how far card goes before coming back
	 * @param increment increment per ms milliseconds
	 * @param ms  number of milliseconds to next point in transition
	 * @param repeatAfter number of milliseconds to next cycle
	 * @param cycles total cycles
	 */
	const shuffleTransition = (
		axis: 'X' | 'Y' = 'Y',
		offset = 100,
		increment = 40,
		ms = 50,
		repeatAfter = 500,
		cycles = 6
	) => {
		if (((2 * offset) / increment) * ms > repeatAfter)
			throw new Error('does not satisfy ((2 * offset) / increment) * ms <= repeatAfter');

		const renderedCardsLen = renderedCards.length;
		if (renderedCardsLen > 0) {
			const midpoint = Math.floor((0 + renderedCardsLen) / 2);
			const indexes: number[] = [];
			for (let i = 1; i <= 5; i++) {
				if (midpoint - i < 0 || midpoint + i >= renderedCardsLen) break;
				indexes.push(midpoint - i);
				indexes.push(midpoint + i);
			}
			const interval = setInterval(() => {
				indexes.forEach((index) => {
					renderedCards[index].shufflingTransition(axis, offset, increment, ms);
				});
			}, repeatAfter);
			setTimeout(() => {
				clearInterval(interval);
			}, repeatAfter * (cycles - 1));
		}
	};

	/**
	 * shuffle the deck.
	 *
	 * if transition is allowed then time for one cycle = ((2 * offset) / increment) * ms
	 *
	 * total time for transition = cycles * repeatAfter
	 * @param allowTransition allow shuffling transition
	 * @param axis axis of shuffling
	 * @param offset how far card goes before coming back
	 * @param increment increment per ms milliseconds
	 * @param ms  number of milliseconds to next point in transition
	 * @param repeatAfter number of milliseconds to next cycle
	 * @param cycles total cycles
	 */
	export const shuffle = (
		allowTransition = true,
		axis: 'X' | 'Y' = 'Y',
		offset = 100,
		increment = 40,
		ms = 50,
		repeatAfter = 500,
		cycles = 6
	) => {
		const shufflingLogic = () => {
			for (let i = deck.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * i);
				let tempCard = deck[i];
				deck[i] = deck[j];
				deck[j] = tempCard;
			}
		};
		if (allowTransition) {
			shuffleTransition(axis, offset, increment, ms, repeatAfter, cycles);
			setTimeout(() => {
				shufflingLogic();
				doneShuffling = true;
			}, repeatAfter * (cycles + 1));
		} else {
			shufflingLogic();
			doneShuffling = true;
		}
	};

	/**
	 * show front of a card
	 * @param indexOfCard index of card in deck
	 */
	export const showCardFront = (indexOfCard: number) => {
		const frontShowingCard = deck[indexOfCard];
		if (frontShowingCards.includes(frontShowingCard)) return;
		frontShowingCards.push(frontShowingCard);
		renderedCards[indexOfCard].showFront();
	};
	/**
	 * show back of a card
	 * @param indexOfCard index of card in deck
	 */
	export const hideCardFront = (indexOfCard: number) => {
		const index = getFrontShowingCardIndex(deck[indexOfCard]);
		if (index < 0) return; //if card not found that means it is already hidden
		frontShowingCards.splice(index, 1);
		renderedCards[indexOfCard].showBack();
	};
	/**
	 * flip a card
	 * @param indexOfCard index of card in deck
	 */
	export const flipCard = (indexOfCard: number) => {
		const cardToFlip = deck[indexOfCard];
		const index = getFrontShowingCardIndex(cardToFlip);
		if (index < 0) {
			frontShowingCards.push(cardToFlip);
			renderedCards[indexOfCard].flip();
		} else {
			frontShowingCards.splice(index, 1);
			renderedCards[indexOfCard].flip();
		}
	};
	/**show front of top card*/
	export const showTopCardFront = () => showCardFront(deck.length - 1);
	/**show back of top card*/
	export const hideTopCardFront = () => hideCardFront(deck.length - 1);
	/**flip top card*/
	export const flipTopCard = () => flipCard(deck.length - 1);

	/**
	 * generate full deck
	 * @param param0 options to include black joker,red joker and shuffle the deck
	 */
	export const generateFullDeck = ({
		withBlackJoker = false,
		withRedJoker = false,
		shouldShuffle = true
	} = {}) => {
		if (deckFilled) return;
		const tempCards: CardType[] = [];
		const values: ValueWithoutJoker[] = [
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'JACK',
			'QUEEN',
			'KING',
			'ACE'
		];
		const suits: Suit[] = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
		for (let value of values) {
			for (let suit of suits) {
				tempCards.push(`${value}-of-${suit}`);
			}
		}
		if (withBlackJoker) tempCards.push('BLACK-JOKER');
		if (withRedJoker) tempCards.push('RED-JOKER');
		deck = tempCards;
		deckFilled = true;
		if (shouldShuffle) shuffle();
	};
	/**
	 * function to call on on:drop event of element where card could be drag and drop to
	 * @param cardToDrop the card component to drop
	 * @param options  options to change card after drop
	 *
	 * @returns a function which accepts drag event
	 *
	 * @example
	 * ```svelte
	 * <div on:drop={deckComp.drop(card)}  on:dragenter={(e) => e.preventDefault()}
	 * on:dragover={(e) => e.preventDefault()}></div>
	 * ```
	 * where deckComp is instance of Deck. Notice you have to call the function as
	 * it returns another function which accepts the event
	 *
	 */
	export const drop =
		(
			cardToDrop: Card,
			options = {
				enableDrag: false,
				position: 'static',
				height: cardHeight,
				width: cardWidth,
				topPos: '0px',
				leftPos: '0px'
			}
		): svelte.JSX.MouseEventHandler<HTMLElement> =>
		(event) => {
			event.preventDefault();
			cardToDrop.drop(options)(event);
		};

	/**
	 * render card using Component Api (not using each block because it is behaving strangely on shuffling)
	 * @param card the card face-value (value-of-suit)
	 */
	const renderCard = (card: CardType) => {
		return new Card({
			target: deckContainer,
			props: {
				customBack: cardCustomBackComp,
				customFront: getCardCustomFrontComp(card),
				showBackSide: getFrontShowingCardIndex(card) < 0,
				card,
				width: cardWidth,
				height: cardHeight,
				onClick: (e) => {},
				onDblClick: (e) => {},
				topPosition: (topPosition = `${
					parseFloat(topPosition.slice(0, topPosition.length - 2)) + topPositionOffset
				}px`),
				leftPosition: (leftPosition = `${
					parseFloat(leftPosition.slice(0, leftPosition.length - 2)) + leftPositionOffset
				}px`)
			}
		});
	};
	/**
	 * get index of card in frontShowingCards list
	 * @param card card face value (value-of-suit)
	 */
	const getFrontShowingCardIndex = (card: CardType) => {
		return frontShowingCards.findIndex((frontShowingCard) => frontShowingCard === card);
	};

	/**
	 * get custom front component of card
	 * @param card card face value (value-of-suit)
	 */
	const getCardCustomFrontComp = (card: CardType) => {
		const cardCustomFront = cardCustomFronts.find((cardCustomFront) => cardCustomFront[0] === card);
		return cardCustomFront ? cardCustomFront[1] : null;
	};

	if (deck.length === 0) generateFullDeck();
	else {
		if (shouldShuffle) shuffle();
		else doneShuffling = true;
		deckFilled = true;
	}
	$: if (deckContainer && !initialRender && doneShuffling) {
		deck.forEach((card) => {
			renderedCards.push(renderCard(card));
		});
		initialRender = true;
	}
</script>

<!-- @component
A component to generate deck of cards
Import component by
    ```svelte
    import Deck from "svelte-playing-cards"
    ```
    and use it in your code 
    ```svelte
    <Deck />
    ```
    by default it renders all 52 cards (without jokers)
    To specify cards pass it in as a list to deck prop

    ```svelte
    <Deck deck={["10-of-CLUBS","QUEEN-of-HEARTS","BLACK-JOKER"]} />
    ```
-->
<div
	bind:this={deckContainer}
	on:click={onClick}
	on:dblclick={onDblClick}
	style={`position:relative;width:${
		parseFloat(cardWidth.slice(0, cardWidth.length - 2)) + leftPositionOffset * deck.length
	}px;height:${
		parseFloat(cardHeight.slice(0, cardHeight.length - 2)) + topPositionOffset * deck.length
	}px`}
/>
