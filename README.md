Technical document describing the overall structure of the NFT => FIGHTS => TOURNAMENT = (Possible ROUND);

IMPORTANT DETAILS:
BUILD ALL EMPTY TOURNAMENTS IN SEED 
BUILD ALL EMPTY FIGHTS IN SEED

Mint has two parts:
In Round #1 (Genesis) all slots need to be filled by unique nfts (32)
In Round #2-#3  50% of slots are filled by Nfts in previous rounds the remaining 50% are new mints
Each mint needs to populate the respective slots for all following Rounds.

Unique mints for each round: 
    Round #1: 32 (genesis)
    Round #2: 32
    Round #3: 64
    Round #4: 128...



1. ~~Use tourney to pass the minted nft to the first availible fight slot.~~
2. ~~Add "round" field to the Tournament~~
3. ~~Make some seeds mentioned~~
3.1 Make some Nft Minting Seeds. 
4. ~~Make sure you can reseed (destroy all)~~
5. ~~Build function that places NFTs in to all of their future positions in rounds @ mint stage~~
6. Resolve our first tournament
    6.1. ~~complete the fight between nft 1 and nft 2 in an individual Fight~~
    6.2. ~~generate a random winner of the fight~~
    6.3. ~~pass nft1, nft2 and the winner of the fight to the fightGenerator~~
    6.4. ~~have the fight generator return a fightReplay object that is inserted in to the fight~~
    6.5. ~~update Fight with all of it's available fields (winnerId, loserId, fightReplay, tournamentIndex etc)~~
    6.5.1 ~~add the tiers to the seeds~~
    6.6. ~~after fight has been resolved, move the winning NFT in to the next fight @ tournamentIndex 3~~
    6.7. ~~loop until tournament has "completed".~~
    6.8. ~~update tournament winner and loser fields~~
7. Chain the Resolving of all tournament (DAN PLEASE CONFIRM IF THIS IS CORRECT BUSINESS LOGIC)