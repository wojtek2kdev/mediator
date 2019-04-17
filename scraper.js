import $ from 'cheerio';
import { get } from 'axios';
import { flow } from 'lodash/fp';

const translationTypes = {
	"męski": "noun",
	"żeński": "noun",
	"nijaki": "noun",
	"czasownik": "verb",
	"przymiotnik": "adjective",
	"przyimek": "preposition",
	"zaimek": "pronoun",
	"przysłówek": "adverb",
	"wykrzyknik": "vocative",
	"spójnik": "conjunction",
};

const fetchTranslation = async ({from, to, word}) => {
	const baseURL = 'https://pl.bab.la/slownik';

	const {data} = await get(`https://pl.bab.la/slownik/${from}-${to}/${encodeURI(word)}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
		},
	});

	return data;
};

const extractType = (container) => 
	$('div>.result-block-header>h3>.suffix', container)
	.text()
	.replace(/{|}/g, '');

const extractWords = (container) => {
	const words = [];
	$('.sense-group>div>.dict-translation>.dict-result>a>strong', container)
		.each((i, word) => {
			word = $(word).text();
			words.push(word);
		}); 
	return words;
};

const extractSentences = (container) => {
	const sentences = [];
	
	$('.dict-example>.dict-result', container)
		.each((i, sentence) => {
			$('a', sentence).remove();
			sentences.push($(sentence).text().trim());
		});

	return sentences;
};

const extractSynonyms = (document) => {
	const synonyms = [];
	$('#synonyms > div > div.quick-result-entry > div.quick-result-overview > ul > li', document)
		.each((i, synonym) => {
			synonyms.push($(synonym).text().trim());
		});
	return synonyms;
};

const extractTranslations = (document) => {
	const result = {
		translations: {},
		synonyms: []
	};

	const translations = $('div[id^=translation]', document);

	if(translations.length){
		translations.each((index, container) => {
			const type = extractType(container);
			let words = extractWords(container);

			words = words.reduce((obj, word) => {
				const properties = {
					sentences: extractSentences(container),
				};
				obj[word] = properties;
				return obj;
			}, {});

			result.translations[translationTypes[type]] = words; 
		});	
	}

	const synonyms = extractSynonyms(document);

	result.synonyms = synonyms;

	return result;
};


const scraping = async (args) => {
	const document = await fetchTranslation(args);
	
	const translations = extractTranslations(document);

	console.log(translations);
};

(async() => {
	await scraping({
		from: 'angielski',
		to: 'polski',
		word: 'since',
	});
})();

