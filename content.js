
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
        console.log(document.location.href);
        let lastRecordedValue = 0;
        if (interval) return;
        interval = setInterval(()=> {
            let currentValue = +document.querySelector("#progress-bar-line").getAttribute('aria-valuenow')
            if (lastRecordedValue > currentValue){
                nextShort();
            }
            console.log(currentValue, lastRecordedValue);
            lastRecordedValue = currentValue;
        }, 500);
    }else{
        if (interval) clearInterval(interval);
    }
}
urlChangeListener();
toggleCheck();