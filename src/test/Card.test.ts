import { render } from '@testing-library/svelte';
import Card from '../lib/Card.svelte';
import TestingCustomBack from './TestingCustomBack.svelte';
import TestingCustomFront from './TestingCustomFront.svelte';

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.runOnlyPendingTimers();
	jest.useRealTimers();
});

it('Should render properly', () => {
	const { getByTestId, getByAltText } = render(Card, {
		props: {
			width: '200px',
			height: '250px',
			position: 'absolute',
			topPosition: '10px',
			leftPosition: '100px',
			showBackSide: false,
			card: '10-of-CLUBS'
		}
	});
	const cardElem = getByTestId('card');
	const { top, left, bottom, right, width, height } = cardElem.style;
	expect(top).toEqual('10px');
	expect(left).toEqual('100px');
	expect(right).toBeFalsy();
	expect(bottom).toBeFalsy();
	expect(width).toEqual('200px');
	expect(height).toEqual('250px');
	expect(cardElem.childElementCount).toEqual(1);
	expect(getByAltText('10-of-CLUBS')).toBeInTheDocument();
});

it('Front customization working properly', () => {
	const { getByText } = render(Card, {
		props: {
			customFront: TestingCustomFront,
			showBackSide: false,
			card: '10-of-CLUBS'
		}
	});
	const customFront = getByText('Custom Front');
	expect(customFront).toBeInTheDocument();
});

it('Back customization working properly', () => {
	const { getByText } = render(Card, {
		props: {
			customBack: TestingCustomBack,
			showBackSide: true,
			card: '10-of-CLUBS'
		}
	});
	const customBack = getByText('Custom Back');
	expect(customBack).toBeInTheDocument();
});

describe('get correct card', () => {
	const cardPath = './cards';
	it('Clubs', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: '10-of-CLUBS'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/clubs/10-of-CLUBS.svg`));
		expect(img.alt).toEqual(`10-of-CLUBS`);
	});
	it('Hearts', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: '10-of-HEARTS'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/hearts/10-of-HEARTS.svg`));
		expect(img.alt).toEqual(`10-of-HEARTS`);
	});
	it('Diamonds', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: '10-of-DIAMONDS'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/diamonds/10-of-DIAMONDS.svg`));
		expect(img.alt).toEqual(`10-of-DIAMONDS`);
	});
	it('Spades', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: '10-of-SPADES'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/spades/10-of-SPADES.svg`));
		expect(img.alt).toEqual(`10-of-SPADES`);
	});
	it('Joker', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: 'BLACK-JOKER'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/jokers/BLACK-JOKER.svg`));
		expect(img.alt).toEqual(`BLACK-JOKER`);
	});
	it('After drag and drop', () => {
		const { getByRole } = render(Card, {
			props: {
				showBackSide: false,
				card: 'http://random-site.com/RED-JOKER.svg'
			}
		});
		const img = getByRole('img') as HTMLImageElement;
		expect(img.src).toMatch(new RegExp(`${cardPath}/jokers/RED-JOKER.svg`));
		expect(img.alt).toEqual(`RED-JOKER`);
		expect(img.src).not.toMatch(/.(http|svg).(http|svg)/);
	});
});
