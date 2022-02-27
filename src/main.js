function injectLoadingScreen() {
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

    document.body.appendChild(loadingPage);

    let custom_icon = document.createElement('img');
    custom_icon.src = chrome.runtime.getURL('aaaaaaaaaaaaaaaaa.png');
    // loadingPage.appendChild(custom_icon);
}

function clearPage() {
    // TODO make it clear the page of all unneeded TRASH
}

function fadeLoading() {
    // TODO make it fade the loading page out slowly, and eventually remove it (or maybe just remove it idk)
}

function run() {
    injectLoadingScreen();

    setTimeout(() => {
        clearPage();
        fadeLoading();
    }, 5000);
    debugger;
}

run();
