const db = require("../config/db");
const Nft = require("../models/Nft");
const Fight = require("../models/Fight");
const Tournament = require("../models/Tournament");
const { createTournament } = require("../grahpql/resolvers/tournament");

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

    //CREATE TOURNAMENTS (THIS TRIGGERS FIGHT CREATION)
    try {
        let roundTourney;
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                roundTourney = 1;
            } else if (i === 1 || i <= 2) {
                roundTourney = 2;
            } else if (i === 3 || i <= 7) {
                roundTourney = 3;
            }

            await createTournament({
                startDate: new Date(),
                status: "pending",
                round: roundTourney,
            });
        }
        console.log(`Created ${await Tournament.count()} Tournaments`);
    } catch (error) {
        throw new Error(error);
    }

    //CREATE NFTS
    try {
        for (let i = 0; i < 99; i++) {
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

        process.exit(0); // exits the node mode after seeding.
    } catch (error) {
        throw new Error(error);
    }
});
