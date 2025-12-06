import UIComponent from './UIComponent.js';

export default class CatsWidget extends UIComponent {
    constructor() {
        super('cats', 'Факты о котах', '🐱');
        this.apiUrl = 'https://meowfacts.herokuapp.com/';
    }

    async load() {
        this.showLoading();
        
        try {
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // API meowfacts возвращает {data: ["факт"]}
            if (data.data && data.data.length > 0) {
                this.updateContent(`
                    <div class="cats-fact">
                        <p>${data.data[0]}</p>
                    </div>
                `);
            } else {
                this.showError('API не вернул факт');
            }
            
        } catch (error) {
            this.showError(`Не удалось загрузить факт о котах: ${error.message}`);
        }
    }

    retryLoad() {
        this.load();
    }
}
