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
            const room = {
                username: msg.author.name,
                deck: deck,
                playerHand: [],
                dealerHand: [],
                //-1 = no winner. 0 = player wins. 1 = dealer wins
                winner: -1
            }

            //initial hands
            room.playerHand.push(DrawCard());
            room.playerHand.push(DrawCard());
            room.dealerHand.push(DrawCard());

            //writes the room into the hashmap
            BJMap.set(msg.author.id, room);

            //send embed
            DisplayRoom();

        //HIT
        } else if (args[0] === "hit" || args[0] === "h") {

            const room = BJMap.get(msg.author.id);

            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");
            
            //player draws a card
            room.playerHand.push(DrawCard);

            //dealer draws a card (or stands)
            DealerDraw();

            //check if game is over
            HasWon();

        //STAND
        } else if (args[0] === "stand" || args[0] === "s") {
            
            const room = BJMap.get(msg.author.id);

            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");

            //dealer draws cards until 17 or bust
            DealerDrawTo17();

            //check if game is over
            HasWon();

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

            //puts the card (string) and value (integer) into an object for returning
            const deckObject = {
                cards: deck,
                values: cardValues
            };

            return deckObject;
        }

        function DrawCard() {

            //removes first card from deck array and assigns it to a variable for returning
            let cardObject = room.deck.shift();

            return cardObject;
        }

        function DealerDraw() {

            const value = SumValues().dealer;

            //if the value of the dealer's hand is less than 17, draw a card
            if (value < 17)
                room.dealerHand.push(DrawCard());
        }

        function DealerDrawTo17() {

            const value = SumValues().dealer;

            //if the value of the dealer's hand is less than 17, draw until 17
            while (value < 17) {

                room.dealerHand.push(DrawCard());

                //update the "value" variable
                value = SumValues().dealer;
            }
        }

        function HasWon() {

            //player and dealer values
            const values = SumValues();
            const playerValue = values.player;
            const dealerValue = values.dealer;

            //push
            if (playerValue == dealerValue && playerValue <= 21) {

            }
            
            //player 21
            if (playerValue == 21 && dealerValue < 21) {

                //blackjack!
                if (room.playerHand.length == 2) {

                }

            }

            //dealer 21
            if (playerValue < 21 && dealerValue == 21) {

            }

            //player bust
            if (playerValue > 21 && dealerValue <= 21) {

            }

            //dealer bust
            if (playerValue <= 21 && dealerValue > 21) {

            }
        }

        function SumValues() {

            //what is the value of the player's cards?
            let playerValue = 0
            for (i = 0; i < room.playerHand.length; i++) {
                //index 1 in the second layer of the array is the value of the card
                playerValue += room.playerHand[i].value;
            }

            //what is the value of the dealer's cards?
            let dealerValue = 0
            for (i = 0; i < room.dealerHand.length; i++) {
                //index 1 in the second layer of the array is the value of the card
                dealerValue += room.dealerHand[i].value;
            }

            //puts values into an object and returns
            const values = {
                player: playerValue,
                dealer: dealerValue
            };

            return values;
        }

        function DisplayRoom() {

            //EMBED
        }
    }
}