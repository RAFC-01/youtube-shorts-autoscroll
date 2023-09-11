class viewsChecker{
    constructor(){
        this.lastRecorded;
    }
    lookForChange(next){
        let elems = document.querySelectorAll("#factoids > ytd-factoid-renderer:nth-child(2) > div")
        let it = 0;
        let itlimit = 200;
        let interval = setInterval(()=> {
            it++;
            for (let i = 0; i < elems.length; ++i){
                let elem = elems[i];
                let views = elem.getAttribute('aria-label');
                let viewsNumber = parseInt(views.replace(/[^0-9]/g, ''));
                // console.log(this.lastRecorded[i]);
                if (this.lastRecorded === undefined || this.lastRecorded !== viewsNumber){
                    clearInterval(interval);
                    this.lastRecorded = viewsNumber;
                    next(viewsNumber)
                    return 0;
                }
            }
            if (it > itlimit) clearInterval(interval);
        },100)

    }
}
let videoPlayerTag;
let timeSkipAmmount = 1;
let firstEnter = true;
let viewsLowestSkip = 0;

const seenVideos = {};

const checker = new viewsChecker();
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
    
function nextShort(remove = 1){
    document.querySelector("#navigation-button-down > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill").click();
    if (remove) document.querySelector('.reel-video-in-sequence[is-active] > #player-container > #player > #container > div > div > video').removeEventListener('ended', nextShort);
}


function toggleCheck(isShorts){
    if (isShorts){
        let url = document.location.pathname;
        
        // progress-bar
        let currentVidTag = ".reel-video-in-sequence[is-active]";
        document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > yt-smartimation > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill")
        waitForElem(` ${currentVidTag} > .overlay > .style-scope > #overlay > #progress-bar > .style-scope > .style-scope`, (elem)=> {
            elem.removeAttribute('hidden');
            // console.log(firstEnter);
            if (firstEnter){
                firstEnter = false;
                waitForElem('#subscribe-button > ytd-subscribe-button-renderer > yt-smartimation > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill', ()=> {
                    elem.removeAttribute('hidden');
                });
                
            }
        });
        // skip low views
        // let views = document.querySelector("#factoids > ytd-factoid-renderer:nth-child(2) > div").getAttribute('aria-label');
        checker.lookForChange((views)=> {
            // console.log(views, viewsLowestSkip, seenVideos[url])
            if (views < viewsLowestSkip && !seenVideos[url]){
                // console.log('skip');
                nextShort(0);
            }
        });
        // console.log(views);
        //auto scroll
        videoPlayerTag = `${currentVidTag} > #player-container > #player > #container > div > div > video`;
        let lastRecordedValue = 0;
        let currURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
        let vid;
        waitForElem(`${currentVidTag} > #player-container > #player > #container > div > div > video`, (video)=> {
            video.loop = false;
            video.addEventListener('ended', nextShort);
            //add to seen videos
            seenVideos[url] = 1;
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
        firstEnter = true;
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
window.onload = () => {
    let currentVidTag = ".reel-video-in-sequence[is-active]";
    waitForElem("#factoids > ytd-factoid-renderer:nth-child(2) > div", ()=>{
        waitForElem(`${currentVidTag} > #player-container > #player > #container > div > div > video`, (video)=> {
            waitForElem('#subscribe-button > ytd-subscribe-button-renderer > yt-smartimation > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill', ()=> {
                urlChangeListener();
                toggleCheck(document.location.href.includes('shorts'));
                onShortsLocationChange(document.location.href.includes('shorts'));
            });
        });
    });
}