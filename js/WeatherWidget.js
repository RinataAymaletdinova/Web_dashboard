import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
    constructor() {
        super('weather', 'Погода', '🌤️');
        this.cities = [
            { name: 'Москва', coords: '55.7558,37.6173' },
            { name: 'Санкт-Петербург', coords: '59.9343,30.3351' },
            { name: 'Омск', coords: '54.9924,73.3686' }
        ];
        this.selectedCity = this.cities[0];
    }

    createElement() {
        const element = super.createElement();
        
        // Переопределяем заголовок с селектором
        const header = element.querySelector('.cell-header');
        header.innerHTML = `
            <h3>${this.icon} ${this.title}</h3>
            <div class="cell-controls">
                <select class="city-select" data-type="${this.type}">
                    ${this.cities.map(city => 
                        `<option value="${city.coords}">${city.name}</option>`
                    ).join('')}
                </select>
                <button class="refresh-btn" data-type="${this.type}">🔄</button>
                <button class="remove-btn" data-type="${this.type}">❌</button>
            </div>
        `;
        
        // Добавляем обработчик выбора города
        const select = element.querySelector('.city-select');
        select.addEventListener('change', (e) => {
            const coords = e.target.value;
            const city = this.cities.find(c => c.coords === coords);
            if (city) {
                this.selectedCity = city;
                this.load();
            }
        });
        
        return element;
    }

    async load() {
        this.showLoading();
        
        try {
            const [lat, lon] = this.selectedCity.coords.split(',');
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            const data = await response.json();
            
            if (data.current_weather) {
                this.updateContent(`
                    <div class="weather-info">
                        <div class="weather-temp">${data.current_weather.temperature}°C</div>
                        <div class="weather-city">${this.selectedCity.name}</div>
                    </div>
                `);
            } else {
                this.showError('Ошибка загрузки погоды');
            }
        } catch (error) {
            this.showError('Ошибка соединения с сервером погоды');
        }
    }
}