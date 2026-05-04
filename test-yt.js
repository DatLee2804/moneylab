const url = 'https://www.youtube.com/watch?v=5EnYhB6lolE&amp;t=489s';
const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
console.log(match);
