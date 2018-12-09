const {dialogflow, Suggestions, LinkOutSuggestion, MediaObject, Image} = require('actions-on-google');
const ytSearch = require('@nodef/yt-search');
const natural = require('natural');
const ytdl = require('ytdl-core');
const https = require('https');
const urlParse = require('url').parse;
const query = require('./query');
const message = require('./message');


// Global variables
const app = dialogflow();
const store = new Map();
const RAPP = /.*?extra\W+audio(\W+and|\W+to)?\W*/i;

// Check if URL is accessible.
function httpsAccess(url) {
  var opt = Object.assign(urlParse(url), {method: 'HEAD'});
  return new Promise((fres, frej) => https.request(opt, res => {
    res.resume(); fres(res.statusCode>=200 && res.statusCode<400);
  }).on('error', frej).end());
};

// Get video URL from id.
function videoUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
};

// Check if audio URL ok.
function audioOk(url) {
  return !url.includes('gcr=us');
};

// Get M4A URL from info.
function audioUrl(inf) {
  for(var f of inf.formats)
    if(/audio.*?mp4/.test(f.type) && audioOk(f.url)) return f.url;
  for(var f of inf.formats)
    if(/audio/.test(f.type) && audioOk(f.url)) return f.url;
  var url = inf.formats[0].url;
  return audioOk(url)? url:null;
};

// Get search videos data.
function audioSearch(vids, o) {
  var z = [], match = 0;
  for(var v of vids) {
    if(!v.url.startsWith('/watch')) continue;
    var channel = v.userName||v.channelName;
    if(o.channel) match = natural.LevenshteinDistance(o.channel, channel, {search: true}).distance;
    z.push({id: v.videoId, title: v.title, channel, thumbnail: null, audio: null, match});
  }
  return o.channel? z.sort((a, b) => a.match-b.match):z;
};

// Get related videos data.
function audioRelated(vids) {
  var z = [], match = 0;
  for(var v of vids)
    z.push({id: v.id, title: v.title, channel: v.author, thumbnail: v.iurlhq||v.iurlmq, audio: null, match});
  return z;
};

// Get current video data.
function audioCurrent(inf, url) {
  return {id: inf.video_id, title: inf.title, channel: inf.author.name, thumbnail: inf.thumbnail_url, audio: url, match: 0};
};

// Search youtube, return promise.
function youtubeSearch(qry) {
  console.log('-youtubeSearch:', qry);
  return new Promise((fres, frej) => ytSearch(qry, (err, ans) => {
    return err? frej(err):fres(ans);
  }));
};

// Get YouTube audio for current.
async function youtubeAudio(vids) {
  var inf = null, url = null;
  console.log('-youtubeAudio:', vids.length);
  for(var i=0, I=vids.length; i<I; i++) {
    try {
      inf = await ytdl.getInfo(videoUrl(vids[i].id), {format: 'm4a'});
      url = audioUrl(inf);
    }
    catch(e) { console.error(e); }
    if(url) break;
  }
  vids.splice(0, i+1);
  return {inf, url};
};

// Check if audio surface.
function isAudioSurface(conv) {
  if(conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) return true;
  conv.ask('Sorry, this device does not support audio playback.');
  console.log('-isAudioSurface:', false);
  return false;
};

// Play audio from current.
function playAudio(conv, o) {
  console.log('-playAudio:', o);
  conv.ask(`Playing "${o.title}" by "${o.channel}"`);
  conv.ask(new Suggestions(['Again', 'Next', 'Related']));
  conv.ask(new LinkOutSuggestion({name: 'Video', url: videoUrl(o.id)}));
  return conv.ask(new MediaObject({
    name: o.title, url: o.audio, description: o.title,
    icon: new Image({url: o.thumbnail, alt: o.title}),
  }));
};

// Play audio from list.
async function playList(conv) {
  var s = store.get(conv.id);
  console.log('-playList:', s.list.length, s.related.length);
  var {inf, url} = await youtubeAudio(s.list);
  if(url==null) { var {inf, url} = await youtubeAudio(s.list=s.related); }
  if(url==null) return conv.ask('Could\'nt find anything to play!');
  s.current = audioCurrent(inf, url);
  s.related = audioRelated(inf.related_videos);
  return playAudio(conv, s.current);
};


// Intent "Default Fallback Intent"
async function defaultFallback(conv) {
  console.log('@defaultFallback:', conv.query, conv.id);
  var query = RAPP.test(conv.query)? conv.query.replace(RAPP, ''):null;
  if(query==null) conv.ask(conv.body.queryResult.fulfillmentText);
  return query? play(conv, {query}):defaultWelcome(conv);
};

// Intent "Default Welcome Intent"
async function defaultWelcome(conv) {
  console.log('@defaultWelcome:', conv.query, conv.id);
  return conv.ask(message('welcome'));
};

// Intent "Play Option"
async function playOption(conv, o) {
  var opt = o.a_option, s = store.get(conv.id);
  var mediaStatus = conv.arguments.get('MEDIA_STATUS');
  console.log('@playOption:', opt, mediaStatus, conv.id);
  if(s==null) return conv.ask('You have not played anything yet.');
  if(opt==='again') return playAudio(conv, s.current);
  if(opt==='related') s.list = s.related;
  return playList(conv);
};

// Intent "Play"
async function play(conv, o) {
  var {query, channel} = o;
  if(!isAudioSurface(conv)) return;
  console.log('@play:', `"${query}" by ${channel}`, conv.id);
  var list = audioSearch((await youtubeSearch(query)).videos, {channel});
  if(!list.length) return conv.close(`I could'nt find anything for "${query}".`);;
  store.set(conv.id, {list, current: null, related: []});
  return playList(conv);
};

// Intent "Stop"
async function stop(conv) {
  console.log('@stop:', conv.id);
  store.delete(conv.id);
  conv.close(conv.body.queryResult.fulfillmentText);
};

app.intent('Default Fallback Intent', defaultFallback);
app.intent('Default Welcome Intent', defaultWelcome);
app.intent('Play Option', playOption);
app.intent('Play Video', play);
app.intent('Play', play);
app.intent('Stop', stop);
module.exports = app;
