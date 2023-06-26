// check url change
function urlChangeListener(){
    let last;
    setInterval(()=> {
        let curr = document.location.href;
        if (last && curr !== last) toggleCheck();
        last = curr; 
    },100);
}
    
function nextShort(){
    document.querySelector("#navigation-button-down > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill").click();
}

let interval;
function toggleCheck(){
    if (document.location.href.includes('shorts')){
        let currentVidTag = ".reel-video-in-sequence[is-active]";
        waitForElem(` ${currentVidTag} > .overlay > .style-scope > #overlay > #progress-bar > .style-scope > .style-scope`, (elem)=> {
            elem.removeAttribute('hidden');
        });
        let views = document.querySelector("#factoids > ytd-factoid-renderer:nth-child(2) > div").getAttribute('aria-label');
        console.log(views);
        //auto scroll
        // let videoPlayer = document.querySelector(`${currentVidTag} > #player-container > #player > #container > div > div > video`);
        let lastRecordedValue = 0;
        let lastRecordedURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
        waitForElem(`${currentVidTag} > #player-container > #player > #container > div > div > video`, (video)=> {
            console.log(video);
            video.loop = false;
            video.addEventListener('ended', ()=>{
                let currURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
                if (currURL == lastRecordedURL) {
                    video.removeEventListener('ended', ()=> {
                        nextShort();
                    });
                }
            }, false)
        })
    }else{
        if (interval) clearInterval(interval);
    }
}
function waitForElem(tag, next){
    let limit = 200; // tries;
    let i = 0;
    let time = setInterval(()=> {
        if (document.querySelector(tag)){
             next(document.querySelector(tag));
             clearInterval(time);
        }
        i++;
        console.log('going');
    },100);
    if (i > limit){
        clearInterval(time)
        next(0);
    }
}
urlChangeListener();
toggleCheck();