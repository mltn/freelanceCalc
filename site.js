const getNumberValue = element => {
	let val = element.value
		.replace('%', '')
		.replaceAll('.', '')
		.replace(',', '.');
	let num = Number(val);
	return Number.isNaN(num) ? 0 : num;
};
const format = (num) => {
	return num.toString()
		.replace('.', ',')
		.replace(/(,\d$)/, "$10")
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const formatDecimal = (num) => {
	return num.toFixed(2)
		.toString()
		.replace('.', ',')
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const threshold = 32000
const costEstimatePercentage = 0.5;
const pensionFundContributionPercentage = 0.255;
const healthcareFundContributionPercentage = 0.103;
const taxPercentage = 0.2;
const calcTaxable = income => {
	return income <= (threshold + income * costEstimatePercentage) ? 0 :
		(income - (income * costEstimatePercentage) - threshold);
};
const calcPensionFundContribution = taxableIncome =>
	taxableIncome * pensionFundContributionPercentage;
const calcHealthcareFundContribution = taxableIncome =>
	taxableIncome * healthcareFundContributionPercentage;
const calcTax = taxableIncome =>
	taxableIncome * taxPercentage;
const calcTotalForNotEmployed = taxableIncome =>
	calcPensionFundContribution(taxableIncome) +
	calcHealthcareFundContribution(taxableIncome) +
	calcTax(taxableIncome);
const calcTotalForEmployed = taxableIncome =>
	calcPensionFundContribution(taxableIncome) +
	calcTax(taxableIncome);
const calcPercentageForNotEmployed = income =>
	calcTotalForNotEmployed(calcTaxable(income)) * 100 / income;
const calcPercentageForEmployed = income =>
	calcTotalForEmployed(calcTaxable(income)) * 100 / income;

window.addEventListener('DOMContentLoaded', () => {
	const incomeElement = document.getElementById('income');
	const taxableIncomeElement = document.getElementById('taxable-income');

	const pensionFundContributionNotEmployedElement = document.getElementById('pension-fund-not-employed');
	const pensionFundContributionEmployedElement = document.getElementById('pension-fund-employed');
	const healthcareFundContributionNotEmployedElement = document.getElementById('healthcare-fund-not-employed');
	const healthcareFundContributionEmployedElement = document.getElementById('healthcare-fund-employed');
	const taxNotEmployedElement = document.getElementById('tax-not-employed');
	const taxEmployedElement = document.getElementById('tax-employed');

	const totalNotEmployedElement = document.getElementById('total-not-employed');
	const totalEmployedElement = document.getElementById('total-employed');
	const percentageNotEmployedElement = document.getElementById('percentage-not-employed');
	const percentageEmployedElement = document.getElementById('percentage-employed');
		
	const calcAndRender = () => {
		income = getNumberValue(incomeElement);
		incomeElement.value = formatDecimal(income);
		
		const taxableIncome = calcTaxable(income);
		taxableIncomeElement.innerText = formatDecimal(taxableIncome);
		
		pensionFundContributionNotEmployedElement.innerText = formatDecimal(calcPensionFundContribution(taxableIncome));
		pensionFundContributionEmployedElement.innerText = formatDecimal(calcPensionFundContribution(taxableIncome));
		healthcareFundContributionNotEmployedElement.innerText = formatDecimal(calcHealthcareFundContribution(taxableIncome));
		healthcareFundContributionEmployedElement.innerText = formatDecimal(0);
		taxNotEmployedElement.innerText = formatDecimal(calcTax(taxableIncome));
		taxEmployedElement.innerText = formatDecimal(calcTax(taxableIncome));
		
		totalNotEmployedElement.innerText = formatDecimal(calcTotalForNotEmployed(taxableIncome));
		totalEmployedElement.innerText = formatDecimal(calcTotalForEmployed(taxableIncome));
		
		percentageNotEmployedElement.innerText = formatDecimal(calcPercentageForNotEmployed(income)) + '%';
		percentageEmployedElement.innerText = formatDecimal(calcPercentageForEmployed(income)) + '%';
	};
	const updateState = event => {
		calcAndRender();
	};
	incomeElement.addEventListener('change', updateState)
	calcAndRender();
	
});