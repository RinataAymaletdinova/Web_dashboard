import Dashboard from './js/Dashboard.js';

console.log('Приложение запускается...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');
    
    try {
        const dashboard = new Dashboard();
        dashboard.init().catch(error => {
            console.error('Ошибка инициализации Dashboard:', error);
        });
    } catch (error) {
        console.error('Критическая ошибка:', error);
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>⚠️ Произошла ошибка</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()">Перезагрузить</button>
            </div>
        `;
    }
});

// Глобальная функция для отладки
window.debugDashboard = function() {
    console.log('Отладка Dashboard...');
    const widgets = document.querySelectorAll('.cell');
    console.log(`Всего виджетов: ${widgets.length}`);
    
    // Проверим все изображения
    const images = document.querySelectorAll('img');
    console.log(`Всего изображений: ${images.length}`);
    
    images.forEach((img, i) => {
        console.log(`Изображение ${i}:`, img.src);
    });
};