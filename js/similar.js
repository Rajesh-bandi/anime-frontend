
// API Configuration
const API_BASE_URL = 'https://api.jikan.moe/v4';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const trendingAnime = document.getElementById('trendingAnime');
const newReleases = document.getElementById('newReleases');
const ongoingAnime = document.getElementById('ongoingAnime');

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fetch anime data
async function fetchAnimeData(endpoint, container) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayAnime(data.data, container);
        } else {
            container.innerHTML = '<p>No anime found</p>';
        }
    } catch (error) {
        console.error('Error fetching anime:', error);
        container.innerHTML = '<p>Failed to load anime</p>';
    }
}

// Display anime
function displayAnime(animeList, container) {
    container.innerHTML = '';

    animeList.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card floating';

        const title = anime.title_english || anime.title || 'Unknown Title';
        const imageUrl = anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x450/333/fff?text=No+Image';
        const score = anime.score ? anime.score.toFixed(1) : 'N/A';
        const type = anime.type || 'Unknown';
        const episodes = anime.episodes || '?';
        const status = anime.status || 'Unknown';
        const synopsis = anime.synopsis || 'No synopsis available.';
        const genres = anime.genres?.map(g => g.name) || [];
        const year = anime.year || (anime.aired?.prop?.from?.year || '');

        animeCard.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="anime-info">
                <h3>${title}</h3>
                <p>${type} • ⭐ ${score}</p>
            </div>
            <div class="anime-details">
                <h3 class="detail-title">${title}</h3>
                <p class="detail-text">${year} • ${status} • ${episodes} eps</p>
                <div class="detail-genres">
                    ${genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <p class="detail-text">${synopsis}</p>
            </div>
            <a href="watch.html?title=${encodeURIComponent(title)}&season=1&episode=1"  class="btn btn-primary watch-now-btn">Watch Now<i class="fas fa-play"></a>

        `;

        container.appendChild(animeCard);
    });
}

// Search function
function handleSearch(query) {
    if (query.length < 3) return;

    // Add transition effect
    document.body.classList.add('page-transition');

    // Wait for animation to complete before redirecting
    setTimeout(() => {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }, 500);
}

// Update event listeners
searchBtn.addEventListener('click', () => handleSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch(searchInput.value);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchAnimeData('/top/anime?filter=airing', trendingAnime);
    fetchAnimeData('/top/anime?filter=upcoming', newReleases);
    fetchAnimeData('/seasons/now', ongoingAnime);
});

const authToken = localStorage.getItem('authToken');

const profileElement = document.querySelector('.profile-element');
const loginLink = document.querySelector('.login-link');
const usernameSpan = document.querySelector('.username');

if (authToken) {
    const user = localStorage.getItem('user');
    const userName = JSON.parse(user).username || 'User';
    usernameSpan.textContent = userName;
    profileElement.style.display = 'flex';
    loginLink.style.display = 'none';
} else {
    profileElement.style.display = 'none';
    loginLink.style.display = 'inline-block';
}
document.querySelector('.logout-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    window.location.reload();
});
