import UIComponent from './UIComponent.js';

export default class CatsWidget extends UIComponent {
    constructor() {
        super('cats', 'Факты о котах', '🐱');
        // API который точно работает с GitHub Pages
        this.apiUrls = [
            'https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1',
            'https://meowfacts.herokuapp.com/',
            'https://cataas.com/cat?json=true' // API с картинками котов + факты
        ];
    }

    async load() {
        this.showLoading();
        
        try {
            // Пробуем первое API
            const response = await fetch(this.apiUrls[0]);
            const data = await response.json();
            
            if (data.text) {
                this.updateContent(`
                    <div class="cats-fact">
                        <p>${data.text}</p>
                    </div>
                `);
                return;
            }
            
            // Если первое не сработало, пробуем второе
            const response2 = await fetch(this.apiUrls[1]);
            const data2 = await response2.json();
            
            if (data2.data && data2.data[0]) {
                this.updateContent(`
                    <div class="cats-fact">
                        <p>${data2.data[0]}</p>
                    </div>
                `);
                return;
            }
            
            this.showError('Не удалось загрузить факт');
            
        } catch (error) {
            console.error('Cat API Error:', error);
            this.showError('Коты сейчас спят 🐾');
        }
    }

    retryLoad() {
        this.load();
    }
}
