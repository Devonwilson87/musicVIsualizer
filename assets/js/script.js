const clientID = '66fe6133fda54d3aa9b93bd5d3b1f556';
const clientSecret = 'ae2a46d282a84661a62a4c625a43c180';

// Base64 encode clientID:clientSecret
const basicToken = btoa(`${clientID}:${clientSecret}`);

let accessToken = '';

async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicToken}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
    console.log(data);
}

async function search() {
    
if (!accessToken) {
await getToken();
}

const searchInput = document.getElementById('searchInput').value.trim();
if (!searchInput) {
console.error('Please enter a search query');
return;
}

const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track`;

try {
const response = await fetch(apiUrl, {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
});

if (response.ok) {
    const data = await response.json();
    console.log(data);
    displayResults(data.tracks.items);
} else {
    throw new Error('Failed to fetch data');
}
} catch (error) {
console.error('Error:', error);
}
}

let currentAudio = null; // Reference to the currently playing audio

function displayResults(tracks) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (tracks.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('song-results-list');
    ul.setAttribute('id', 'song-results');
    let count = 0;


    tracks.forEach(track => {
        if (count < 5) {
            const li = document.createElement('li');
            li.textContent = track.name + ' - ' + track.artists[0].name;
            li.onclick = function() {
                // Remove any existing audio elements from other li's
                const headAudios = document.querySelectorAll('#head audio');
                headAudios.forEach(function(audio) {
                    audio.parentNode.removeChild(audio);
                });
                
                // Create audio element
                const audio = document.createElement('audio');
                const head = document.getElementById('head');
                audio.controls = false;
                audio.src = track.preview_url;
                head.appendChild(audio);
                
                // Autoplay if not already playing
                if (audio !== currentAudio) {
                    if (currentAudio) {
                        currentAudio.pause(); // Pause the currently playing audio
                    }
                    audio.play(); // Start playing the new audio
                    currentAudio = audio; // Update the reference to the currently playing audio
                }

                function fetchLyrics() {
                    // Replace "artist" and "title" with your desired artist and song title
                    const artist = encodeURIComponent(track.artists[0].name);
                    const title = encodeURIComponent(track.name);
                    
                    // Fetch lyrics from lyrics.ovh API
                    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.lyrics) {
                                document.getElementById('lyrics').textContent = data.lyrics.replace(/\n/g, "<br>");
                            } else {
                                document.getElementById('lyrics').textContent = "Lyrics not found.";
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching lyrics:', error);
                            document.getElementById('lyrics').innerHTML = "Error fetching lyrics.";
                        });
                }
                fetchLyrics();
            };
            ul.appendChild(li);
            count++;
        } else {
            return;
        }
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.appendChild(ul);
}
