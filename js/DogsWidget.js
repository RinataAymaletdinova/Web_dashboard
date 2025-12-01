import UIComponent from './UIComponent.js';

export default class DogsWidget extends UIComponent {
    constructor() {
        super('dogs', 'Случайные собаки', '🐶');
        this.apiUrl = 'https://random.dog/woof.json';
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
            
            // Проверяем что это изображение, а не видео
            if (data.url) {
                const fileExtension = data.url.split('.').pop().toLowerCase();
                const isVideo = ['mp4', 'webm', 'avi', 'mov'].includes(fileExtension);
                
                if (isVideo) {
                    this.showError('API вернул видео вместо изображения');
                } else {
                    this.updateContent(`
                        <div class="dog-image">
                            <img src="${data.url}" 
                                 alt="Случайная собака" 
                                 class="dog-img">
                        </div>
                    `);
                }
            } else {
                this.showError('API не вернул изображение');
            }
            
        } catch (error) {
            this.showError(`Не удалось загрузить собаку: ${error.message}`);
        }
    }

    retryLoad() {
        this.load();
    }
}