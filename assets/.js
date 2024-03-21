const apiKey = 'AIzaSyDgHicwAeI3GY4_TVhCh1Zko81L05jB2bc'; // Replace with your Tenor API key
const searchTerm = ''; // Replace with your desired search term

const apiUrl = `https://api.tenor.com/v1/search?q=${searchTerm}&key=${apiKey}`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    // Process the response data
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  });
