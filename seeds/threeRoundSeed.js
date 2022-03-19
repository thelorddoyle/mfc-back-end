const db = require("../config/db");
const Nft = require("../models/Nft");
const Fight = require("../models/Fight");
const Tournament = require("../models/Tournament");
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
const image = ["None"];

const selectRandomElement = function (array) {
    return array[
        Math.floor(Math.random() * array.length) // picks a random index
    ];
};

db.once("open", async () => {
    await Nft.deleteMany();
    await Fight.deleteMany();
    await Tournament.deleteMany();

    //TODO: do a login and print the token
    //TODO: make 4 NFTs 
    
    //CREATE TOURNAMENTS (THIS TRIGGERS FIGHT CREATION)
    try {
        for (let i = 0; i < 7; i++) {
            let round;
            
            if (i === 0) {
                round = 1;
            } else if (i === 1 || i <= 2) {
                round = 2;
            } else if (i === 3 || i <= 7) {
                round = 3;
            }

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
        console.log('login token:', login)
    } catch (err){
        console.log(err)
    }

    // MINTING NFTS
    try {
        for(let i = 0; i < 5; i++ ){
            mintNft("62351e170334c980d7a09953") //TODO: This is not 
        }
        // console.log(Nft.findOne())

        // console.log(`Minted ${await Nft.count({user: '62351e170334c980d7a09953'})} Nfts`);

    } catch (err) {
        throw new Error(err)
    }
    
    process.exit(0); // exits the node mode after seeding.
});
