module.exports = {
    blackjack: function(msg, args, BJMap, Discord) {

        //dumbcheck
        if (args.length == 0)
            return msg.reply(" **Please specify a parameter!**");

        //start the room
        if (args[0] === "start") {

            //if the game room already exists, exit
            if (BJMap.get(msg.author.id))
                return msg.reply( "**There is already a game in session!**");

            //calls the ShuffleDeck function. Array index 0 are the cards (strings) and index 1 are card values (integers)
            deck = ShuffleDeck();

            //create the BJ room
            const BJRoom = {
                username: msg.author.name,
                deck: deck[0],
                cardValues: deck[1],
                playerHand: [],
                dealerHand: []
            }

            //writes the room into the hashmap
            BJMap.set(msg.author.id, BJRoom);

        //HIT
        } else if (args[0] === "hit" || args[0] === "h") {
            const room = BJMap.get(msg.author.id);
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");

        //STAND
        } else if (args[0] === "stand" || args[0] === "s") {
            const room = BJMap.get(msg.author.id);
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");

        } else {
            //if the command is neither "start", "hit", or "stand"
            return msg.reply(" **Parameter invalid.**");
        }






        function ShuffleDeck() {
            
            let deck = ["A♣️", "2♣️", "3♣️", "4♣️", "5♣️", "6♣️", "7♣️", "8♣️", "9♣️", "10♣️", "J♣️", "Q♣️", "K♣️", "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️", "A♦️", "2♦️", "3♦️", "4♦️", "5♦️", "6♦️", "7♦️", "8♦️", "9♦️", "10♦️", "J♦️", "Q♦️", "K♦️"];
            let cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

            //shuffle
            for (i = 0; i < 1000; i++) {
                let indexA = Math.floor(Math.random() * 53);
                let indexB = Math.floor(Math.random() * 53);

                //shuffle the cards
                let cardA = deck[indexA];
                let cardB = deck[indexB];
                deck[indexA] = cardB;
                deck[indexB] = cardA;

                //shuffle the card values
                let valueA = cardValues[indexA];
                let valueB = cardValues[indexB];
                cardValues[indexA] = valueB;
                cardValues[indexB] = valueA;
            }

            //puts the cards (strings) and values (integers) into an array for returning
            const deckArray = [deck, cardValues];
            return deckArray;
        }

        function DrawCard() {

            //get the room from the hashmap
            const room = BJMap.get(msg.author.id);

            let deck = room.deck;
            let cardValues = room.cardValues;

            //removes first card from arrays and assigns it to variables
            let card = deck.shift();
            let value = cardValues.shift();

            //writes the new deck into the hashmap
            room.deck = deck;
            room.cardValues = cardValues;
            BJMap.set(msg.author.id, room);
            
            //puts the card (string) and value (integer) into an array for returning
            const cardArray = [card, value];
            return cardArray;
        }
    }
}