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
    default:
      theater.hidden = true;
      document.body.classList.remove('playing')
      break;
    case YT.PlayerState.PLAYING:
      theater.hidden = false;
      document.body.classList.add('playing')
      loading.hidden = true;
      break;
    case YT.PlayerState.PAUSED:
      break;
    case YT.PlayerState.BUFFERING:
      break;
  }
};

const onPlayerReady = () => {
  if (location.hash) {
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
    },
    events: {
      'onStateChange': ytStateChange,
      'onReady': onPlayerReady,
    },
  });
});

document.querySelector('.info-icon').addEventListener('click', () => {
  info.setAttribute('open', 'open');
});

info.addEventListener('click', () => {
  info.removeAttribute('open');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.hidden = true;
  loading.hidden = false;
  const value = form[0].value;
  let id = (new URL(value)).pathname.substr(1)
  if (id === null) {
    id = (new URLSearchParams(form[0].value).get('v'));
  }
  if (id !== null) {
    player.loadVideoById(id);
    history.pushState(null, null, '#' + id);
  }
});

form[0].addEventListener('focus', e => {
  e.target.select();
});

document.querySelector('.logo').addEventListener('click', () => {
  player.stopVideo();
  form.hidden = false;
  history.pushState(null, null, '#');
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