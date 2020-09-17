const citySelect = document.getElementById('citySelect');
const paperDate = document.getElementById('paperDate');
const paperTarget = document.getElementById('paperTarget');
const paperNumber = document.getElementById('paperNumber');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
var my = ''
const epaper = {
	init: () => {
		Date.prototype.toDateInputValue = (function () {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0, 10);
		});
		
		next.addEventListener('click',e=>{
			paperNumber.value = parseInt(paperNumber.value) - 1;
			epaper.loadNews(paperNumber.value);
		})
		prev.addEventListener('click',e=>{
			paperNumber.value = parseInt(paperNumber.value) + 1;
			epaper.loadNews(paperNumber.value);
		})
		mycity.addEventListener('click',e=>{
			if(my == '')
				my='/my'
			else
				my=''
			paperNumber.value = 1;
			epaper.loadNews(paperNumber.value);
		})
		var option = '';
		fetch('./lib/data/data.json').then((resp) => resp.json())
			.then(function (data) {
				for (var key in data) {
					option = '';
					option += `<option value="${data[key].edition_code}">${key}</option>`;
					citySelect.insertAdjacentHTML('beforeend', option)
				}
			})
			.then(() => {
				var history = localStorage.getItem('citySelect');
				if (history !== null && history !== "") {
					citySelect.value = history;
					epaper.loadNews(paperNumber.value);
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
			if (event.key === '+') {
				paperTarget.style.width = '150%'
			}
			if (event.key === '-') {
				paperTarget.style.width = '100%'
			}
		});
	},
	loadNews: page => {
		localStorage.setItem('citySelect', citySelect.value);
		if (page < 10)
			page = '0' + page;
		var currentDate = paperDate.value.replace(/[-]/g, '/');
		var url = 'https://epaperwmimg.amarujala.com/{{date}}{{my}}/{{cityCode}}/{{page}}/hdimage.jpg';
		var src = url.replace(/{{date}}/g, currentDate)
			.replace(/{{cityCode}}/g, citySelect.value)
			.replace(/{{my}}/g, my)
			.replace(/{{page}}/g, page);
		paperTarget.src = src;
	}
}
window.addEventListener('DOMContentLoaded', e => {
	epaper.init();
});