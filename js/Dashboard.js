import CatsWidget from './CatsWidget.js';
import DogsWidget from './DogsWidget.js';
import WeatherWidget from './WeatherWidget.js';

export default class Dashboard {
    constructor() {
        this.widgets = [];
        this.grid = null;
    }

    async init() {
        console.log('Dashboard инициализация...');
        this.grid = document.getElementById('widgets-grid');
        
        // Инициализация виджетов по умолчанию
        const dogsWidget = new DogsWidget();
        this.addWidget(new CatsWidget());
        this.addWidget(dogsWidget);
        this.addWidget(new WeatherWidget());
        
        // Загрузка данных для всех виджетов с задержкой для отладки
        setTimeout(() => {
            this.loadAllWidgets();
        }, 1000);
        
        // Настройка событий
        this.setupEvents();
    }

    addWidget(widget) {
        const element = widget.createElement();
        this.grid.appendChild(element);
        
        // Настройка обработчиков виджета
        widget.onRefresh(() => {
            console.log(`Обновляем ${widget.type}...`);
            widget.load();
        });
        
        widget.onRemove(() => this.removeWidget(widget));
        
        this.widgets.push(widget);
        return widget;
    }

    removeWidget(widget) {
        const index = this.widgets.indexOf(widget);
        if (index > -1) {
            widget.remove();
            this.widgets.splice(index, 1);
        }
    }

    async loadAllWidgets() {
        console.log('Загружаем все виджеты...');
        for (const widget of this.widgets) {
            console.log(`Загрузка: ${widget.type}`);
            await widget.load();
            // Небольшая задержка между запросами
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    setupEvents() {
        // Кнопка "Обновить все"
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('Обновляем все виджеты...');
                this.loadAllWidgets();
            });
        }
        
        // Здесь можно добавить кнопку для добавления новых виджетов
        this.addWidgetControls();
    }

    addWidgetControls() {
        const header = document.querySelector('header');
        
        // Проверяем, не добавлена ли уже кнопка
        if (document.getElementById('addWidgetBtn')) return;
        
        const addButton = document.createElement('button');
        addButton.id = 'addWidgetBtn';
        addButton.textContent = '+ Добавить виджет';
        addButton.style.marginLeft = '10px';
        
        addButton.addEventListener('click', () => {
            this.showWidgetSelector();
        });
        
        header.appendChild(addButton);
    }

    showWidgetSelector() {
        // Простая реализация для демонстрации
        const widgetType = prompt('Выберите виджет (cats/dogs/weather):');
        
        switch(widgetType?.toLowerCase()) {
            case 'cats':
                this.addWidget(new CatsWidget()).load();
                break;
            case 'dogs':
                this.addWidget(new DogsWidget()).load();
                break;
            case 'weather':
                this.addWidget(new WeatherWidget()).load();
                break;
            default:
                alert('Выберите один из вариантов: cats, dogs или weather');
        }
    }
}