const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function createDeck() {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push([rank, suit]);
        }
    }
    return deck
}

function dealCards(deck) {
    const usedIndices = new Set();
    const chosenIndices = [];

    while (chosenIndices.length < 4) {
        const randomIndex = Math.floor(Math.random() * 52);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            chosenIndices.push(randomIndex);
        }
    }

    const playerCards = [deck[chosenIndices[0]], deck[chosenIndices[1]]];
    const dealerCards = [deck[chosenIndices[2]], deck[chosenIndices[3]]];

    return { playerCards, dealerCards };
}

function calculateCardValue(rank) {
    if (['K', 'Q', 'J', '10'].includes(rank)) return 0;
    if (rank == 'A') return 1;
    return parseInt(rank);
}

function displayCards(cardList) {
    const formattedCards = cardList.map(([suit, rank]) => `${suit}-${rank}`);
    return formattedCards.join(', ');
}

async function playGame() {
    let chips = 0;
    const deck = createDeck()

    while (true) {
        const bet = await askQuestion("Please put your bet\n> ");
        const betAmount = parseInt(bet);

        if (isNaN(betAmount) || betAmount <= 0) {
            console.log("Invalid bet amount. Try again.");
            continue;
        }

        const {playerCards, dealerCards} = dealCards(deck)
        console.log(`You got ${displayCards(playerCards)}`);
        console.log(`The dealer got ${displayCards(dealerCards)}`);

        const playerScore = (calculateCardValue(playerCards[0][0])+calculateCardValue(playerCards[1][0]))%10
        const dealerScore = (calculateCardValue(dealerCards[0][0])+calculateCardValue(dealerCards[1][0]))%10

        if (playerScore > dealerScore) {
            console.log(`You won!!!, received ${betAmount} chips`);
            chips += betAmount;
        } else if (playerScore < dealerScore) {
            console.log(`You lost!!!, forfeited ${betAmount} chips`);
            chips -= betAmount;
        } else {
            console.log("Tie!!!");
        }

        const continuePlaying = await askQuestion("Wanna play more (Yes/No)?\n> ");
        if (continuePlaying.toLowerCase() != 'yes') {
            break;
        }
    }

    if (chips < 0) {
        console.log(`You forfeit total ${Math.abs(chips)} chips.`);
    } else if (chips == 0) {
        console.log("You didn't get chips");
    } else {
        console.log(`You got total ${chips} chips.`);
    }
    rl.close();
}

playGame();
