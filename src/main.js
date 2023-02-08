const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3f520f51a2msha58f56a7de87529p147b7ejsne2520f7158d1',
		'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
	}
};

const buttons = [];

const allVideos = {
    items : [],
    initialPlaylistIndex : undefined
};

const playlists = [
  {
    title: "DARK_SIDE_OF_THE_MOON",
    id: "OLAK5uy_l1x-JAx0w53suECoCI0YJtW6VB8DBQWRQ",
  },
  {
    title: "THE_WALL",
    id: "PLyDzU3p8FP24syYfTXpGqTDHsQhlxwllS",
  },
  {
    title: "ANIMALS",
    id: "OLAK5uy_mOd2Ws36n_VlDvTIUsyWGb3Y9UVIlB9BA",
  },
  {
    title: "WISH_YOU_WERE_HERE",
    id: "OLAK5uy_mzowhqljIOba8BVGEmVkeaWeL2S_bO4bw",
  },
  {
    title: "ATOM_HEART_MOTHER",
    id: "OLAK5uy_m-_hJUy5TAO10yRvbxgvSO3ZrBp9_zXg4",
  },
  {
    title: "MEDDLE",
    id: "OLAK5uy_nznfbOMyruTyQ1CAOO8AON_qXVbA4fAA8",
  },
];

async function getVideosFromPlaylist(playlist) {
  try {
    const response = await fetch(
      `https://youtube-v31.p.rapidapi.com/playlistItems?playlistId=${playlist}&part=snippet&maxResults=50`,
      options
    );
    const videos = await response.json();
    return videos;
  } catch (e) {
    console.log(e);
  }
}

function printVideos(videos){
    document.querySelector(".videos").innerHTML = `
        ${videos.items
            .map(
            (video) => `
            <div class="video-container">
                <div class="video-content">
                    <img 
                        src="${video.snippet.thumbnails.high.url}" 
                        alt="${video.snippet.title}" 
                        class="video-thumbnail"
                    >
                    <a href="https://www.youtube.com/watch?v=${
                        video.snippet.resourceId.videoId
                    }">                    
                        <p class="video-title">${video.snippet.title}</p>
                    </a>
                </div>                   
            </div>
            `
            )
        .join("")}
    `;
}

async function chooseAlbum(event){
    if(event.target.id !== 'RANDOM'){
        playlists.forEach(async playlist=> {
            if(event.target.id === playlist.title){
                try{
                    const videos = await getVideosFromPlaylist(playlist.id);
                    printVideos(videos)
                }catch(e){
                    console.log(e);
                }
            }
        })
    }else if(event.target.id === 'RANDOM'){
        const randomSongs = await getRandomSongs();
        console.log(randomSongs)
        printVideos(randomSongs)
    }
}

async function getRandomSongs(){
    try{
        for(let i = 0; i < playlists.length; i++){
            if(i !== allVideos.initialPlaylistIndex){
                const videos = await getVideosFromPlaylist(playlists[i].id);
                allVideos.items.push(...videos.items);
            }
        }
        const randomSongs = new Set();
        while(randomSongs.size < 20){
            const random = getRandomNumber(0, allVideos.items.length - 1);
            randomSongs.add(allVideos.items[random]);
        }
        return {items : [...randomSongs]};
    }catch(e){
        console.log(e);
    }
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async function () {
    try{
        const random = getRandomNumber(0, (playlists.length-1))
        const videos = await getVideosFromPlaylist(playlists[random].id);
        printVideos(videos);
        allVideos.items.push(...videos.items)
        allVideos.initialPlaylistIndex = random;
        buttons.push(...document.querySelectorAll('.songs__btn'));
        buttons.forEach(button=>{
                button.addEventListener('click',chooseAlbum);
            })
    }catch(e){
        console.log(e);
    }
})();
