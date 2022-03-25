const bcrypt = require('bcryptjs');

const db = require("../config/db");
const Nft = require("../models/Nft");
const Fight = require("../models/Fight");
const Tournament = require("../models/Tournament");
const User = require("../models/User")
const { createTournament } = require("../grahpql/resolvers/tournament");
const { generateToken } = require("../grahpql/resolvers/user");
const { mintNft } = require("../grahpql/resolvers/nft");

const background = ["Blue", "Red", "Cage", "Press Conference", "Gym"];
const bodyType = ["Ectomorph", "Endomorph", "Mesomorph"];
const jewellery = ["None"];
const tattoos = ["None", "Dragon", "Celtic", "Tribal", "Kids Names"];
const hairStyle = ["Cropped", "Bald", "Flowing", "Cornrows", "Spiked"];
const eyeColor = ["Blue", "Grey", "Green", "Red", "Black"];
const facialHair = ["None"];
const clothing = ["Shirt", "Pants", "Underwear", "Shirt"];
const shorts = ["Green", "Black and white", "Blue", "Black", "Red"];
const mouth = ["Smiling"];
const headgear = ["Hat", "Sombrero"];
const gloves = ["Red", "Yellow", "Green", "Brown"];
const bruisingOrBlood = ["Black eye", "Bloody Lip"];
const image = ["https://res.cloudinary.com/metaverse-fc/image/upload/v1647771047/NFTs/card6_dtzc1b.jpg", 
"https://res.cloudinary.com/metaverse-fc/image/upload/v1647771047/NFTs/card5_jwjkf5.jpg",
"https://res.cloudinary.com/metaverse-fc/image/upload/v1647771047/NFTs/card3_hccrrl.jpg",
"https://res.cloudinary.com/metaverse-fc/image/upload/v1647771047/NFTs/card4_nyl76z.jpg",
"https://res.cloudinary.com/metaverse-fc/image/upload/v1647771046/NFTs/card2_xmnadb.jpg",
"https://res.cloudinary.com/metaverse-fc/image/upload/v1647771046/NFTs/card1_nvag4n.jpg"]

const usernames = ["test", "jesus", "dan", "alex", "steve", "cam", "rowena", "jia"]

const selectRandomElement = function (array) {
    return array[
        Math.floor(Math.random() * array.length) // picks a random index
    ];
};

// if you want a variable number of rounds calculate the total number of tournaments.
const getTournamentCount = (numRounds) => {
    // get the sum of 2^0 + 2^1 + 2^2 ... up till round count
    let tournamentCount = 0;

    for (let i = 0; i < numRounds; i++) {
        tournamentCount += Math.pow(2, i);
    }

    return tournamentCount;
};

const getRoundNum = (fightIndex) => {
    let maxfightIndexInRound = 1;

    for (i = 1; i < 10; i++) {
        if (fightIndex <= maxfightIndexInRound) {
            return i;
        } else {
            maxfightIndexInRound += Math.pow(2, i);
        }
    }
};

//TESTS//
// console.log(`for 3 round, count should be: ${getTournamentCount(3)} = 7` );
// console.log(`for 10 round, num of tournaments is: ${getTournamentCount(10)} === 15` );

// console.log(`for fight number: '1', round should be: ${getRoundNum(1)} = 1` );
// console.log(`for fight number: '2', round should be: ${getRoundNum(2)} = 2` );
// console.log(`for fight number: '7', round should be: ${getRoundNum(7)} = 3` );
// console.log(`for fight number: '127', round should be: ${getRoundNum(127)} = 7` );
// console.log(`for fight number: '128', round should be: ${getRoundNum(128)} = 8` );

// SEED NFTS, TOURNAMENTS and FIGHTS ==> LOGIN and MINT
db.once("open", async () => {
    await Nft.deleteMany();
    await Fight.deleteMany();
    await Tournament.deleteMany();
    await User.deleteMany();

    //CREATE TOURNAMENTS (THIS TRIGGERS FIGHT CREATION)
    try {
        const numRounds = 3;
        for (let i = 1; i <= getTournamentCount(numRounds); i++) {
            const round = getRoundNum(i);

            await createTournament({
                startDate: new Date(),
                status: "pending",
                round,
            });
        }

        const firstTournament = await Tournament.findOne();
        console.log(
            `Created ${numRounds} Rounds, with ${await Tournament.count()} Tournaments `
        );
        console.log(`First tournament ID is: ${firstTournament.id}`);
    } catch (error) {
        throw new Error(error);
    }

    //CREATE NFTS
    try {
        for (let i = 0; i < 64; i++) {
            await Nft.create({
                background: selectRandomElement(background),
                bodyType: selectRandomElement(bodyType),
                jewellery: selectRandomElement(jewellery),
                tattoos: selectRandomElement(tattoos),
                hairStyle: selectRandomElement(hairStyle),
                eyeColor: selectRandomElement(eyeColor),
                facialHair: selectRandomElement(facialHair),
                clothing: selectRandomElement(clothing),
                shorts: selectRandomElement(shorts),
                mouth: selectRandomElement(mouth),
                headgear: selectRandomElement(headgear),
                gloves: selectRandomElement(gloves),
                bruisingOrBlood: selectRandomElement(bruisingOrBlood),
                image: selectRandomElement(image),
            });
        }
        console.log(`Created ${await Nft.count()} Nfts`);
    } catch (error) {
        throw new Error(error);
    }

    // REGISTER ACCOUNTS AND MINT NFT's:
    try {
        const userIds = [];
        // usernames.forEach( async (username) => {
        for( let i = 0; i < usernames.length; i++){
            const username = usernames[i]
            password = await bcrypt.hash('password', 12); //Encrypt password before saving it
    
            const user = await User.create({
                username,
                email: `${username}@ga.com`,
                password: password,
                amountInWallet: 5,
                createdAt: new Date()
            })
            console.log(`Created the user: '${username}', password: 'chicken'`);
    
            userIds.push(user.id);
        }
        
        // MINTING NFTS
        for(let i = 0; i< 4; i++){
            for (let j = 0; j < 8; j++) {
                await mintNft(userIds[j]);
            }
        }

    } catch (err) {
        console.log(err)
    }

    //LOGIN TO TEST ACCOUNT:
    try {
        const login = generateToken({
            username: "test",
            password: "password",
        });

        console.log("Logged in to 'test'");
        console.log("login token:", login, "(MAY NOT BE A VALID TOKEN)");
    } catch (err) {
        console.log(err);
    }

    process.exit(0); // exits the node mode after seeding.
});


// TODO: ADD IN MORE THAN ONE ACCOUNT. 