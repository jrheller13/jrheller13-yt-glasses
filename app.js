let currentVideoId = 'dQw4w9wgxcq';
let history = JSON.parse(localStorage.getItem('ytHistory')) || ['dQw4w9wgxcq'];
let historyIndex = history.length - 1;

const player = document.getElementById('ytplayer');

function extractVideoId(input) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = input.match(regExp);
    return match && match[2].length === 11 ? match[2] : input.trim();
}

function loadVideo(videoId) {
    currentVideoId = videoId;
    // Using youtube-nocookie for better compatibility
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

function playVideo() {
    const input = document.getElementById('search').value.trim();
    if (!input) return;
    const videoId = extractVideoId(input);
    loadVideo(videoId);
}

function prevVideo() {
    if (historyIndex > 0) {
        historyIndex--;
        loadVideo(history[historyIndex]);
    }
}

function nextVideo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        loadVideo(history[historyIndex]);
    }
}

function togglePause() {
    console.log("Pause/Play — best experienced in Full Screen");
}

function toggleFullScreen() {
    const container = document.getElementById('player-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Keyboard support (arrows = D-pad simulation)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextVideo();
    if (e.key === 'ArrowLeft') prevVideo();
    if (e.key === 'f' || e.key === 'F') toggleFullScreen();
});

document.addEventListener('DOMContentLoaded', () => {
    loadVideo(currentVideoId);
});