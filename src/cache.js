const redis = require('redis');
const rejson = require('redis-rejson');

rejson(redis);

const client = redis.createClient({
	host: 'redis',
	port: 6379,
});

client.json_set('pl_jak', '.', JSON.stringify({
	lang: "en",
	words: {
		noun: ['yak'],
		adverb: ['how', 'as']
	},
}));

