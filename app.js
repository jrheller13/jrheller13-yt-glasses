const API_KEY = 'AIzaSyCJwK4l2PHq3PQmVQ45g7_KzwqDE8_fSJo';

let currentVideoId = 'dQw4w9wgxcq';
let history = JSON.parse(localStorage.getItem('ytHistory')) || ['dQw4w9wgxcq'];
let historyIndex = history.length - 1;

const player = document.getElementById('ytplayer');
const resultsContainer = document.getElementById('results');

// Load video into player
function loadVideo(videoId) {
    currentVideoId = videoId;
    player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;
    addToHistory(videoId);
}

function addToHistory(videoId) {
    if (!history.includes(videoId)) {
        history.push(videoId);
        if (history.length > 30) history.shift();
        localStorage.setItem('ytHistory', JSON.stringify(history));
    }
    historyIndex = history.length - 1;
}

// Real YouTube Search
async function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;
    
    resultsContainer.innerHTML = '<p>🔍 Searching...</p>';
    
    try {
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=8&key=${API_KEY}`);
        const data = await res.json();
        
        if (!data.items || data.items.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }
        
        resultsContainer.innerHTML = data.items.map(item => `
            <div class="result-item" onclick="playFromSearch('${item.id.videoId}')">
                <img src="${item.snippet.thumbnails.default.url}" alt="">
                <div>
                    <div style="font-weight:600;">${item.snippet.title}</div>
                    <small>${item.snippet.channelTitle}</small>
                </div>
            </div>
        `).join('');
    } catch (e) {
        resultsContainer.innerHTML = '<p>Error loading results.<br>Check your API key.</p>';
    }
}

// Play video from search results
function playFromSearch(videoId) {
    loadVideo(videoId);
    resultsContainer.innerHTML = '<p>▶ Now Playing...</p>';
}

// Load Trending Videos on startup
async function loadSuggestions() {
    if (API_KEY.includes('AIzaSyCJwK4l2PHq3PQmVQ45g7_KzwqDE8_fSJo')) {
        resultsContainer.innerHTML = '<p style="color:#ff0;">⚠️ Please add your YouTube API key in app.js</p>';
        return;
    }
    
    try {
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=8&regionCode=US&key=${API_KEY}`);
        const data = await res.json();
        
        resultsContainer.innerHTML = '<div style="margin-bottom:8px; opacity:0.7; font-size:15px;">🔥 Trending Right Now</div>' + 
            data.items.map(item => `
                <div class="result-item" onclick="playFromSearch('${item.id}')">
                    <img src="${item.snippet.thumbnails.default.url}" alt="">
                    <div>
                        <div style="font-weight:600;">${item.snippet.title}</div>
                        <small>${item.snippet.channelTitle}</small>
                    </div>
                </div>
            `).join('');
    } catch (e) {
        resultsContainer.innerHTML = '<p>Could not load trending videos.</p>';
    }
}

// Navigation functions
function prevVideo() {
    if (historyIndex > 0) loadVideo(history[--historyIndex]);
}

function nextVideo() {
    if (historyIndex < history.length - 1) loadVideo(history[++historyIndex]);
}

function togglePause() {
    console.log("Pause/Play — use Full Screen for best experience");
}

function toggleFullScreen() {
    const container = document.getElementById('player-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Keyboard support (for testing with arrow keys)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextVideo();
    if (e.key === 'ArrowLeft') prevVideo();
    if (e.key === 'f' || e.key === 'F') toggleFullScreen();
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    loadVideo(currentVideoId);
    loadSuggestions();
});