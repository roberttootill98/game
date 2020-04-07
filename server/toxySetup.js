const toxy = require('toxy');
const config = require('./config');

const proxyPort = 3000;
const url = "http://127.0.0.1";

const proxy = toxy();
const rules = toxy.rules;
const poisons = toxy.poisons;

proxy
  .forward(url)
  .poison(poisons.bandwidth({ bps: config.testConfig.bandwidth }))
  .withRule(rules.method('GET'))
  .withRule(rules.probability(100))

// currently on all urls
proxy.all('/*');

proxy.listen(proxyPort);
console.log('Toxy proxy listening on port:', proxyPort);
