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

            //send embed
            DisplayRoom();

        //HIT
        } else if (args[0] === "hit" || args[0] === "h") {

            //are they in a room?
            if (room == null)
                return msg.reply(" **You are not currently in a game.**");
            
            //player draws a card
            room.playerHand.push(DrawCard());

            //dealer draws a card (or stands)
            DealerDraw();

            //check if game is over
            HasWon();

        //STAND
        } else if (args[0] === "stand" || args[0] === "s") {
            
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

        function DisplayRoom() { //NOT COMPLETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Imported from old project.

            //EMBED
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(item["EN-US"] + " " + enchantment)
                //.setURL('https://discord.js.org/')
                //.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
                .setDescription(item["Description"])
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Martlock:874209947678810113>  ' + 'Martlock ' + '<:Martlock:874209947678810113>', value: `Sell price: ${cityPrices[0].sell.price + cityPrices[0].sell.date}\n
                        Buy price: ${cityPrices[0].buy.price + cityPrices[0].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Bridgewatch:874209993572900915> ' + 'Bridgewatch ' + '<:Bridgewatch:874209993572900915>', value: `Sell price: ${cityPrices[1].sell.price + cityPrices[1].sell.date}\n
                        Buy price: ${cityPrices[1].buy.price + cityPrices[1].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Lymhurst:874210021922197534> ' + 'Lymhurst ' + '<:Lymhurst:874210021922197534>', value: `Sell price: ${cityPrices[2].sell.price + cityPrices[2].sell.date}\n
                        Buy price: ${cityPrices[2].buy.price + cityPrices[2].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Fort_Sterling:874210038804258846> ' + 'Fort Sterling ' + '<:Fort_Sterling:874210038804258846>', value: `Sell price: ${cityPrices[3].sell.price + cityPrices[3].sell.date}\n
                        Buy price: ${cityPrices[3].buy.price + cityPrices[3].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Thetford:874210055933788160> ' + 'Thetford ' + '<:Thetford:874210055933788160>', value: `Sell price: ${cityPrices[4].sell.price + cityPrices[4].sell.date}\n
                        Buy price: ${cityPrices[4].buy.price + cityPrices[4].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                    { name: '<:Caerleon:874210071092031518> ' + 'Caerleon ' + '<:Caerleon:874210071092031518>', value: `Sell price: ${cityPrices[5].sell.price + cityPrices[5].sell.date}\n
                        Buy price: ${cityPrices[5].buy.price + cityPrices[5].buy.date}`},
                    { name: '\u200B', value: '\u200B' },
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                .setFooter('Retrieved', 'https://i.imgur.com/AfFp7pu.png');
    
            msg.channel.send({embeds: [embed]});
        }
    }
}