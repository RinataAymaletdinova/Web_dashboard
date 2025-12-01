export default class UIComponent {
    constructor(type, title, icon = '📊') {
        this.type = type;
        this.title = title;
        this.icon = icon;
        this.id = `widget-${type}-${Date.now()}`;
        this.element = null;
        this.isLoading = false;
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'cell';
        element.id = this.id;
        
        element.innerHTML = `
            <div class="cell-header">
                <h3>${this.icon} ${this.title}</h3>
                <div class="cell-controls">
                    <button class="refresh-btn" data-type="${this.type}">🔄</button>
                    <button class="remove-btn" data-type="${this.type}">❌</button>
                </div>
            </div>
            <div class="cell-content" id="content-${this.type}">
                <div class="loading">
                    <div class="spinner"></div>
                    <div class="loading-text">Загрузка...</div>
                </div>
            </div>
        `;
        
        this.element = element;
        return element;
    }

    showLoading() {
        const content = this.element.querySelector(`#content-${this.type}`);
        if (content) {
            content.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <div class="loading-text">Загрузка...</div>
                </div>
            `;
            this.isLoading = true;
        }
    }

    showError(message = 'Ошибка загрузки') {
        const content = this.element.querySelector(`#content-${this.type}`);
        if (content) {
            content.innerHTML = `
                <div class="error">
                    <p>⚠️ ${message}</p>
                    <button class="retry-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 12px;">
                        Попробовать снова
                    </button>
                </div>
            `;
            
            // Добавляем кнопку повторной попытки
            const retryBtn = content.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.retryLoad());
            }
            
            this.isLoading = false;
        }
    }

    updateContent(html) {
        const content = this.element.querySelector(`#content-${this.type}`);
        if (content) {
            content.innerHTML = html;
            this.isLoading = false;
        }
    }

    retryLoad() {
        // Этот метод должен быть переопределен в дочерних классах
        console.log('Повторная попытка загрузки...');
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    onRefresh(callback) {
        const refreshBtn = this.element.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', callback);
        }
    }

    onRemove(callback) {
        const removeBtn = this.element.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', callback);
        }
    }
}