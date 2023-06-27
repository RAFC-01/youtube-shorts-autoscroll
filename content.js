let videoPlayerTag;
let timeSkipAmmount = 1;
// check url change
function urlChangeListener(){
    let last;
    let isShorts = false;
    setInterval(()=> {
        let curr = document.location.href;
        let isCurrShorts = document.location.href.includes('shorts');
        // console.log(isCurrShorts)
        if (last && curr !== last) toggleCheck(isCurrShorts); // all url change
        if (isCurrShorts !== isShorts) onShortsLocationChange(isCurrShorts); // just entering/exiting shorts
        last = curr;
        isShorts = isCurrShorts;
    },100);
}
    
function nextShort(){
    document.querySelector("#navigation-button-down > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill").click();
    document.querySelector('.reel-video-in-sequence[is-active] > #player-container > #player > #container > div > div > video').removeEventListener('ended', nextShort);
}

function toggleCheck(isShorts){
    if (isShorts){
        // progress-bar
        let currentVidTag = ".reel-video-in-sequence[is-active]";
        waitForElem(` ${currentVidTag} > .overlay > .style-scope > #overlay > #progress-bar > .style-scope > .style-scope`, (elem)=> {
            elem.removeAttribute('hidden');
        });
        // let views = document.querySelector("#factoids > ytd-factoid-renderer:nth-child(2) > div").getAttribute('aria-label');
        // console.log(views);
        //auto scroll
        videoPlayerTag = `${currentVidTag} > #player-container > #player > #container > div > div > video`;
        let lastRecordedValue = 0;
        let currURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
        let vid;
        waitForElem(`${currentVidTag} > #player-container > #player > #container > div > div > video`, (video)=> {
            video.loop = false;
            video.addEventListener('ended', nextShort);
        })
        // video.removeEventListener('ended', nextShort);
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
    },100);
    if (i > limit){
        clearInterval(time)
        next(0);
    }
}
function onShortsLocationChange(isShorts){
    if (isShorts){
        document.addEventListener('keydown', skipShortTime);
    }else{
        document.removeEventListener('keydown', skipShortTime);
    }
}
function skipShortTime(e){
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    waitForElem(videoPlayerTag, (video)=>{
        let forward = e.key == 'ArrowRight';
        if (forward){
            video.currentTime += timeSkipAmmount;
        }else{
            video.currentTime -= timeSkipAmmount;
        }
    })
}
urlChangeListener();
toggleCheck(document.location.href.includes('shorts'));
onShortsLocationChange(document.location.href.includes('shorts'));