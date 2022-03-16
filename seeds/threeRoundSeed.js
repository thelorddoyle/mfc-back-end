const db = require("../config/db")
const Nft = require("../models/Nft");
const Fight = require("../models/Fight");
const Tournament = require("../models/Tournament");
const {createTournament} = require("../grahpql/resolvers/tournament")

const background = ['Blue', 'Red', 'Cage', 'Press Conference', 'Gym'];
const bodyType = ['Ectomorph', 'Endomorph', 'Mesomorph'];
const jewellery = ['None']
const tattoos = ['None', 'Dragon', 'Celtic', 'Tribal', 'Kids Names']
const hairStyle = ['Cropped', 'Bald', 'Flowing', 'Cornrows', 'Spiked']
const eyeColor = ['Blue', 'Grey', 'Green', 'Red', 'Black']
const facialHair = ['None']
const clothing = ['Shirt','Pants','Underwear','Shirt'] 
const shorts = ['Green', 'Black and white', 'Blue', 'Black', 'Red']
const mouth = ['Smiling']
const headgear = ['Hat', 'Sombrero']
const gloves = ['Red','Yellow','Green','Brown']
const bruisingOrBlood = ['Black eye','Bloody Lip']
const image = ['None']


const selectRandom = function(array){
    return Math.floor(Math.random() * array.length);
}

db.once('open', async () => {
    await Nft.deleteMany();
    await Fight.deleteMany();
    await Tournament.deleteMany();

    try {
        let roundTourney;
        for (let i = 0; i < 7; i++) {
            if( i === 0 ){
                roundTourney = 1;
            }else if(i === 1 || i <=2 ){
                roundTourney = 2 ;
            }else if(i === 3  || i <= 7 ){
                roundTourney = 3 
            }
            const  result =  await createTournament(
                {
                    startDate: new Date(),
                    status: 'pending',
                    round: roundTourney,
                }
              )
        }
        console.log("tournaments created");
      
    } catch (error) {
        throw new Error(error)
    }

    try {
        
        for (let i = 0; i < 99; i++) {
                const result = await Nft.create({
                    background: background[selectRandom(background)],
                    bodyType: bodyType[selectRandom(bodyType)],
                    jewellery: jewellery[selectRandom(jewellery)],
                    tattoos: tattoos[selectRandom(tattoos)],
                    hairStyle: hairStyle[selectRandom(hairStyle)],
                    eyeColor: eyeColor[selectRandom(eyeColor)],
                    facialHair: facialHair[selectRandom(facialHair)],
                    clothing: clothing[selectRandom(clothing)],
                    shorts: shorts[selectRandom(shorts)],
                    mouth: mouth[selectRandom(mouth)],
                    headgear: headgear[selectRandom(headgear)],
                    gloves: gloves[selectRandom(gloves)],
                    bruisingOrBlood: bruisingOrBlood[selectRandom(bruisingOrBlood)],
                    image: image[selectRandom(image)]
                })

        }
        console.log("Nfts created");
      
    } catch (error) {
        throw new Error(error)
    }


})