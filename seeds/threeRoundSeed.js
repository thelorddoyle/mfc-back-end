const db = require("../config/db");
const Nft = require("../models/Nft");
const Fight = require("../models/Fight");
const Tournament = require("../models/Tournament");
const { createTournament } = require("../grahpql/resolvers/tournament");
const { generateToken } = require("../grahpql/resolvers/user");
const { mintNft } = require("../grahpql/resolvers/nft");
const nft = require("../grahpql/resolvers/nft");

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
const image = ["None"];

const selectRandomElement = function (array) {
    return array[
        Math.floor(Math.random() * array.length) // picks a random index
    ];
};

// if you want a variable number of rounds calculate the total number of tournaments. 
const getTournamentCount = (numRounds) => {
    // get the sum of 2^0 + 2^1 up till round count
    let tournamentCount = 0;

    for (let i = 0; i < numRounds; i++){
        tournamentCount += Math.pow(2, i);
    }

    return tournamentCount;
}

const getRoundNum = (tournamentIndex) => {
    let maxTournamentIndexInRound = 1;
    
    for (i = 0; i < 10; i ++){
        if (tournamentIndex <= maxTournamentIndexInRound){
            return round = i + 1;
        } else{
            maxTournamentIndexInRound += Math.pow(2, i+1);
        }   
    }
}

//TESTS
// console.log(`for 3 round, count should be: ${getTournamentCount(3)} = 7` );
// console.log(`for 4 round, count should be: ${getTournamentCount(4)} = 15` );
// console.log(`for 10 round, count should be: ${getTournamentCount(10)} = 15` );


// console.log(`for fight number: '1', round should be: ${getRoundNum(1)} = 1` );
// console.log(`for fight number: '2', round should be: ${getRoundNum(2)} = 2` );
// console.log(`for fight number: '3', round should be: ${getRoundNum(3)} = 2` );
// console.log(`for fight number: '4', round should be: ${getRoundNum(4)} = 3` );
// console.log(`for fight number: '6', round should be: ${getRoundNum(6)} = 3` );
// console.log(`for fight number: '7', round should be: ${getRoundNum(7)} = 3` );
// console.log(`for fight number: '127', round should be: ${getRoundNum(127)} = 7` );
// console.log(`for fight number: '128', round should be: ${getRoundNum(128)} = 8` );


db.once("open", async () => {
    await Nft.deleteMany();
    await Fight.deleteMany();
    await Tournament.deleteMany();

    //CREATE TOURNAMENTS (THIS TRIGGERS FIGHT CREATION)
    try { 
        const numRounds = 3
        for (let i = 1; i <= getTournamentCount(numRounds); i++) { // TODO: change the 7 for however many rounds we have. 

            const round = getRoundNum(i)
            console.log('round found')
            
            
            // for all fights find their respective 

            await createTournament({
                startDate: new Date(),
                status: "pending",
                round
            });
        }
        
        const firstTournament = await Tournament.findOne();
        console.log(`Created ${await Tournament.count()} Tournaments`);
        console.log(`First tournament ID is: ${firstTournament.id}`);
    } catch (error) {
        throw new Error(error);
    }

    //CREATE NFTS
    try {
        for (let i = 0; i < 32; i++) {
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

    //LOGIN TO LAURENCE ACCOUNT: 
    try {
        const login = generateToken({
            username: "laurence",
            password: "chicken"
        })

        console.log("Logged in to 'laurence'")
        console.log('login token:', login, '(MAY BE A VALID TOKEN)');
    } catch (err){
        console.log(err)
    }

    // MINTING NFTS
    try {
        for(let i = 0; i < 5; i++ ){
            await mintNft("62351e170334c980d7a09953")
        }

        console.log(`Minted ${await Nft.count({user: '62351e170334c980d7a09953'})} Nfts that belong to user: 'laurence'`);

    } catch (err) {
        throw new Error(err)
    }
    
    process.exit(0); // exits the node mode after seeding.
});
