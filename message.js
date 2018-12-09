const HELP = [
`Food additives preserve flavor, or enhance taste and appearance of packed food. On the packet, they are listed in ingredients box like "E202", "100(ii)", etc. These are called the "E number", or "I.N.S. code" of the additive. You can ask me about the "name", "code", "type", or "approval" of any such additive. You can ask like:
- What is I.N.S. 203?
- Tell me the name of I.N.S. one hundred sixty point three.
- What is the code of potassium sorbate?
- Give me the type of E one hundred.
- I want to know about approval status of I.N.S. 203.

Say "done", or "got it" when you are done talking to me.`,
];
const WELCOME = [
  'Welcome Chief. I can play audio from the corners of the Internet.\nSomething like "Play Halo Combat Evolved O.S.T.".',
  'Hi Person. I love reading out finance books.\nSay like "Read Rich Dad Poor Dad audiobook".',
  'Hey Homo sapiens. Like satirical news?\nAsk me "I want to listen to Last Week Tonight".',
  'Dear organism. Interested in Wikipedia articles?\nTry like "Tell me about Himalayas, Wikipedia audio article".',
  'Salute Master. I love all game soundtracks.\nSomething like "Hear Splinter Cell Blacklist O.S.T.".',
  'Hello User. Do you like comedy dialogues? Ask me "Start Stuart little funny Hindi".',
  'Greetings friend. Is it time for learning Parkour? Let\'s start with "Play Warning Call - Mirror\'s Edge".',
  'Ho Ho Ho. Ready for Christmas?\nShout "I want to hear Christmas carols by Listening Music".',
];
const STOP = [
  'Goodbye!',
  'Bye!',
  'Tata!',
  'Alvida!',
];
const NONE = [
  "I don't know about that.",
  "It's not a food additive.",
  "I don't know about ingredients.",
  "I don't think it's a food additive.",
];
const MORE = [
  "Knowledge is power, ask me more.",
  "What else do you want to know?",
  "Anything else?",
  "Something else?",
  "What's next?",
  "What else?",
];
const CODE = [
  "${names} is ${code}.",
  "${names} is coded as ${code}.",
  "${names} is numbered as ${code}.",
  "${names} is written as ${code}.",
];
const NAME = [
  "${code} is ${names}.",
  "${code} is called as ${names}.",
  "${code} is known as ${names}.",
  "${code} is assigned to ${names}.",
];
const STATUS_NO = [
  "${code}, called as ${names}, is not approved.",
  "${code}, or ${names}, does not pass any compliance.",
  "No country has consented to the use of ${names}, a.k.a. ${code}.",
  "No one accepts use of ${names}, assigned ${code}.",
];
const STATUS_YES = [
  "${code}, called as ${names}, is approved by ${status}.",
  "${code}, or ${names}, passes compliance of ${status}.",
  "${status} have consented to the use of ${names}, a.k.a. ${code}.",
  "${status} accept use of ${names}, assigned ${code}.",
];
const TYPE = [
  "${code}, called as ${names}, is a ${type}.",
  "${code}, or ${names}, is a type of ${type}.",
  "${names}, a.k.a. ${code}, is used as a ${type}.",
  "${names}, assigned ${code}, works as a ${type}.",
];
const ANY_NO = [
  "${code}, called as ${names}, is a ${type}. It is not approved.",
  "${code}, or ${names}, is a type of ${type}. It does not pass any compliance.",
  "No country has consented to the use of ${names}, a.k.a. ${code}. It is used as a ${type}",
  "No one accepts use of ${names}, assigned ${code}. It works as a ${type}.",
];
const ANY_YES = [
  "${code}, called as ${names}, is a ${type}. It is approved by ${status}.",
  "${code}, or ${names}, is a type of ${type}. It passes compliance of ${status}.",
  "${status} have consented to the use of ${names}, a.k.a. ${code}. It is used as a ${type}.",
  "${status} accept use of ${names}, assigned ${code}. It works as a ${type}.",
];
const ERROR = [
  "I didn't get that. Can you say it again?",
  "I missed what you said. Say it again?",
  "Sorry, could you say that again?",
  "Sorry, can you say that again?",
  "Can you say that again?",
  "Sorry, I didn't get that.",
  "Sorry, what was that?",
  "One more time?",
  "What was that?",
  "Say that again?",
  "I didn't get that.",
  "I missed that.",
];

const FORMAT = new Map([
  ['help', HELP],
  ['welcome', WELCOME],
  ['stop', STOP],
  ['none', NONE],
  ['more', MORE],
  ['code', CODE],
  ['name', NAME],
  ['status_no', STATUS_NO],
  ['status_yes', STATUS_YES],
  ['type', TYPE],
  ['any_no', ANY_NO],
  ['any_yes', ANY_YES],
  ['error', ERROR],
]);

function message(typ, obj={}) {
  var fmts = FORMAT.get(typ), fmt = fmts[Math.floor(Math.random()*fmts.length)];
  return fmt.replace(/\${(\w+)}/g, (m, p1) => obj[p1]);
};
module.exports = message;
