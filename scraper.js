import $ from 'cheerio';
import { get } from 'axios';
import { flow } from 'lodash/fp';

const fetchTranslation = async ({from, to, args}) => {
	const baseURL = 'https://pl.bab.la/slownik';

	const {data} = await get(`https://pl.bab.la/slownik/${from}-${to}/${word}`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
		},
	});

	return data;
}; 

const extractTranslations = (document) => {
	const result = {};

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

	

};
