const citySelect = document.getElementById('citySelect');
const paperDate = document.getElementById('paperDate');
const paperTarget = document.getElementById('paperTarget');
const paperNumber = document.getElementById('paperNumber');
const epaper = {
	init: () => {
		console.log('Initializing');
		Date.prototype.toDateInputValue = (function () {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0, 10);
		});
		var option = '';
		fetch('./lib/data/data.json').then((resp) => resp.json())
			.then(function (data) {
				for (var key in data) {
					option = '';
					option += `<option value="${data[key].edition_code}">${key}</option>`;
					citySelect.insertAdjacentHTML('beforeend', option)
				}
			})
			.catch(function (err) {
				console.log(err)
			});
		paperDate.value = new Date().toDateInputValue();
		citySelect.addEventListener('change', e => {
			epaper.loadNews(paperNumber.value);
		});
		paperNumber.addEventListener('change', e => {
			epaper.loadNews(paperNumber.value);
		});
		paperDate.addEventListener('change', e => {
			epaper.loadNews(paperNumber.value);
		});
		document.addEventListener("keypress", function onPress(event) {
			if(event.key === '+'){
				paperTarget.style.width = '150%'
			}
			if(event.key === '-'){
				paperTarget.style.width = '100%'
			}
		});
		epaper.loadNews(paperNumber.value);
	},
	loadNews: page => {
		if (page < 10)
			page = '0' + page;
		var currentDate = paperDate.value.replace(/[-]/g, '/');
		var url = 'https://epaperwmimg.amarujala.com/{{date}}/{{cityCode}}/{{page}}/hdimage.jpg';
		var src = url.replace(/{{date}}/g, currentDate)
			.replace(/{{cityCode}}/g, citySelect.value)
			.replace(/{{page}}/g, page);
		paperTarget.src = src;
	}
}
window.addEventListener('DOMContentLoaded', e => {
	epaper.init();
});