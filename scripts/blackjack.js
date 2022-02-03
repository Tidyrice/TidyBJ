module.exports = {
    blackjack: function(msg, args, BJMap) {
        
        if (args[0] === "start") {

            //if the game room already exists, exit
            if (BJMap.get(msg.author.id))
                return msg.reply( "**There is already a game in session!**");

            //create the BJ room
            deck = ShuffleDeck();

            const BJRoom = {
                username: msg.author.name,
                deck: ShuffleDeck(),
                playerHand: [],
                dealerHand: []
            }
        }
        

        if (args[0] === "hit" || args[0] === "h") {

        }


        if (args[0] === "stand" || args[0] === "s") {

        }










        function ShuffleDeck() {
            
            let deck = ["A♣️", "2♣️", "3♣️", "4♣️", "5♣️", "6♣️", "7♣️", "8♣️", "9♣️", "10♣️", "J♣️", "Q♣️", "K♣️", "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️", "A♦️", "2♦️", "3♦️", "4♦️", "5♦️", "6♦️", "7♦️", "8♦️", "9♦️", "10♦️", "J♦️", "Q♦️", "K♦️"];

            //shuffle
            for (i = 0; i < 1000; i++) {
                let indexA = Math.floor(Math.random() * 53);
                let indexB = Math.floor(Math.random() * 53);

                let cardA = deck[indexA];
                let cardB = deck[indexB];

                deck[indexA] = cardB;
                deck[indexB] = cardA;
            }

            return deck;
        }
    }
}