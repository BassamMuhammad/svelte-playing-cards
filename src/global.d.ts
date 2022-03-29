/// <reference types="svelte" />

export type Suit = "SPADES" | "DIAMONDS" | "HEARTS" | "CLUBS";
export type ValueWithoutJoker =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "JACK"
  | "QUEEN"
  | "KING"
  | "ACE";
export type Value = ValueWithoutJoker | "JOKER";
export type CardType =
  | `${ValueWithoutJoker}-of-${Suit}`
  | "BLACK-JOKER"
  | "RED-JOKER";
