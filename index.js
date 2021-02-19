const axios = require('axios');
const cheerio = require('cheerio');

const incomes = [
	{
		currency: 'EUR',
		summ: 400,
		date: '2020-03-30',
	},
	{
		currency: 'EUR',
		summ: 500,
		date: '2020-02-20',
	},
	{
		currency: 'EUR',
		summ: 458,
		date: '2020-01-31',
	},
];

const roundToDecimal = num => {
	return Math.round(num * 100) / 100;
};

const tax5percentReport = async accountData => {
	const getHtml = async url => {
		const { data } = await axios.get(url);
		return cheerio.load(data);
	};

	const report = {};
	const totalEarnedUAH = [];

	report.rawData = accountData;
	report.totalEarned = roundToDecimal(accountData.map(e => e.summ).reduce((acc, cur) => acc + cur));
	for (let i = 0; i < accountData.length; i++) {
		const selector = await getHtml(
			`https://minfin.com.ua/currency/nbu/${accountData[i].currency}/${accountData[i].date}`
		);
		let currencyOnDate = selector('[data-title="Курс НБУ"]').text().split('\n')[1];
		let summInUAH = accountData[i].summ * currencyOnDate;
		totalEarnedUAH.push(summInUAH);
	}
	report.totalEarnedUAH = roundToDecimal(totalEarnedUAH.reduce((acc, cur) => acc + cur));
	report.tax5percent = roundToDecimal(report.totalEarnedUAH * 0.05);

	console.log('Your tax report: ', report);
};

tax5percentReport(incomes);
