const XState = require('xstate')

const { createMachine, actions, interpret } = XState;

function generateFightResults (firstNft, secondNft, victoriousNft) {

    // console.log(firstNft, secondNft, victoriousNft)
    
    const fight = {
        attack: {
            strike: {
                strikeAttackKick: [
                    "targets the body with a kick",
                    "goes for a spectacular spinning kick",
                    "aims a leg kick to the lead leg of his opponent",
                    "aims a heavy leg kick at his opponent",
                    "aims a kick at his opponent's already battered leg",
                    "throws a heavy leg kick",
                    "throws a heavy body kick",
                    "throws a question mark kick",
                    "throws a head kick",
                    "attempts a head kick",
                    "attempts a leg kick",
                    "attempts a body kick",
                    "attempts a spinning kick",
                    "attempts a push kick",
                    "attempts a teep kick",
                    "attempts a roundhouse kick",
                    "attempts a side kick",
                    "attempts a back kick",
                    "throws a head kick",
                    "throws a leg kick",
                    "throws a body kick",
                    "throws a spinning kick",
                    "throws a push kick",
                    "throws a teep kick",
                    "throws a roundhouse kick",
                    "throws a side kick",
                    "throws a back kick",
                    "throws an athletic spinning kick",
                    "throws an athletic switch kick",
                    "engages from distance with a leg kick",
                    "engages from distance with a body kick",
                    "engages from distance with a switch kick",
                    "engages from distance with a roundhouse kick",
                    "engages from distance with a teep kick",
                    "engages from distance with a straight kick",
                    "engages from distance with a push kick",
                    "keeps distance, firing off kick",
                    "looks to catch his opponent with a high kick",
                    "looks to catch his opponent with a low kick",
                    "looks to catch his opponent with a teep kick",
                    "looks to catch his opponent with a straight kick",
                    "looks to catch his opponent with a flying kick",
                    "measures his distance with a leg kick",
                    "measures his distance with a kick",
                    "aims a body kick at his opponent"
                ],
                strikeAttackPunch: [
                    "throws a hard straight punch",
                    "aims a left hook at his opponent",
                    "engages with quick fist strikes",
                    "engages with heavy right-hand strikes",
                    "charges towards his opponent swinging wildly",
                    "starts quickly throwing a jab straight combination",
                    "shows no fear flailing towards his opponent",
                    "attacks wildly with a haymaker",
                    "attempts a flurry of punches to his opponents body",
                    "engages in an exchange of punches",
                    "moves forward agressively throwing a wild haymaker",
                    "continues to throw punches to the body",
                    "continues to throw strikes moving backwards",
                    "attempts a jab",
                    "attempts a straight",
                    "attempts a left hook",
                    "attempts a right hook",
                    "attempts a flurry of punches",
                    "attempts a quick punch combination",
                    "attempts to close the distance and jab",
                    "attempts to force his opponent to fist-fight",
                    "attempts to body-shot his opponent",
                    "throws a jab",
                    "throws a straight jab",
                    "throws a left hook",
                    "throws a right hook",
                    "throws an uppercut",
                    "throws an overhand",
                    "throws a haymaker",
                    "throws a left carelessly, with his chin up",
                    "swings wildly at his opponent",
                    "shows quick hands with a jab, straight combination",
                    "shows quick hands with a combination",
                    "closes in with a jab",
                    "closes in with a straight",
                    "closes in with a combination",
                    "closes in with an overhand",
                    "closes in with a left hook",
                    "closes in with a right hook",
                    "gets back to his jab",
                    "gets back to his boxing",
                    "measures his range with a left hand",
                    "measures his range with a right hand",
                    "attempts to close the distance and strike",
                    "throws a looping right hook",
                    "throws a looping left hook",
                    "winds up on punches as his opponent welcomes the brawl",
                    "winds up on punches"
                ],
            },
            wrestling: {
                takedownAttempt: [
                    "attempts an immediate double leg takedown",
                    "attempts an immediate single leg takedown",
                    "presses his opponent up against the fence",
                    "attempts jabs and shoots for the takedown",
                    "continues to hold his opponent against the cage",
                    "Thai clinches his opponent throwing heavy knees",
                    "has his opponents leg here",
                    "shoots a takedown on his opponent",
                    "presses his opponent to the cage attempting the takedown",
                    "gets the underhooks pressing for a takedown",
                    "looks to wrestle his opponent to the ground",
                    "has his hands locked attempting the double leg",
                    "looks to take his opponent down",
                    "shows his intention going for the takedown",
                    "wants this fight on the ground attempting the takedown",
                    "closes the distance trying to drag his opponent to the ground",
                    "wrestles his opponent against the cage",
                    "wants the takdown shooting from distance",
                    "shoots on a deep takedown, this could go to the ground",
                    "chains his wrestling together beautifully going for the takedown",
                    "presses forward looking for the takedown",
                    "circles away before shooting for the takedown",
                    "sets up the takedown attempt with punches",
                    "sets up the takedown attempt with a leg kick",
                    "sets up the takedown attempt with feints",
                    "commits to the takedown attempt",
                    "charges at his opponent attempting the takedown",
                    "attempts a wild takedown grabbing at his opponent",
                    "is confident with his wrestling attempting the takedown",
                    "shows he backs his wrestling shooting for the takedown",
                    "has control of the back going for the takedown",
                    "looks like he has this takedown completed",
                    "shows great counterwrestling and may have the takedown",
                    "looks to have the position here to score the takedown",
                    "takes control of the wrestling attempting the takedown",
                    "has a leg looking to score the takedown",
                    "chain wrestles his opponent into the cage",
                    "shows his wrestling pedigree with a technical takedown attempt",
                    "drops to the legs with the takedown attempt",
                    "drops to a single leg takedown attempt",
                    "drops to a double let takedown attempt",
                    "feints the overhand shooting for the takedown",
                    "feints the jab shooting for the takedown",
                    "feints the hook shooting for the takedown",
                    "feints the strike shooting for the takedown",
                    "feints the low kick shooting for the takedown",
                    "shoots for a huge takedown",
                    "shoots for a technical takedown",
                    "shoots for a hopeful takedown",
                    "dives for the legs of his opponent",
                ],
                submissionAttempt: [
                    "attempts a triangle on his opponent",
                    "isolates the one arm its under the chin",
                    "isolates the arm and attacks the armbard",
                    "is getting very close to having the choke in",
                    "is threatening the choke",
                    "is threatening the neck",
                    "is threatening the armbar",
                    "is threatening the kimura",
                    "progresses to side control attempting the submission",
                    "progresses to side control attempting the kimura",
                    "progresses to side control attacking the submission",
                    "progresses to mount attacking the submission",
                    "progresses to mount attempting the armbar",
                    "takes the back attacking the choke",
                    "progresses to mount attacking the choke",
                    "has the leg lock in tight",
                    "has the choke in tight",
                    "attacks the armbar",
                    "attacks the submission",
                    "locks in the choke",
                    "has the armbar in tight",
                    "has the triangle choke in tight",
                    "could finish the submission here",
                    "has a dangerous submission locked in",
                    "looks like he could finish the submission",
                    "shows his ability on the ground locking in the choke",
                    "shows his ability on the ground locking in the armbar",
                    "moves into position to land the leg lock",
                    "controls position going for the submission",
                    "taunts has he has the triangle locked in",
                    "looks like he may finish the submission",
                    "locks in a tight submission",
                    "could finish his opponent with the submission",
                    "is close to finishing the submission",
                    "has the rear naked choke in tight",
                    "has the submission locked in",
                    "looks like he may finish the fight with the submission",
                    "isolates the arm locking in the submission",
                    "takes his opponents back and locks in the choke",
                    "transitions to the anaconda choke",
                    "transitions to the choke",
                    "transitions to the armbar",
                    "may finish the submission",
                    "has the darce choke in tight",
                    "threatens the darce choke",
                    "has the submission in tight will his opponent tap",
                    "has the submission in tight his opponent may go out cold",
                    "squeezes tight on the choke",
                    "may break his opponents arm if he doesnt tap",
                    "could win this one via submission",
                ]
            }
        }, // end of attack
        defence: {
            strike: {
                strikeDefenceKick: [
                    "evades another leg-barrage as he moves backwards",
                    "looks tired as he continues to evade kicks",
                    "keeps his hands up and avoids damage from the kick",
                    "slips the kick and circles away",
                    "shows great head movement avoiding the kick",
                    "ducks under an incoming kick",
                    "blocks the kicks calmly",
                    "shows his fight IQ evading the kick-attack",
                    "ducks under an incoming head kick",
                    "evades a flurry of kicks",
                    "refuses to engage, keeping out of the kick-range",
                    "evades another barrage as he moves backwards",
                    "avoids another heavy strike circling away",
                    "wont go down despite taking a beating",
                    "takes yet another strike to the body",
                    "is taking a beating how long can this last",
                    "shows signs of wearing as he begins to slow down",
                    "doesn't want to engage backing away",
                    "continues to evade his opponents kicks",
                    "looks tired as he continues to evade kicks",
                    "refuses to go down after copping big kicks",
                    "marches forward despite taking a beating",
                    "looks hurt but refuses to quit",
                    "shows he is in the fight despite taking a beating",
                    "attempts to duck but is caught on the chin",
                    "blocks the kick",
                    "evades the kick",
                    "slips the kick",
                    "ducks the kick",
                    "closely avoids a kick",
                    "keeps distance, avoiding the kick",
                    "leans back, avoiding the kick",
                    "slides out of the way, dodging the kick",
                    "keeps his hands up, blocking the kick",
                    "shows no fear, narrowly avoiding the kick",
                    "calmly blocks the kick",
                    "nervously blocks the kick",
                    "anxiously evades the kick",
                    "runs away from his opponent as he avoids the kick",
                    "blocks the kick with ease",
                    "blocks the kick with relative ease",
                    "avoids the kick with ease",
                    "narrowly avoids the kick",
                    "confidently blocks the kick",
                    "throws his middle finger up after evading the kick",
                    "taunts his opponent, evading the kick",
                    "refuses to engage after avoiding the kick",
                    "laughs, talking to his opponent as he ducks the kick",
                    "laughs, talking to his opponent as he slips the kick"
                ],
                strikeDefencePunch: [
                    "evades another barrage as he moves backwards",
                    "looks tired as he continues to evade strikes",
                    "keeps his hands up and avoids damage",
                    "slips the strike and circles away",
                    "shows great head movement avoiding the strike",
                    "ducks under an incoming strike",
                    "blocks the strikes calmly",
                    "avoids a flurry of punches and moves forward",
                    "circles his opponent looking to counter",
                    "evades a flurry",
                    "refuses to engage circling the cage",
                    "evades another barrage as he moves backwards",
                    "avoids another heavy strike circling away",
                    "avoids a spinning back fist by centimetres",
                    "wont go down despite taking a beating",
                    "takes yet another strike to the body",
                    "is taking a beating how long can this last",
                    "shows signs of wearing as he begins to slow down",
                    "doesn’t want to engage backing away",
                    "continues to evade his opponents attacks",
                    "looks tired as he continues to evade strikes",
                    "refuses to go down after copping big strikes",
                    "marches forward despite taking a beating",
                    "looks hurt but refuses to quit",
                    "shows he is in the fight despite taking a beating",
                    "attempts to duck but is caught on the chin",
                    "blocks the punch",
                    "evades the punch",
                    "slips the punch",
                    "ducks the punch",
                    "closely avoids a punch",
                    "keeps distance avoiding the punch",
                    "leans back avoiding the punch",
                    "slides out of the way dodging the punch",
                    "keeps his hands up blocking the punch",
                    "shows no fear narrowly avoiding the punch",
                    "calmly blocks the punch",
                    "nervously blocks the punch",
                    "anxiously evades the punch",
                    "runs away from his opponent as he avoids the punch",
                    "blocks the punch with ease",
                    "blocks the punch with relative ease",
                    "avoids the punch with ease",
                    "narrowly avoids the punch",
                    "confidently blocks the punch",
                    "throws his middle finder up after evading the punch",
                    "taunts his opponent evading the punch",
                    "refuses to engage after avoiding the punch",
                    "laughs talking to his opponent as he ducks the punch",
                    "laughs talking to his opponent as he slips the punch"
                ]
            },
            wrestling: {
                takedownDefence: [
                    "stuffs his opponents takedown attempt",
                    "blocks the takedown refusing to go to the mat",
                    "continues to defend the takedown",
                    "blocks the takedown, he is doing well with the wrestling defense",
                    "defends the takedown showing how hard it is to get him down",
                    "sprawls, defending the takedown and creating seperation",
                    "shows his wrestling pedigree with that defense",
                    "stuffs the takedown attempt",
                    "blocks the takedown with ease",
                    "looks like he may end up on his back but eventually escapes the takedown",
                    "refuses to go down preventing the takedown",
                    "refuses to go down blocking the takedown",
                    "fights off the takedown successfully",
                    "refuses to go down denying the takedown",
                    "shows his strength preventing the takedown",
                    "shows his technique preventing the takedown",
                    "denies the takedown attempt beautifully",
                    "effectively avoids any danger from that takedown",
                    "maintains control avoiding the takedown",
                    "avoids the takedown showing his strength",
                    "manages to keep his balance avoiding the takedown",
                    "avoids the takedown showing his balance",
                    "hops athletically before escaping the takedown",
                    "is forced onto one leg before somehow escaping the takedown",
                    "presses on his opponents head avoiding the takedown",
                    "manages to outwrestle his opponent and avoid the takedown",
                    "stuffs the takedown with ease",
                    "wears on his opponent defending the takedown",
                    "wears on his opponent stuffing the takedown",
                    "wears on his opponent blocking the takedown",
                    "avoids the takedown showing great technique",
                    "avoids the takedown showing great balance",
                    "avoids the takedown showing great strength",
                    "looks like he is going to the ground, no, he avoids the takedown",
                    "looks like he is going to the ground, no, he stuffs the takedown",
                    "looks like he is going to the ground, no, he blocks the takedown",
                    "forces his opponent to withdraw the takedown throwing heavy knees",
                    "forces his opponent to withdraw the takedown a lead uppercut",
                    "defends the takedown with strikes",
                    "defends the takedown with knees",
                    "defends the takedown with some slick wrestling",
                    "defends the takedown with an acrobatic reversal",
                    "blocks the takedown with some slick wrestling",
                    "stuffs the takedown with some slick wrestling",
                    "defends the takedown with a nifty reversal",
                    "blocks the takedown with some acrobatic wrestling",
                    "stuffs the takedown with some acrobatic wrestling",
                    "surprises the fans with that takedown defense",
                    "looks to have surprised himself with that takedown defense",
                    "taunts his opponent after defending the takedown"
                ],
                submissionDefence: [
                    "somehow escapes the submission",
                    "reverses the submission",
                    "manages to escape and get to his feet",
                    "shows great technique avoiding the submission",
                    "shows great technique defending the submission",
                    "shows great technique countering the submission",
                    "avoids the submission",
                    "only just escapes the submission",
                    "only just reverse the submission",
                    "only just counters the submission",
                    "slips out returning to his feet",
                    "shows his pedigree escaping the submission",
                    "shows great heart avoiding the submission",
                    "refuses to tap escaping the submission",
                    "refuses to tap returning to his feet",
                    "athletically counters returning to his feet",
                    "somehow reverses the submission",
                    "somehow counters the submission",
                    "counters the submission returning to his feet",
                    "breaks the submission and returns to his feet",
                    "reverses the submission returning to his feet",
                    "escapes returning to his feet",
                    "counters returning to his feet",
                    "reverses returning to his feet",
                    "defends the submission",
                    "defends the submission returning to his feet",
                    "athletically reverses returning to his feet",
                    "scrambles out of the submission",
                    "scrambles out of the submission returning to his feet",
                    "somehow avoids the submission",
                    "breaks the grip avoiding the submission",
                    "breaks the grip returning to his feet",
                    "shows great poise escaping the submission",
                    "refuses to quit escaping the submission",
                    "taunts his opponent as he counters the submission",
                    "taunts his opponent as he escapes the submission",
                    "taunts his opponent as he reverses the submission",
                    "reverses the submission",
                    "wont quit avoiding the submission",
                    "wont quit countering the submission",
                    "wont quit reversing the submission",
                    "wont quit escaping the submission",
                    "athletically escapes the submission",
                    "aggressively counters the submission",
                    "somehow escapes returning to his feet",
                    "doesnt give up reversing the submission",
                    "doesnt give up countering the submission",
                    "doesnt give up escaping the submission",
                    "keeps the fight alive escaping the submission",
                    "keeps the fight alive countering the submission"
                ],
            }
        }, // end of defence
        counter: {
            strike: {
                counterPunch: [
                    "counters with an uppercut",
                    "counters with a jab",
                    "counters with a left hook",
                    "counters with a right hook",
                    "counters with a spinning back fist",
                    "ducks a jab and counters with an uppercut",
                    "counters his opponent with a jab straight combo",
                    "looks to be on top countering with a heavy jab",
                    "counters a jab with a heavy leg kick",
                    "counters with a spinning back fist",
                    "knocks his opponent down with a counter",
                    "fires back with a similar strike",
                    "slips a punch, counters and ducks away",
                    "ducks a punch, counters and circles away",
                    "slips a punch, counters and circles away",
                    "counters with a clean left hand",
                    "counters with a clean right hand",
                    "counters with a clean jab",
                    "counters with a clean hook",
                    "counters with a clean uppercut",
                    "counters with a one-two combination",
                    "counters with an overhand",
                    "counters with a heavy jab",
                    "counters with a heavy straight",
                    "counters and ducks away",
                    "counters and taunts his opponent",
                    "counters with an open hand slap",
                    "throws a heavy counter getting his opponents attention",
                    "throws a heavy counter",
                    "throws a blazing hot left hand counter",
                    "throws a blazing hot right hand counter",
                    "slips countering effectively",
                    "ducks countering effectively",
                    "surprises his opponent with the counter",
                    "aims an overhand right counter",
                    "aims a counter jab",
                    "aims a counter hook",
                    "aims a counter uppercut",
                    "counters with a clean left hand",
                    "counters with a clean right hand",
                    "counters as he picks up the pace",
                    "counters as he wears on his opponent",
                    "marches forward countering confidently",
                    "ducks before countering with agression",
                    "agressively counters and moves forward",
                    "counters moving backwards",
                    "slips countering the punch",
                    "slips and throws a jab",
                    "slips and throws back a hook",
                    "slips and throws a hook"
                ],        
                counterKick: [
                    "counters a leg kick with a heavy jab",
                    "counters with an uppercut",
                    "counters with a jab",
                    "counters with a left hook",
                    "counters with a right hook",
                    "counters with a spinning back fist",
                    "counters his opponent with a jab straight combo",
                    "looks to be on top countering with a heavy jab",
                    "knocks his opponent down with a counter",
                    "fires back with a similar strike",
                    "slips a kick, counters and ducks away",
                    "counters and ducks away",
                    "counters and taunts his opponent",
                    "counters with an open hand slap",
                    "throws a heavy counter getting his opponents attention",
                    "throws a heavy counter",
                    "throws a blazing hot left hand counter",
                    "throws a blazing hot right hand counter",
                    "slips countering effectively",
                    "ducks countering effectively",
                    "surprises his opponent with the counter",
                    "aims an overhand right counter",
                    "aims a counter jab",
                    "aims a counter hook",
                    "aims a counter uppercut",
                    "counters with a clean left hand",
                    "counters with a clean right hand",
                    "counters as he picks up the pace",
                    "counters as he wears on his opponent",
                    "marches forward countering confidently",
                    "ducks before countering with agression",
                    "agressively counters and moves forward",
                    "counters moving backwards",
                    "slips and throws a jab",
                    "slips and throws back a hook",
                    "slips and throws a hook",
                    "slips and throw a leg kick",
                    "slips and throws a head kick",
                    "blocks the kick and fires back",
                    "evades the kick firing back",
                    "fires back with a heavy strike",
                    "fires back with a quick combination",
                    "bites down on the mouth peice and fires back",
                    "doesnt take a step backwards as he returns fire",
                    "slips the kick, walking towards his opponent",
                    "times the duck perfectly throwing a return strike",
                    "avoids damage before throwing the counter",
                    "shows his timing ducking the strike and firing back",
                    "sticks his tongue out at his opponet after a slick counter"
                ]
            }, // end of counter: strike
            wrestling: {
                submissionScramble: [
                    "shows great flexibility getting back to his feet",
                    "shows great agility getting back to his feet",
                    "shows great technique getting back to his feet",
                    "shows great athleticism getting back to his feet",
                    "counters getting back to his feet",
                    "reverses getting back to his feet",
                    "bounces back to his feet",
                    "scrambles back to his feet",
                    "reverses managing to return to his feet",
                    "scrambles managing to return to his feet",
                    "counters managing to return to his feet",
                    "counters his opponent returning to his feet",
                    "forces the scramble returning to his feet",
                    "forces the scramble and escapes",
                    "reverses athletically managing to return to his feet",
                    "creates distance scrambling to his feet",
                    "creates seperation getting to his feet",
                    "creates seperation scrambling to his feet",
                    "creates distance getting to his feet",
                    "counters the position returning to his feet",
                    "defends returning to his feet",
                    "defends scrambling to his feet",
                    "defends escaping to his feet",
                    "scrambles out and returns to his feet",
                    "avoids danger returning to his feet",
                    "reverses returning to his feet",
                    "keeps range scrambling to his feet",
                    "keeps range returning to his feet",
                    "blocks the move returning to his feet",
                    "blocks the move escaping to his feet",
                    "blocks the move scrambling to his feet",
                    "manages to neatly scramble back to his feet",
                    "manages to escape scrambling back to his feet",
                    "counters escaping back to his feet",
                    "scrambles out of a bad position",
                    "scrambles out of a dangerous position",
                    "scrambles out returning to his feet",
                    "scrambles enough to get to his feet",
                    "creates enough seperation to escape",
                    "creates enough seperation to get back to his feet",
                    "performs a wild scramble escaping back to his feet",
                    "performs a wild scramble getting back to his feet",
                    "avoids further damage returning to his feet",
                    "shows his flexibility getting back to his feet",
                    "shows his agility getting back to his feet",
                    "shows his technique getting back to his feet",
                    "shows his athleticism getting back to his feet",
                    "taunts as he returns to his feet",
                    "taunts as he escapes to his feet",
                    "taunts as he scrambles to his feet",
                ]
            }
        }, // end of counter
        success: {
            strike: {
                strikeSuccessKick: [
                    "knocks his opponent down with a spinning kick",
                    "knocks his opponent down with a combo",
                    "lands a heavy body kick",
                    "catches his opponent with a big strike",
                    "begins to wear his opponent down with strikes",
                    "looks like he is taking control of the fight",
                    "catches his opponent with a heavy strike",
                    "catches his opponent with a devastating kick",
                    "catches his opponent who refuses to go down",
                    "Lands a spinning body kick on his opponent",
                    "knocks his opponent to the ground with a head kick",
                    "knocks his opponent to the ground with a huge kick",
                    "has hurt his opponent this could be all over",
                    "knocks his opponent down with a spinning kick",
                    "knocks his opponent down with a combo",
                    "looks like he may have worn his opponent down",
                    "is in the driving seat wearing his opponent down",
                    "lands a flying knee",
                    "lands a spinning kick",
                    "has hurt his opponent this fight could be over",
                    "knocks his opponent down following up with heavy strikes",
                    "continues to strike wildly with his opponent",
                    "chains together a kick into a one-two",
                    "chains together a strong combination",
                    "chains together a dangerous combination",
                    "hurts his opponent with a quick combination",
                    "connects with the kick",
                    "has busted his opponent open with that strike",
                    "times the shot perfectly hurting his opponent",
                    "times the shot perfectly catching his opponent",
                    "times the shot perfectly cutting his opponent",
                    "opens up a cut on his opponents eye",
                    "lands a heavy kick",
                    "hurts his opponent with that kick",
                    "lands an athletic kick on his opponent",
                    "forces his opponent backwards with the kick",
                    "has cut his opponent with that strike",
                    "hurts his opponent with the strike",
                    "looks to have damaged his opponent",
                    "catches his opponent with a heavy kick",
                    "shows his athleticism with that kick",
                    "shows how dangerous he is with that kick",
                    "hurts his opponent with that kick",
                    "looks to have wobbled his opponent",
                    "is on top here with another dangerous strike",
                    "follows up with a successful teep kick",
                    "follows up with a successful leg kick",
                    "follows up with a successful body kick",
                    "follows up with a successful high kick",
                    "follows up with a successful spinning kick"
                ],            
                strikeSuccessPunch: [
                    "catches his opponent with a huge uppercut",
                    "knocks his opponent down with a jab straight combo",
                    "knocks his opponent down with a check hook",
                    "knocks his opponent down with a right hook",
                    "knocks his opponent down with a combo",
                    "catches his opponent with a right hook",
                    "catches his opponent with a flurry of punches",
                    "catches his opponent with a big strike",
                    "begins to wear his opponent down with strikes",
                    "looks like he is taking control of the fight",
                    "catches his opponent with a heavy strike",
                    "catches his opponent with a haymaker",
                    "catches his opponent who refuses to go down",
                    "knocks his opponent down with a huge overhand",
                    "throws an uppercut, his opponents rocked",
                    "throws a jab, his opponents hurt",
                    "throws a straight, his opponents hurt",
                    "throws a hook, his opponents hurt",
                    "throws a six punch combo hurting his opponent",
                    "throws a four punch combo hurting his opponent",
                    "knocks his opponent to the ground with an uppercut",
                    "knocks his opponent to the ground with a haymaker",
                    "knocks his opponent to the ground with an overhand",
                    "has hurt his opponent this could be all over",
                    "catches his opponent with a huge uppercut",
                    "knocks his opponent down with a check hook",
                    "knocks his opponent down with a right hook",
                    "knocks his opponent down with a combo",
                    "knocks his opponent down with a jab straight combo",
                    "looks like he may have worn his opponent down",
                    "is in the driving seat wearing his opponent down",
                    "lands a flying knee",
                    "lands a spinning back fist",
                    "has hurt his opponent this fight could be over",
                    "knocks his opponent down following up with heavy strikes",
                    "continues to strike wildly with his opponent",
                    "batters his opponent with strikes",
                    "chains together a strong combination",
                    "chains together a dangerous combination",
                    "hurts his opponent with a quick combination",
                    "connects with the left hand",
                    "connects with the right hand",
                    "opens up a cut on his opponents eye",
                    "has busted his opponent open with that strike",
                    "shows his stand up skills hurting his opponent",
                    "shows his stand up skills cutting his opponent open",
                    "busts his opponent open with a heavy overhand",
                    "times the shot perfectly hurting his opponent",
                    "times the shot perfectly catching his opponent",
                    "times the shot perfectly cutting his opponent",
                ]
            },
            wrestling: {
                takedownSuccess: [
                    "finally gets his opponent to the floor",
                    "slams his opponent to the mat with that takedown",
                    "succeeds with the takedown",
                    "finishes the takedown",
                    "gets his opponent to the mat with the takedown",
                    "finishes the takedown successfully",
                    "lands the takedown",
                    "finishes the takedown with ease",
                    "takes control finishing the takedown",
                    "completes the takedown",
                    "wins that wrestling exchange getting the takedown",
                    "controls the wrestling exchange getting the takedown",
                    "wins that wrestling exchange completing the takedown",
                    "controls the wrestling exchange completing the takedown",
                    "hits the takedown successfully",
                    "puts his opponent on his back",
                    "lands the takedown putting his opponent on his back",
                    "finishes the takedown putting his opponent on his back",
                    "completes the takedown putting his opponent on his back",
                    "puts his opponent down onto the canvas",
                    "forces his opponent down onto the canvas",
                    "completes the takedown forcing his opponent to the canvas",
                    "completes the takedown putting his opponent on the canvas",
                    "lifts his opponent dropping him on his face",
                    "lifts his opponent dropping him on his back",
                    "lifts his opponent dropping him to the canvas",
                    "lifts his opponent dropping him to the ground",
                    "trips his opponent taking him down",
                    "tosses his opponent to the canvas",
                    "tosses his opponent to the ground",
                    "tosses his opponent to the floor",
                    "lifts his opponent off the ground and onto the mat",
                    "lifts his opponent off the ground and gingerly onto the mat",
                    "holds on tight completing the takedown",
                    "holds on tight finishing the takedown",
                    "explodes through the takedown taking his opponent to the mat",
                    "explodes through the takedown taking his opponent down",
                    "explodes into the takedown taking his opponent to the canvas",
                    "explodes into the takedown taking his opponent to the ground",
                    "uses the cage to take his opponent down",
                    "changes position before taking his opponent down",
                    "finishes the takedown successfully",
                    "completes the takedown",
                    "lands on his opponent following the takedown",
                    "holds his opponent in the air before slamming him down",
                    "holds his opponent in the air before slamming him to the mat",
                    "holds his opponent in the air before slamming him on his back",
                    "succeeds with an exceptional takedown",
                    "succeeds with a creative takedown",
                    "succeeds with a dangerous takedown",
                ],
                groundAndPound: [
                    "maintains top position with heavy ground and pound",
                    "is on top landing ground and pound this could be it",
                    "jumps on top and trys to finish the job",
                    "slams down heavy ground and pound",
                    "forces his opponent to cover up with ground strikes",
                    "maintains control from top position",
                    "hurts his opponent with ground strikes",
                    "fires off heavy strikes from top position",
                    "attacks the body from top position",
                    "attacks his opponents head from the top",
                    "fires in heavy ground and pound",
                    "cuts his opponent with big strikes from the top",
                    "lands heavy elbows from the top",
                    "causes heavy damage from top postion",
                    "lands elbows from the top",
                    "causes damage from top postion",
                    "lands strikes from top position",
                    "makes his opponent bleed with heavy strikes",
                    "lands multiple ground and pound strikes",
                    "lands heavy ground and pound",
                    "lands heavy strikes making his opponent bleed",
                    "busts his opponet open with heavy elbows",
                    "busts his opponet open with heavy strikes",
                    "attacks his opponent to the body and head",
                    "maintains control landing heavy elbows",
                    "maintains control landing heavy strikes",
                    "maintains control landing heavy punches",
                    "hurts his opponent to the body on the ground",
                    "aims heavy punches at his opponent",
                    "lands heavy shots from top position",
                    "fires off heavy ground and pound",
                    "continues to throw heavy strikes from the top",
                    "continues to throw heavy elbows from the top",
                    "throws heavy body shots from the top",
                    "throws heavy shots from the top",
                    "throws heavy elbows from the top",
                    "controls his opponent with ground strikes",
                    "controls his opponent with ground and pound",
                    "pressures his opponent with ground strikes",
                    "hurts his opponent on the ground",
                    "holds his opponent down with heavy shots",
                    "holds his opponent down with heavy strikes",
                    "taunts as he fires off heavy ground and pound",
                    "taunts as he lands elbows from the top",
                    "taunts as he lands body shots from the top",
                    "taunts as he lands heavy shots from the top",
                    "dominates his opponent on the ground",
                    "dominates from top position",
                    "could finish the fight from top position",
                    "could finish the fight with heavy ground strikes",
                ],
            }
        }// end of success
    }; // end of fight Object

    let attackSequenceRaw = [];
    let attackSequence = [];
    let attackSequenceWithMoves = []

    function convertRawAttackSequence (attackSequenceRaw) {
    attackSequenceRaw.forEach( move => {
        buildFightSequence(move[0], move[1], move[2])
    });
    }

    function finaliseFight (attackSequence) {
        attackSequence.forEach((move, index) => {
        attackSequenceWithMoves.push({
            body: randomElement(move[0]),
            attackerId: move[1],
            defenderId: move[2]
            })
    })
    }

    const contestants = {
        first: firstNft,
        second: secondNft,
        winner: victoriousNft
    }

    const fightMachine = createMachine({
        id: 'fight',
        initial: 'attack',
        context: {
        attacker: contestants.first,
        defender: contestants.second,
        winner: contestants.winner
        },
        states: {
            attack: {
            entry: (context) => { 
                        let prevAttacker = context.attacker;
                        let prevDefender = context.defender;
                        context.attacker = prevDefender;
                        context.defender = prevAttacker;
                        // console.log(context)
                    },
            on: {
                STRIKE: { target: 'strikeAttack'},
                WRESTLE: { target: 'printTakedownAttempt' }
            },
            },
            strikeAttack: {
                on: {
                KICK: { target: 'printStrikeAttackKick' },
                PUNCH: { target: 'printStrikeAttackPunch' },
                }
            },
            printTakedownAttempt: {
            on: {
                SUCCESS: { target: 'printSubmissionAttempt' },
                FAILURE: { target: 'printTakedownDefence' }
                }
            },
            printTakedownDefence: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },
            printSubmissionAttempt: {
            on: {
                // attacker grounds and pounds
                SUCCESS: { target: 'printSubmissionSuccess' },
                // defender is successful in defence
                DEFENCE: { target: 'printSubmissionDefence' },
                // defender scramble
                COUNTER: { target: 'printSubmissionCounter' }
            },
            },
            printSubmissionDefence: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },
            printSubmissionCounter: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },
            printSubmissionSuccess: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },
            printStrikeAttackKick: {
            on: {
                SUCCESS: { target: 'printStrikeAttackKickSuccess' },
                COUNTER: { target: 'printStrikeAttackKickCounter' },
                DEFENCE: { target: 'printStrikeAttackKickDefence' },
            },
            },
            printStrikeAttackKickDefence: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },        
            printStrikeAttackKickCounter: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },             
            printStrikeAttackKickSuccess: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },             
            printStrikeAttackPunch: {
            on: {
                SUCCESS: { target: 'printStrikeAttackPunchSuccess' },
                COUNTER: { target: 'printStrikeAttackPunchCounter' },
                DEFENCE: { target: 'printStrikeAttackPunchDefence' },
            },
            },
            printStrikeAttackPunchDefence: {
            on: {
                CONTINUE: {
                target: 'attack',
                }
            }
            },
            printStrikeAttackPunchCounter: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },        
            printStrikeAttackPunchSuccess: {
            on: {
                CONTINUE: {
                target: 'attack',
                },
            }
            },
            declare: {
            type: 'final'
            }
        },
    });

    function randomElement (arr) {

    return arr[ Math.floor(Math.random()*arr.length) ];

    };

    const transitionHandler =  (state, object, player1, player2) => {

    attackSequenceRaw.push([state.value, state.context.attacker, state.context.defender]);

    const nextEvent = randomElement( state.nextEvents );

    if (((attackSequenceRaw.length > 10 && state.value === 'printStrikeAttackPunchSuccess') || (attackSequenceRaw.length > 10 && state.value === 'printStrikeAttackKickSuccess') || (attackSequenceRaw.length > 10 && state.value === 'printSubmissionSuccess')) && state.context.attacker === state.context.winner ) {
        fightService.stop();
        convertRawAttackSequence(attackSequenceRaw)
        finaliseFight(attackSequence)
        // console.log(`${ state.context.attacker } has won!`)
    } else {
        fightService.send({ type: nextEvent });
    }
    };

    const fightService = interpret(fightMachine);

    fightService.onTransition(transitionHandler).start();

    function buildFightSequence(stateName, attacker, defender) {

    switch (stateName) {
        case 'printTakedownAttempt': attackSequence.push([fight.attack.wrestling.takedownAttempt, attacker, defender]); break;

        case 'printTakedownDefence': attackSequence.push([fight.defence.wrestling.takedownDefence, defender, attacker]); break;

        case 'printSubmissionAttempt': attackSequence.push([fight.attack.wrestling.submissionAttempt, attacker, defender]); break;

        case 'printSubmissionDefence': attackSequence.push([fight.defence.wrestling.submissionDefence, defender, attacker]); break;

        case 'printSubmissionCounter': attackSequence.push([fight.counter.wrestling.submissionScramble, defender, attacker]);break;

        case 'printSubmissionSuccess': attackSequence.push([fight.success.wrestling.groundAndPound, attacker, defender]);break;

        case 'printStrikeAttackKick': attackSequence.push([fight.attack.strike.strikeAttackKick, attacker, defender]); break;

        case 'printStrikeAttackKickDefence': attackSequence.push([fight.defence.strike.strikeDefenceKick, defender, attacker]); break;

        case 'printStrikeAttackKickCounter': attackSequence.push([fight.counter.strike.counterKick, defender, attacker]); break;

        case 'printStrikeAttackKickSuccess': attackSequence.push([fight.success.strike.strikeSuccessKick, attacker, defender]); break;

        case 'printStrikeAttackPunch': attackSequence.push([fight.attack.strike.strikeAttackPunch, attacker, defender]);break;

        case 'printStrikeAttackPunchDefence': attackSequence.push([fight.defence.strike.strikeDefencePunch, defender, attacker]); break;

        case 'printStrikeAttackPunchCounter': attackSequence.push([fight.counter.strike.counterPunch, defender, attacker]); break;

        case 'printStrikeAttackPunchSuccess': attackSequence.push([fight.success.strike.strikeSuccessPunch, attacker, defender]); break;
    }
    }

    // console.log(attackSequenceWithMoves)

    return attackSequenceWithMoves

}

// generateFightResults('Lozza', 'Jesus', 'Lozza')

module.exports = {generateFightResults}