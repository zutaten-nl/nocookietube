let player;
const theater = document.querySelector('div.theater');
const loading = document.querySelector('.loading');
const info = document.querySelector('.info');
const form = document.forms[0];

const youtubeApi = () => {
  if (window.YT) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  return new Promise((resolve, reject) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
};

const ytStateChange = (event) => {
  switch (event.data) {
    case YT.PlayerState.ENDED:
    case YT.PlayerState.CUED:
      theater.hidden = true;
      document.body.classList.remove('playing')
      break;
    case YT.PlayerState.PLAYING:
    case YT.PlayerState.BUFFERING:
      theater.hidden = false;
      document.body.classList.add('playing')
      loading.hidden = true;
      break;
    case YT.PlayerState.PAUSED:
      break;
  }
};

const onPlayerReady = () => {
  if (location.hash && location.hash !== '#null') {
    player.loadVideoById(location.hash.substr(1));
  } else {
    loading.hidden = true;
    form.hidden = false;
  }
};

youtubeApi().then(() => {
  player = new YT.Player('player', {
    host: 'https://www.youtube-nocookie.com',
    playerVars: {
      modestbranding: 1,
      wmode: 'transparent',
      showinfo: 0,
      autohide: 1,
      autoplay: 1,
    },
    events: {
      'onStateChange': ytStateChange,
      'onReady': onPlayerReady,
    },
  });
});

document.querySelector('.info-icon').addEventListener('click', () => {
  info.hidden = false;
});

info.querySelector('svg').addEventListener('click', () => {
  info.hidden = true;
});

const getYoutubeId = url => {
  try {
    url = new URL(url);
  } catch (error) {
    return false;
  }

  if (url.host === 'www.youtube.com') {
    return (new URLSearchParams(url.search)).get('v');
  }
  if (url.host === 'youtu.be') {
    return url.pathname.substr(1)
  }

  return false;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = getYoutubeId(form[0].value);
    if (id) {
      player.loadVideoById(id);
      history.pushState(null, null, '#' + id);
    } else {
      alert('Please provide a Youtube URL');
    }
  }
);

form[0].addEventListener('focus', e => {
  e.target.select();
});

document.querySelector('.logo').addEventListener('click', () => {
  player.stopVideo();
  form.hidden = false;
  history.pushState(null, null, location.pathname);
});

window.addEventListener('hashchange', () => {
  if (location.hash.length > 1) {
    form.hidden = true;
    loading.hidden = false;
    player.loadVideoById(location.hash.substr(1));
  } else {
    loading.hidden = true;
    form.hidden = false;
  }
});