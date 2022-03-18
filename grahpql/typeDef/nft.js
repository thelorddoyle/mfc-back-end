const gql = require('graphql-tag');

module.exports = gql`

    type Nft {

        id: ID!,
        user: User,
        background: String!,
        bodyType: String!,
        jewellery: String!, 
        tattoos: String!,
        hairStyle: String!,
        eyeColor: String!,
        facialHair: String!,
        clothing: String!, 
        shorts: String!,
        mouth: String!,
        headgear: String!,
        gloves: String!,
        bruisingOrBlood: String!,
        image: String!,
        
    }

    input CreateNft{
        id: ID,
        background: String,
        bodyType: String,
        jewellery: String, 
        tattoos: String,
        hairStyle: String,
        eyeColor: String,
        facialHair: String,
        clothing: String, 
        shorts: String,
        mouth: String,
        headgear: String,
        gloves: String,
        bruisingOrBlood: String,
        image: String
    }

    type Query{
       

		getNfts: [Nft]!,
		getNft(nftID: ID!): Nft!,

    }

	type Mutation{
	
	   	createNft(createNft: CreateNft): Nft!,
		mintNft: Nft!,	
		
    }

`