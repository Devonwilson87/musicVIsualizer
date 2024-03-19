// Function to fetch lyrics
async function fetchLyrics(artist, title) {
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
      const data = await response.json();
      
      if (response.ok) {
        // Lyrics found
        return data.lyrics;
      } else {
        // Lyrics not found
        throw new Error("Lyrics not found");
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      return null;
    }
  }
  
  // Example usage
  const artist = "Ed Sheeran";
  const title = "Shape of You";
  
  fetchLyrics(artist, title)
    .then(lyrics => {
      if (lyrics) {
        console.log("Lyrics:", lyrics);
      } else {
        console.log("Lyrics not found.");
      }
    });
  