module.exports = {
    blackjack: function(msg, args, BJMap, MessageEmbed) {

        //dumbcheck
        if (args.length == 0)
            return msg.reply(" **Please specify a parameter!**");

        //global variable: blackjack room
        let room = BJMap.get(msg.author.id);

        //start the room
        if (args[0] === "start") {

            //if the game room already exists, exit
            if (BJMap.has(msg.author.id))
                return msg.reply( "**There is already a game in session!**");

            //calls the ShuffleDeck function. Array index 0 are the cards (strings) and index 1 are card values (integers)
            deck = ShuffleDeck();

            //create the BJ room (local variable)
            const BJroom = {
                username: msg.author.username,
                deck: deck,
                playerHand: [],
                dealerHand: [],
            }

            //updates the global variable "room"
            room = BJroom

            //initial hands
            BJroom.playerHand.push(DrawCard());
            BJroom.playerHand.push(DrawCard());
            BJroom.dealerHand.push(DrawCard());

            //writes the room into the hashmap
            BJMap.set(msg.author.id, BJroom);

            //check if game is over. Also sends an embed to the discord channel. The parameter is whether the player has stood.
            HasWon(false);

        //HIT
        } else if (args[0] === "hit" || args[0] === "h") {

            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");
            
            //player draws a card
            room.playerHand.push(DrawCard());

            //check if game is over. Also sends an embed to the discord channel
            HasWon(false);

        //STAND
        } else if (args[0] === "stand" || args[0] === "s") {
            
            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");

            //dealer draws cards until 17 or bust
            DealerDrawTo17();

            //check if game is over. Also sends an embed to the discord channel
            HasWon(true);

        } else {
            //if the command is neither "start", "hit", or "stand"
            return msg.reply(" **Parameter invalid.**");
        }

        function ShuffleDeck() {
            
            let deck = ["A♣️", "2♣️", "3♣️", "4♣️", "5♣️", "6♣️", "7♣️", "8♣️", "9♣️", "10♣️", "J♣️", "Q♣️", "K♣️", "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️", "A♦️", "2♦️", "3♦️", "4♦️", "5♦️", "6♦️", "7♦️", "8♦️", "9♦️", "10♦️", "J♦️", "Q♦️", "K♦️"];
            let cardValues = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

            //shuffle the deck 2000 times
            for (i = 0; i < 2000; i++) {
                let indexA = Math.floor(Math.random() * 52);
                let indexB = Math.floor(Math.random() * 52);

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

            //removes first card from deck array and assigns it to a variable
            let cardFace = room.deck.cards.shift();
            let cardValue = room.deck.values.shift();

            //puts the values into an object for returning
            const cardObject = {
                card: cardFace,
                value: cardValue
            };

            return cardObject;
        }

        function DealerDrawTo17() {

            let value = SumValues().dealer;

            //if the value of the dealer's hand is less than 17, draw until 17
            while (value < 17) {

                room.dealerHand.push(DrawCard());

                //update the "value" variable
                value = SumValues().dealer;
            }
        }

        function SumValues() {

            //what is the value of the player's cards?
            let playerValue = 0
            for (i = 0; i < room.playerHand.length; i++) {
                playerValue += room.playerHand[i].value;
            }

            //what is the value of the dealer's cards?
            let dealerValue = 0
            for (i = 0; i < room.dealerHand.length; i++) {
                dealerValue += room.dealerHand[i].value;
            }

            //puts values into an object and returns
            const values = {
                player: playerValue,
                dealer: dealerValue
            };

            return values;
        }

        function HasWon(didPlayerStand) {

            //player and dealer values
            const values = SumValues();
            let playerValue = values.player;
            let dealerValue = values.dealer;

            //player has ACE (value 11) and is BUST
            if (playerValue > 21 && IndexOfAce(room.playerHand) != -1) {
                //update ACE to value 1
                room.playerHand[IndexOfAce(room.playerHand)].value = 1;
                //update playerValue variable
                playerValue -= 10;
            }

            //dealer has ACE (value 11) and is BUST
            if (dealerValue > 21 && IndexOfAce(room.dealerHand) != -1) {
                //update ACE to value 1
                room.dealerHand[IndexOfAce(room.dealerHand)].value = 1;
                //update dealerValue variable
                dealerValue -= 10;
            }

            //no winner yet; game continues. If the player DID stand, game is over, continue to else if
            if (playerValue < 21 && dealerValue < 21 && !didPlayerStand)
                return DisplayRoom("", "");

            //push
            else if (playerValue == dealerValue && playerValue <= 21) {
                DisplayRoom("Push!", "tie");
            }
            
            //player 21
            else if (playerValue == 21 && dealerValue < 21) {

                //blackjack!
                if (room.playerHand.length == 2) {
                    DisplayRoom("Blackjack!", room.username);
                } else {
                DisplayRoom("Player wins!", room.username);
                }
            }

            //dealer 21
            else if (playerValue < 21 && dealerValue == 21) {
                DisplayRoom("Dealer wins!", "Dealer");
            }

            //player bust
            else if (playerValue > 21 && dealerValue <= 21) {
                DisplayRoom("Player bust!", "Dealer");
            }

            //dealer bust
            else if (playerValue <= 21 && dealerValue > 21) {
                DisplayRoom("Dealer bust!", room.username);
            }

            //player has higher value
            else if (playerValue > dealerValue) {
                DisplayRoom("Player wins!", room.username);
            }

            //dealer has higher value
            else if (dealerValue > playerValue) {
                DisplayRoom("Dealer wins!", "Dealer");
            }

            //game over; delete room
            BJMap.delete(msg.author.id);
        }

        function IndexOfAce(hand) {

            let cardValues = [];

            //puts all the card values into the array
            for (i = 0; i < hand.length; i++) {
                cardValues[i] = hand[i].value;
            }

            //what is the index of the first card with value 11 (ACE)?
            const indexOfAce = cardValues.indexOf(11);
            return indexOfAce;
        }

        function DisplayRoom(message, winner) {

            //make string with player's card faces
            let playerCards = ""
            for (i = 0; i < room.playerHand.length; i++) {
                playerCards += room.playerHand[i].card;
            }

            //make string with dealer's card faces
            let dealerCards = ""
            for (i = 0; i < room.dealerHand.length; i++) {
                dealerCards += room.dealerHand[i].card;
            }

            //EMBED
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(room.username + "'s Blackjack Game")
                //.setURL('https://discord.js.org/')
                //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                .setDescription(message)
                .setThumbnail('https://www.pngitem.com/pimgs/m/82-824090_card-spade-poker-casino-playing-gamble-blackjack-png.png')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: "Your hand",
                        value: playerCards},

                    { name: '\u200B', value: '\u200B' },
                    { name: "Dealer's hand",
                        value: dealerCards},
                )
                .setFooter('TidyCasino', 'https://cdn.discordapp.com/avatars/795764421393776672/813fb837b8bba7d82d3ebb03ece0e50d.webp?size=80');
    
                //send embed
                msg.channel.send({embeds: [embed]
            });

            //send message
            if (winner == "")
                msg.channel.send(`**Will ${room.username} hit or stand?**`);
            else if (winner == "tie") {
                msg.channel.send("**Standoff!**")
            }
            else {
                msg.channel.send(`**${winner} wins!**`)
            }
        }
    }
}