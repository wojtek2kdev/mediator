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

const extractTranslations = (document) => {
	const result = {
		translations: {},
	};

	const translations = $('div[id^=translation]', document);

	if(translations.length){
		translations.each((index, element) => {
			const type = $('div>.result-block-header>h3>.suffix' ,element).text().replace(/{|}/g, '');
			const words = [];
			$('.sense-group>div>.dict-translation>.dict-result>a>strong', element).each((i, word) => {
				word = $(word).text();
				words.push(word);
			}); 
			result.translations[translationTypes[type]] = words; 
		});	
	}

	return {
		document,
		result
	}
};

const extractSentences = ({document, result}) => {

	return {
		document, result
	}
};

const extractSynonyms = ({document, result}) => {

};

const scraping = async (args) => {
	const document = await fetchTranslation(args);
	
	const { result } = extractTranslations(document);

	console.log(result);
};

(async() => {
	await scraping({
		from: 'polski',
		to: 'angielski',
		word: 'zwierzątko',
	});
})();

