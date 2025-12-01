import UIComponent from './UIComponent.js';

export default class CatsWidget extends UIComponent {
    constructor() {
        super('cats', 'Факты о котах', '🐱');
        this.apiUrl = 'https://catfact.ninja/fact';
    }

    async load() {
        this.showLoading();
        
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            
            this.updateContent(`
                <div class="cats-fact">
                    <p>${data.fact}</p>
                </div>
            `);
        } catch (error) {
            this.showError('Коты сейчас спят, попробуй позже');
        }
    }
}