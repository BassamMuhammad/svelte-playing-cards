<script lang="ts">
  import type { SvelteComponent } from "svelte";

  import Card from "./Card.svelte";
  import Deck from "./Deck.svelte";
  export let name: string;
  let ele: Deck;
  if (ele) ele.shuffle();
  let l: SvelteAllProps;

  const onClick: svelte.JSX.MouseEventHandler<HTMLDivElement> = (e) => {
    const { x, y } = e.currentTarget.getBoundingClientRect();
    const cards = ele.drawTopCard(x, y);
    setTimeout(() => {
      l = cards[2];
    }, 2000);
  };

  const onDrop: svelte.JSX.DragEventHandler<HTMLDivElement> = (e) => {
    const c = ele.drawTopCard();
    ele.drop(c[1])(e);
  };
</script>

<main style="background-color: aqua;">
  <h1>Hello {name}!</h1>
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
    {#if l}
      <svelte:component this={Card} {...l} />
    {/if}
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
