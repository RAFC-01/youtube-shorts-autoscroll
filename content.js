
window.addEventListener('hashchange', toggleCheck);
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
    console.log('toggle check')
    if (document.location.href.includes('shorts')){
        let currentVidTag = ".reel-video-in-sequence[is-active]";
        let progress_bar = document.querySelector(` ${currentVidTag} > .overlay > .style-scope > #overlay > #progress-bar > .style-scope > .style-scope`);
        progress_bar.removeAttribute('hidden');
        //auto scroll
        let lastRecordedValue = 0;
        let lastRecordedURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
        if (interval) return;
        interval = setInterval(()=> {
            let currentValue = +document.querySelector("#progress-bar-line").getAttribute('aria-valuenow');
            let currURL = document.location.href.substring(document.location.href.lastIndexOf('shorts/')+7);
            if (lastRecordedValue > currentValue || currentValue == 100){
                if (currURL == lastRecordedURL) nextShort();
            }
            console.log(lastRecordedURL);
            lastRecordedURL = currURL;
            lastRecordedValue = currentValue;
        }, 500);
    }else{
        if (interval) clearInterval(interval);
    }
}
urlChangeListener();
toggleCheck();