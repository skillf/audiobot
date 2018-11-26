const message = require('./message');

function status(sta) {
  var z = '';
  if(sta.includes('a')) z += 'Australia, New Zealand, ';
  if(sta.includes('e')) z += 'Europian Union, ';
  if(sta.includes('u')) z += 'United States, ';
  return z.replace(/,\s*$/, '').replace(/,\s*([^,]+?)$/, ', and $1');
};

function query(key, tags) {
  var i = null, e = null;
  if(!tags || !tags.length) return message('none');
  if(i==null && e==null) return message('none');
  var obj = Object.assign({}, e, i);
  obj.code = `${i? 'I.N.S. '+i.code:''}${i && e? ' or ':''}${e? e.code:''}`;
  obj.status = status(obj.status);
  var sta = obj.status? 'yes':'no';
  if(key.endsWith('code')) return message('code', obj);
  if(key.endsWith('name')) return message('name', obj);
  if(key.endsWith('type')) return message('type', obj);
  if(key.endsWith('status')) return message('status_'+sta, obj);
  return message('any_'+sta, obj);
};
module.exports = query;
