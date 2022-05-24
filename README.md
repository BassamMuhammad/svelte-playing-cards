# Svelte Playing Cards
A highly customizable package for making card games in svelte. Provides two components Card and Deck. By default renders svg cards by [nicubunu](https://openclipart.org/artist/nicubunu). 
Check out an [example app](https://github.com/BassamMuhammad/rung) made with this package.

To import types for typescript project:
```svelte
<script>
    import type {Suit,Value,ValueWithoutJoker,CardType} from 'svelte-playing-cards/Card.svelte';
</script>
```
## Usage  
1. **Deck**  
   Component to generate deck of cards 
    
    Import component by
    ```svelte
    import Deck from "svelte-playing-cards/Deck.svelte"
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
    Other props are:

    |Props|Default values|Description|
    |:---:|:------------:|:---------:|
    |deck| all 52 cards(without jokers)|list of cards to render|
    |shouldShuffle| true|should shuffle the supplied deck|
    |cardWidth| "200px"|width of single card|
    |cardHeight|"250px"|height of single card|
    |cardCustomFronts|[ ]|list of cards which should have custom front along with custom component and its props|
    |cardCustomBackComp|null|custom component for back of cards|
    |cardCustomBackCompProps|{}|props for custom back component|
    |topPosition|"0px"|distance from top|
    |leftPosition|"0px"|distance from left|
    |topPositionOffset|0.1|offset from topPosition (helps in giving 3d look to deck)|
    |leftPositionOffset|0.5|offset from leftPosition (helps in giving 3d look to deck)|
    |frontShowingCards|[ ]|list of cards showing front|
    |onClick|remove the top card from deck| on:click handler|
    |onDblClick|shuffle the deck| on:dblclick handler|

    To use methods:
    ```svelte
    <script>
        import Deck from "svelte-playing-cards/Deck.svelte"
        let deckComp: Deck;

        $: if(deckComp){
            // now you can use the methods available on Deck like deckComp.drawTopCard()
        }
    </script>

    <Deck bind:this={deckComp} />
    ```

    Available methods are:
    |Methods|Description|
    |:-----:|:---------:|
    |gettingReady|makes Deck ready to call other method upon. Only needed if you need to call other methods immediatly after initialization|
    |getDeck|get the deck|
    |drawTopCard|remove the top card|
    |drawCards|remove n cards|
    |shuffleWithTransition|shuffle the deck with optional transition|
    |showCardFront|show frontside of a card|
    |hideCardFront|show backside of a card|
    |flipCard| flip a card|
    |showTopCardFront|show frontside of top card|
    |hideTopCardFront|show backside of top card|
    |flipTopCard| flip top card|
    |drop| drag and drop a card|
    

    Available Functions are:
    |Functions|Description|
    |:-------:|:---------:|
    |generateFullDeckFun|generates a full deck (with/without jokers)
    |shuffleFun|shuffle the provided deck|

2. **Card**


    Component to render a card
    Import component by
    ```svelte
    import Card from "svelte-playing-cards/Card.svelte"
    ```
    and use it in your code 
    ```svelte
    <Card card="10-of-CLUBS" />
    ```
    
    Other props are:

    |Props|Default values|Description|
    |:---:|:------------:|:---------:|
    |width|"200px"|width|
    |height|"250px"|height|
    |topPosition|"0px"|css top (in case of position = absolute)|
    |leftPosition|"0px"|css left (in case of position = absolute)|
    |position|"absolute"|position|
    |showBackSide|true|should show back side|
    |**card***|-|card face value (value-of-suit)|
    |customBack|null|custom component to display on backside of card|
    |customBackProps|{}|props for custom back component|
    |customFront|null|custom component to display on frontside of card|
    |customFrontProps|{}|props for custom front component|
    |enableDrag|true|allow card to be drag and drop|
    |shouldRotate|false|rotate 90deg to swap width and height|
    |onClick|flip the card| on:click handler|
    |onDblClick|remove the card (from DOM)| on:dblclick handler|

    To use methods:
    ```svelte
    <script>
        import Card from "svelte-playing-cards/Card.svelte"
        let cardComp: Deck;

        $: if(cardComp){
            // now you can use the methods available on Card like cardComp.flip()
        }
    </script>

    <Card bind:this={cardComp} />
    ```

    Available methods are:
    |Methods|Description|
    |:-----:|:---------:|
    |getCard|get the card value hold by this card|
    |flip|flip the card|
    |remove|remove the card (from DOM)|
    |transitionToTarget|transitions the card towards target|
    |showFront|show frontside of card|
    |showBack|show backside of card|
    |drop|function to call when drop the card on HTMLElement|    
    |getPosition|get css top and left of the card|
    |setPosition|set css top and left of the card|
    |getSuppliedProps|get supplied props to the card|
    |shufflingTransition|make shuffling transition. (does not make sense to use it alone. Better to use in a deck)|


