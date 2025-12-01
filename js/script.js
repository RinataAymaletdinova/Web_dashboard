class SimpleAPI {
    async getCatsFact() {
        try {
            const response = await fetch('https://catfact.ninja/fact');
            const data = await response.json();
            return data.fact;
        } catch (error) {
            return 'Коты сейчас спят, попробуй позже';
        }
    }

    async getDogImage() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            return data.message;
        } catch (error) {
            return 'error';
        }
    }

    async getWeather(cityCoords) {
        try {
            const [lat, lon] = cityCoords.split(',');
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await response.json();
            
            const citySelect = document.getElementById('citySelect');
            const cityName = citySelect.options[citySelect.selectedIndex].text;
            
            return {
                temperature: data.current_weather.temperature,
                city: cityName
            };
        } catch (error) {
            return { error: 'Ошибка загрузки погоды' };
        }
    }
}

// Показываем загрузку
function showLoading(type) {
    const element = document.getElementById(`content-${type}`);
    if (element) {
        element.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <div class="loading-text">Загрузка...</div>
            </div>
        `;
    }
}

// Загружаем все данные
async function loadAllData() {
    await loadCatsData();
    await loadDogsData();
    await loadWeatherData();
}

// Загружаем данные котов
async function loadCatsData() {
    showLoading('cats');
    const api = new SimpleAPI();
    const element = document.getElementById('content-cats');
    
    try {
        const data = await api.getCatsFact();
        if (element) element.textContent = data;
    } catch (error) {
        if (element) element.textContent = 'Ошибка загрузки';
    }
}

// Загружаем данные собак
async function loadDogsData() {
    showLoading('dogs');
    const api = new SimpleAPI();
    const element = document.getElementById('content-dogs');
    
    try {
        const data = await api.getDogImage();
        if (element) {
            if (data !== 'error') {
                element.innerHTML = `<img src="${data}" alt="Случайная собака">`;
            } else {
                element.textContent = 'Собаки убежали гулять';
            }
        }
    } catch (error) {
        if (element) element.textContent = 'Ошибка загрузки';
    }
}

// Загружаем данные погоды
async function loadWeatherData() {
    showLoading('weather');
    const api = new SimpleAPI();
    const element = document.getElementById('content-weather');
    const citySelect = document.getElementById('citySelect');
    
    try {
        const selectedCity = citySelect.value;
        const data = await api.getWeather(selectedCity);
        
        if (element) {
            if (data.error) {
                element.textContent = data.error;
            } else {
                element.innerHTML = `
                    <div class="weather-info">
                        <div class="weather-temp">${data.temperature}°C</div>
                        <div class="weather-city">${data.city}</div>
                    </div>
                `;
            }
        }
    } catch (error) {
        if (element) element.textContent = 'Ошибка загрузки';
    }
}

// Удаляем ячейку
function removeCell(type) {
    const cell = document.getElementById(`cell-${type}`);
    if (cell) {
        cell.remove();
    }
}

// Настройка событий
function setupEvents() {
    // Обновить все
    document.getElementById('refreshBtn').addEventListener('click', loadAllData);
    
    // Выбор города
    document.getElementById('citySelect').addEventListener('change', loadWeatherData);
    
    // Кнопки обновления
    document.querySelectorAll('.refresh-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            if (type === 'cats') loadCatsData();
            if (type === 'dogs') loadDogsData();
            if (type === 'weather') loadWeatherData();
        });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            removeCell(type);
        });
    });
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    loadAllData();
});