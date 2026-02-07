// Estado de la aplicación
const state = {
    games: gamesData,
    filteredGames: [...gamesData],
    searchQuery: '',
    filters: {
        difficulty: [],
        age: [],
        players: [],
        duration: [],
        type: [],
        categories: []
    },
    sort: {
        field: 'title',
        direction: 'asc'
    },
    theme: localStorage.getItem('theme') || 'light',
    currentModalIndex: -1
};

// Iconos para categorías
const categoryIcons = {
    'Estrategia': '🎯',
    'Gestión': '📊',
    'Negociación': '🤝',
    'Construcción': '🏗️',
    'Colocación': '📍',
    'Familiar': '👨‍👩‍👧‍👦',
    'Táctico': '⚔️',
    'Cartas': '🃏',
    'Party': '🎉',
    'Humor': '😄',
    'Rápido': '⚡',
    'Creatividad': '✨',
    'Puzle': '🧩',
    'Dados': '🎲',
    'Abstracto': '🔷',
    'Draft': '📝',
    'Deck-building': '📚',
    'Fantasía': '🐉',
    'Combate': '⚔️',
    'Cooperativo': '🤝',
    'Lógica': '🧠',
    'Tiempo real': '⏱️',
    'Habilidad': '🎪',
    'Reflejos': '⚡',
    'Percepción': '👁️',
    'Palabras': '💬',
    'Dominó': '🎴',
    'Deducción': '🔍',
    'Misterio': '🔮',
    'Roles ocultos': '🎭',
    'Faroleo': '😏',
    'Cine': '🎬',
    'Habilidad física': '💪',
    'Destreza': '🎯',
    'Equilibrio': '⚖️',
    'Clásico': '♟️',
    'Apuestas': '💰',
    'Tradicional': '📜',
    'Números': '🔢',
    'Control de área': '🗺️',
    '3D': '🎲',
    'Interacción': '🔄',
    'Colocación de piezas': '📍'
};

// Función para obtener emoji de dificultad
function getDifficultyEmoji(level) {
    const emojis = ['🌱', '🌿', '🍂', '🌶️', '🔥'];
    return emojis[level - 1] || '🎲';
}

// Configuración de filtros
const filterConfig = {
    difficulty: [
        { value: 'Muy Baja (1/5)', level: 1, label: 'Muy Baja (1/5)' },
        { value: 'Baja (2/5)', level: 2, label: 'Baja (2/5)' },
        { value: 'Media (3/5)', level: 3, label: 'Media (3/5)' },
        { value: 'Alta (4/5)', level: 4, label: 'Alta (4/5)' }
    ],
    age: [
        { value: '6', label: '6+' },
        { value: '7', label: '7+' },
        { value: '8', label: '8+' },
        { value: '9', label: '9+' },
        { value: '10', label: '10+' },
        { value: '12', label: '12+' },
        { value: '13', label: '13+' },
        { value: '14', label: '14+' },
        { value: '18', label: '18+' }
    ],
    players: [
        { value: '1', label: '1 jugador' },
        { value: '2', label: '2 jugadores' },
        { value: '3', label: '3 jugadores' },
        { value: '4', label: '4 jugadores' },
        { value: '5+', label: '5+ jugadores' }
    ],
    duration: [
        { value: '15', label: '< 15 min' },
        { value: '20', label: '< 20 min' },
        { value: '30', label: '< 30 min' },
        { value: '45', label: '< 45 min' },
        { value: '60', label: '< 60 min' },
        { value: '90', label: '< 90 min' },
        { value: '120', label: '< 120 min' }
    ],
    type: [
        { value: 'competitive', label: '⚔️ Competitivo' },
        { value: 'cooperative', label: '🤝 Cooperativo' }
    ]
};

// Obtener todas las categorías únicas y contar juegos por categoría
function getCategoriesWithCount() {
    const categoryCount = {};
    gamesData.forEach(game => {
        game.categories.forEach(cat => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
    });
    
    // Solo categorías con 2+ juegos, ordenadas por cantidad
    return Object.entries(categoryCount)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, _]) => cat);
}

const allCategories = getCategoriesWithCount();

// Inicialización
function init() {
    applyTheme();
    setCurrentYear();
    renderFilterChips();
    renderGames();
    setupEventListeners();
    updateResultsCount();
}

// Aplicar tema
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

// Establecer año actual
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Renderizar chips de filtros
function renderFilterChips() {
    // Dificultad
    const difficultyContainer = document.getElementById('difficulty-filters');
    difficultyContainer.innerHTML = filterConfig.difficulty.map(d => 
        `<button class="filter-chip" data-filter="difficulty" data-value="${d.value}">
            ${d.label}
        </button>`
    ).join('');

    // Edad
    const ageContainer = document.getElementById('age-filters');
    ageContainer.innerHTML = filterConfig.age.map(a => 
        `<button class="filter-chip" data-filter="age" data-value="${a.value}">${a.label}</button>`
    ).join('');

    // Jugadores
    const playersContainer = document.getElementById('players-filters');
    playersContainer.innerHTML = filterConfig.players.map(p => 
        `<button class="filter-chip" data-filter="players" data-value="${p.value}">${p.label}</button>`
    ).join('');

    // Duración
    const durationContainer = document.getElementById('duration-filters');
    durationContainer.innerHTML = filterConfig.duration.map(d => 
        `<button class="filter-chip" data-filter="duration" data-value="${d.value}">${d.label}</button>`
    ).join('');

    // Tipo
    const typeContainer = document.getElementById('type-filters');
    typeContainer.innerHTML = filterConfig.type.map(t => 
        `<button class="filter-chip" data-filter="type" data-value="${t.value}">${t.label}</button>`
    ).join('');

    // Categorías con iconos
    const categoryContainer = document.getElementById('category-filters');
    categoryContainer.innerHTML = allCategories.map(cat => {
        const icon = categoryIcons[cat] || '🎲';
        return `<button class="filter-chip" data-filter="categories" data-value="${cat}">${icon} ${cat}</button>`;
    }).join('');
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Búsqueda
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Toggle filtros (desktop)
    document.getElementById('filter-toggle').addEventListener('click', toggleFiltersPanel);

    // Toggle ordenación (desktop)
    document.getElementById('sort-toggle').addEventListener('click', toggleSortPanel);

    // FAB (móvil)
    document.getElementById('fab-filter').addEventListener('click', (e) => {
        e.stopPropagation();
        const filtersPanel = document.getElementById('filters-panel');
        const sortPanel = document.getElementById('sort-panel');
        
        if (sortPanel.classList.contains('open')) {
            sortPanel.classList.remove('open');
        }
        
        filtersPanel.classList.toggle('open');
        
        // Scroll suave a los filtros
        if (filtersPanel.classList.contains('open')) {
            setTimeout(() => {
                filtersPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    });

    // Filtros
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', handleFilterClick);
    });

    // Limpiar filtros
    document.getElementById('clear-filters').addEventListener('click', clearFilters);

    // Cerrar panel de filtros
    document.getElementById('filters-close').addEventListener('click', () => {
        document.getElementById('filters-panel').classList.remove('open');
        document.getElementById('filter-toggle').classList.remove('active');
    });

    // Ordenación
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', handleSort);
    });

    // Dirección de ordenación
    document.getElementById('sort-direction').addEventListener('click', toggleSortDirection);

    // Cerrar modal
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-overlay')) closeModal();
    });

    // Navegación del modal
    document.getElementById('modal-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(-1);
    });
    document.getElementById('modal-next').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateModal(1);
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft' && state.currentModalIndex >= 0) navigateModal(-1);
        if (e.key === 'ArrowRight' && state.currentModalIndex >= 0) navigateModal(1);
    });

    // Cerrar paneles al hacer clic fuera
    document.addEventListener('click', (e) => {
        const controlsSection = document.getElementById('controls-section');
        const filtersPanel = document.getElementById('filters-panel');
        const sortPanel = document.getElementById('sort-panel');
        const fab = document.getElementById('fab-filter');
        
        // Verificar si el clic fue fuera de los controles y fuera del FAB (incluyendo hijos)
        const isOutsideControls = !controlsSection.contains(e.target);
        const isOutsideFab = !fab.contains(e.target);
        
        if (isOutsideControls && isOutsideFab) {
            filtersPanel.classList.remove('open');
            sortPanel.classList.remove('open');
            document.getElementById('filter-toggle').classList.remove('active');
            document.getElementById('sort-toggle').classList.remove('active');
        }
    });
}

function toggleFiltersPanel() {
    const filtersPanel = document.getElementById('filters-panel');
    const sortPanel = document.getElementById('sort-panel');
    const filterToggle = document.getElementById('filter-toggle');
    
    filtersPanel.classList.toggle('open');
    sortPanel.classList.remove('open');
    filterToggle.classList.toggle('active');
    document.getElementById('sort-toggle').classList.remove('active');
}

function toggleSortPanel() {
    const filtersPanel = document.getElementById('filters-panel');
    const sortPanel = document.getElementById('sort-panel');
    const sortToggle = document.getElementById('sort-toggle');
    
    sortPanel.classList.toggle('open');
    filtersPanel.classList.remove('open');
    sortToggle.classList.toggle('active');
    document.getElementById('filter-toggle').classList.remove('active');
}

// Toggle tema
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    applyTheme();
}

// Manejar búsqueda
function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase();
    applyFiltersAndSort();
}

// Manejar click en filtros
function handleFilterClick(e) {
    const filterType = e.target.dataset.filter;
    const value = e.target.dataset.value;

    if (state.filters[filterType].includes(value)) {
        state.filters[filterType] = state.filters[filterType].filter(v => v !== value);
        e.target.classList.remove('active');
    } else {
        state.filters[filterType].push(value);
        e.target.classList.add('active');
    }

    applyFiltersAndSort();
}

// Limpiar filtros
function clearFilters() {
    state.filters = {
        difficulty: [],
        age: [],
        players: [],
        duration: [],
        type: [],
        categories: []
    };
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });

    applyFiltersAndSort();
}

// Manejar ordenación
function handleSort(e) {
    const field = e.target.dataset.sort;
    state.sort.field = field;

    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    applyFiltersAndSort();
}

// Toggle dirección de ordenación
function toggleSortDirection() {
    state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
    document.getElementById('sort-asc').style.display = state.sort.direction === 'asc' ? 'block' : 'none';
    document.getElementById('sort-desc').style.display = state.sort.direction === 'desc' ? 'block' : 'none';
    applyFiltersAndSort();
}

// Aplicar filtros y ordenación
function applyFiltersAndSort() {
    let result = [...state.games];

    // Aplicar búsqueda
    if (state.searchQuery) {
        result = result.filter(game => 
            game.title.toLowerCase().includes(state.searchQuery) ||
            game.synopsis.toLowerCase().includes(state.searchQuery) ||
            game.categories.some(c => c.toLowerCase().includes(state.searchQuery))
        );
    }

    // Aplicar filtros de dificultad
    if (state.filters.difficulty.length > 0) {
        result = result.filter(game => state.filters.difficulty.includes(game.difficulty));
    }

    // Aplicar filtros de edad
    if (state.filters.age.length > 0) {
        result = result.filter(game => {
            return state.filters.age.some(age => game.minAge >= parseInt(age));
        });
    }

    // Aplicar filtros de jugadores
    if (state.filters.players.length > 0) {
        result = result.filter(game => {
            return state.filters.players.some(playerFilter => {
                const value = playerFilter.value || playerFilter;
                if (value === '5+') {
                    return game.playersMax >= 5;
                }
                const numPlayers = parseInt(value);
                return game.playersMin <= numPlayers && game.playersMax >= numPlayers;
            });
        });
    }

    // Aplicar filtros de duración
    if (state.filters.duration.length > 0) {
        result = result.filter(game => {
            return state.filters.duration.some(d => {
                const maxDuration = parseInt(d);
                return game.durationMinutes <= maxDuration;
            });
        });
    }

    // Aplicar filtros de tipo
    if (state.filters.type.length > 0) {
        result = result.filter(game => {
            return state.filters.type.some(type => {
                if (type === 'competitive') return game.competitive;
                if (type === 'cooperative') return !game.competitive;
            });
        });
    }

    // Aplicar filtros de categorías
    if (state.filters.categories.length > 0) {
        result = result.filter(game => 
            state.filters.categories.every(cat => game.categories.includes(cat))
        );
    }

    // Aplicar ordenación
    result.sort((a, b) => {
        let valA, valB;
        
        switch (state.sort.field) {
            case 'title':
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
                break;
            case 'difficulty':
                valA = a.difficultyLevel;
                valB = b.difficultyLevel;
                break;
            case 'age':
                valA = a.minAge;
                valB = b.minAge;
                break;
            case 'playersMin':
                valA = a.playersMin;
                valB = b.playersMin;
                break;
            case 'playersMax':
                valA = a.playersMax;
                valB = b.playersMax;
                break;
            case 'duration':
                valA = a.durationMinutes;
                valB = b.durationMinutes;
                break;
            default:
                valA = a.title;
                valB = b.title;
        }

        if (valA < valB) return state.sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return state.sort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    state.filteredGames = result;
    renderGames();
    updateResultsCount();
}

// Renderizar juegos
function renderGames() {
    const grid = document.getElementById('games-grid');
    
    if (state.filteredGames.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🔍</p>
                <p>No se encontraron juegos con los filtros seleccionados.</p>
                <button onclick="window.clearAllFilters()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, var(--accent-cool) 0%, var(--accent-blue) 100%); color: white; border: none; border-radius: 25px; cursor: pointer; font-family: inherit; font-weight: 600; box-shadow: 0 4px 15px rgba(129, 178, 154, 0.4);">Limpiar filtros</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = state.filteredGames.map(game => `
        <article class="game-card" onclick="openModal('${game.title}')">
            <div class="game-image-container">
                <img src="${game.coverImage}" alt="${game.title}" class="game-image" 
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="game-image-placeholder" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 4rem; background: linear-gradient(135deg, var(--accent-cool) 0%, var(--accent-blue) 100%); color: white;">
                    🎲
                </div>
            </div>
            <div class="game-info">
                <h2 class="game-title">${game.title}</h2>
                <div class="game-meta">
                    <span>${game.difficulty} ${getDifficultyEmoji(game.difficultyLevel)}</span>
                    <span>${game.playersMin}-${game.playersMax} 👤</span>
                    <span>${game.duration}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Función global para limpiar filtros desde el botón del mensaje vacío
window.clearAllFilters = function() {
    clearFilters();
};

// Actualizar contador de resultados
function updateResultsCount() {
    const count = state.filteredGames.length;
    document.getElementById('results-count').textContent = 
        count === 1 ? '1 juego encontrado' : `${count} juegos encontrados`;
}

// Abrir modal
function openModal(gameTitle) {
    const game = state.games.find(g => g.title === gameTitle);
    if (!game) return;

    // Guardar el índice del juego actual
    state.currentModalIndex = state.filteredGames.findIndex(g => g.title === gameTitle);
    updateModalNavButtons();

    const modalContent = document.getElementById('modal-content');
    
    // Preparar categorías con iconos
    const categoriesWithIcons = game.categories.map(cat => {
        const icon = categoryIcons[cat] || '🎲';
        return { name: cat, icon };
    });
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-image-container">
                <img src="${game.coverImage}" alt="${game.title}" class="modal-image" 
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;font-size:5rem;background:linear-gradient(135deg,var(--accent-cool) 0%,var(--accent-blue) 100%);color:white;\'>🎲</div>';">
            </div>
            <div class="modal-info">
                <h2 class="modal-title">${game.title}</h2>
                <p class="modal-synopsis">${game.synopsis}</p>
                <div class="modal-tags">
                    <span class="modal-tag">${game.difficulty} ${getDifficultyEmoji(game.difficultyLevel)}</span>
                    <span class="modal-tag">${game.competitive ? '⚔️ Competitivo' : '🤝 Cooperativo'}</span>
                    ${categoriesWithIcons.slice(0, 3).map(cat => `<span class="modal-tag category">${cat.icon} ${cat.name}</span>`).join('')}
                </div>
                <div class="modal-details">
                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Duración</div>
                            <div class="detail-value">${game.duration}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Jugadores</div>
                            <div class="detail-value">${game.playersMin}-${game.playersMax} jugadores</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                            <path d="M4 22h16"/>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                        </svg>
                        <div class="detail-content">
                            <div class="detail-label">Edad mínima</div>
                            <div class="detail-value">${game.minAge}+ años</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Cómo se juega
            </h3>
            <p>${game.summary}</p>
        </div>
        
        <div class="modal-section">
            <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
                Habilidades que desarrolla
            </h3>
            <p>${game.development}</p>
        </div>
        
        <div class="modal-section">
            <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Categorías
            </h3>
            <div class="modal-tags">
                ${categoriesWithIcons.map(cat => `<span class="modal-tag category">${cat.icon} ${cat.name}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-links">
            <a href="${game.videoUrl}" target="_blank" rel="noopener noreferrer" class="modal-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m22 8-6 4 6 4V8Z"/>
                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
                Ver video tutorial
            </a>
        </div>
    `;

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Navegar entre juegos en el modal
function navigateModal(direction) {
    const newIndex = state.currentModalIndex + direction;
    
    // Verificar límites
    if (newIndex < 0 || newIndex >= state.filteredGames.length) return;
    
    // Actualizar índice y abrir el nuevo juego
    state.currentModalIndex = newIndex;
    const game = state.filteredGames[newIndex];
    
    // Animación de transición
    const modalContent = document.getElementById('modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateX(' + (direction * -20) + 'px)';
    
    setTimeout(() => {
        openModal(game.title);
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateX(0)';
    }, 200);
}

// Actualizar estado de los botones de navegación
function updateModalNavButtons() {
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    
    if (prevBtn && nextBtn) {
        prevBtn.style.opacity = state.currentModalIndex <= 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = state.currentModalIndex <= 0 ? 'none' : 'auto';
        
        nextBtn.style.opacity = state.currentModalIndex >= state.filteredGames.length - 1 ? '0.3' : '1';
        nextBtn.style.pointerEvents = state.currentModalIndex >= state.filteredGames.length - 1 ? 'none' : 'auto';
    }
}

// Cerrar modal
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    state.currentModalIndex = -1;
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);