module.exports = {
    blackjack: function(msg, args, BJMap, Discord) {

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
                //-1 = no winner. 0 = player wins. 1 = dealer wins
                winner: -1
            }

            //updates the global variable "room"
            room = BJroom

            //initial hands
            BJroom.playerHand.push(DrawCard());
            BJroom.playerHand.push(DrawCard());
            BJroom.dealerHand.push(DrawCard());

            //writes the room into the hashmap
            BJMap.set(msg.author.id, BJroom);

            //check if game is over. Also sends an embed to the discord channel
            HasWon();

        //HIT
        } else if (args[0] === "hit" || args[0] === "h") {

            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");
            
            //player draws a card
            room.playerHand.push(DrawCard());

            //dealer draws a card (or stands)
            DealerDraw();

            //check if game is over. Also sends an embed to the discord channel
            HasWon();

        //STAND
        } else if (args[0] === "stand" || args[0] === "s") {
            
            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");

            //dealer draws cards until 17 or bust
            DealerDrawTo17();

            //check if game is over. Also sends an embed to the discord channel
            HasWon();

        } else {
            //if the command is neither "start", "hit", or "stand"
            return msg.reply(" **Parameter invalid.**");
        }


        function ShuffleDeck() {
            
            let deck = ["A♣️", "2♣️", "3♣️", "4♣️", "5♣️", "6♣️", "7♣️", "8♣️", "9♣️", "10♣️", "J♣️", "Q♣️", "K♣️", "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️", "A♦️", "2♦️", "3♦️", "4♦️", "5♦️", "6♦️", "7♦️", "8♦️", "9♦️", "10♦️", "J♦️", "Q♦️", "K♦️"];
            let cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

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

        function DealerDraw() {

            const value = SumValues().dealer;

            //if the value of the dealer's hand is less than 17, draw a card
            if (value < 17)
                room.dealerHand.push(DrawCard());
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

        function HasWon() {

            //player and dealer values
            const values = SumValues();
            const playerValue = values.player;
            const dealerValue = values.dealer;

            //no winner yet; game continues
            if (playerValue < 21 && dealerValue < 21)
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

            //game over; delete room
            BJMap.delete(msg.author.id);
        }

        function DisplayRoom(message, winner) {

            //make string with player's card faces
            let playerCards = ""
            for (i = 0; i < room.playerHand.length; i++) {
                playerValue += room.playerHand[i].card;
            }

            //make string with dealer's card faces
            let dealerCards = ""
            for (i = 0; i < room.dealerHand.length; i++) {
                dealerValue += room.dealerHand[i].card;
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
                    { name: '<:Martlock:874209947678810113>  ' + 'Your hand ' + '<:Martlock:874209947678810113>',
                        value: playerCards},

                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Bridgewatch:874209993572900915> ' + "Dealer's hand " + '<:Bridgewatch:874209993572900915>',
                        value: dealerCards},
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                //.setFooter('Retrieved', 'https://i.imgur.com/AfFp7pu.png');
    
                //send embed
                msg.channel.send({embeds: [embed]
            });

            //send message
            if (winner == "")
                msg.channel.send(`Will ${room.username} hit or stand?`);
            else if (winner == "tie") {
                msg.channel.send("Standoff!")
            }
            else {
                msg.channel.send(`${winner} wins!`)
            }
        }
    }
}