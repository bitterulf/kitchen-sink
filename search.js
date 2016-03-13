var lunr = require('lunr');

var idx = lunr(function () {
  this.field('title', { boost: 10 });
  this.field('body');
});

var doc = {
  "title": "Twelfth-Night",
  "body": "If music be the food of love, play on: Give me excess of it…",
  "author": "William Shakespeare",
  "id": 1
};

idx.add(doc);

var result = idx.search("love");

console.log(result);
