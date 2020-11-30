# noCookieTube
Avoid cookies and popups on Youtube by clicking a bookmarklet

See: https://zutaten-nl.github.io/nocookietube/

##Background

Trying to keep your privacy footprint as low as possible on Youtube is hard. Not being logged in is actively punished, by multiple popups.

This small player is a simple iframe embed, so you can watch Youtube without popups. It also requests videos from the youtube-nocookie domain, so no cookies are stored.

The Youtube Iframe API initialisation is wrapped inside a promise-resolver, so you can easily boot using 

`youtubeApi().then(() => { 
    player = new YT.Player('player'...
`