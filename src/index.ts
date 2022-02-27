import $ from 'jquery';

function injectLoadingScreen(): HTMLDivElement {

    // Setup div that will cover the entire page while it loads
    let loadingPage = document.createElement('div');
    loadingPage.style.position = 'fixed';
    loadingPage.style.background = 'black';
    loadingPage.style.top = '0px';
    loadingPage.style.bottom = '0px';
    loadingPage.style.left = '0px';
    loadingPage.style.right = '0px';
    loadingPage.style.display = 'flex';
    loadingPage.style.justifyContent = 'center';
    loadingPage.style.alignItems = 'center';
    loadingPage.id = "loading"

    document.body.appendChild(loadingPage);

    // Setup the loading gif and splash art
    let loadingIcon = document.createElement("img");
    loadingIcon.src = chrome.runtime.getURL('loading.gif');
    loadingIcon.style.display = "block";
    loadingIcon.style.margin = "auto";
    loadingIcon.style.paddingTop = "20px";
    loadingIcon.style.width = "50px";
    
    let custom_icon = document.createElement('img');
    custom_icon.src = chrome.runtime.getURL('aaaaaaaaaaaaaaaaa.png');
    custom_icon.style.display = "block";
    custom_icon.style.margin = "auto";
    custom_icon.style.width = "300px";
    
    let innerContainer = document.createElement("div");
    innerContainer.appendChild(custom_icon);
    innerContainer.appendChild(loadingIcon);

    loadingPage.appendChild(innerContainer);

    return loadingPage;
}

function clearPage() {
    $(".css-1dbjc4n.r-obd0qt.r-16y2uox.r-lrvibr.r-1g40b8q").first().css("display", "none"); // hide sidebar (left)
    $(".css-1dbjc4n.r-aqfbo4.r-zso239.r-1hycxz").first().css("display", "none"); // hide sidebar (right)
    $(".css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu").not(".r-184en5c").first().css("display", "none"); // hide feed
    
    console.log("test1");
}

function fadeLoading(loadingPage: HTMLDivElement) {
    let fadeDelay = 10; // How long we wait to lower opacity in ms
    let currentOpacity = 1; // Keeps track of current opacity
    let opacityStep = 0.01; // How much we lower the opacity by for each step

    const fade = () => {
        // Stop once the element is completely faded and remove it
        if (currentOpacity <= 0) {
            loadingPage.remove();
            return;
        }

        // Lower the opacity and loop
        loadingPage.style.opacity = currentOpacity.toString();
        currentOpacity -= opacityStep;
        setTimeout(fade, fadeDelay);
    };
    setTimeout(fade, fadeDelay)
}

function run() {

    const loadingWait = 4000; // How long we wait for twitter to load before we start messing with the DOM

    let loadingPage = injectLoadingScreen();
    setTimeout(() => {
        clearPage();
        fadeLoading(loadingPage);
    }, loadingWait);
}

run();
