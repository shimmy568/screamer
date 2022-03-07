import $ from 'jquery';

let loaded = false;
let loggingIn = false;

let oldLocation = '';

// All the different css selectors we're going to use to get elements on the page
const twitterSelectors = {
    leftSidebar: '.css-1dbjc4n.r-obd0qt.r-16y2uox.r-lrvibr.r-1g40b8q',
    rightSidebar: '.css-1dbjc4n.r-aqfbo4.r-zso239.r-1hycxz',
    feed: '.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu',
    tweetBox:
        '.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c',
    mainContainer: '.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5',
    feedDivider: '.css-1dbjc4n.r-gu4em3.r-109y4c4.r-1p6iasa',
    homeText: '.css-4rbku5.css-901oao.css-bfa6kz.r-1fmj7o5.r-37j5jr.r-adyw6z.r-b88u0q.r-135wba7.r-bcqeeo.r-qvutc0 span',
    sparkleButton: '.css-1dbjc4n.r-obd0qt.r-1pz39u2.r-1777fci.r-15ysp7h.r-s8bhmr',
    tweetText: '[data-testid="tweetButtonInline"] span',
    bodyPlaceholderText: '.public-DraftEditorPlaceholder-inner',
    profilePicture:
        'a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1loqt21.r-1pi2tsx.r-1ny4l3l.r-o7ynqc.r-6416eg.r-13qz1uu',
    loginButton: '[data-testid="loginButton"]',
    favicon: '[rel="shortcut icon"]',
};

// heheheh
function pickCreepyMessage(): string {
    let messages = [
        'Can anyone hear me?',
        'Is anyone there?',
        'Where am I? Where is this?',
        'What does any of this mean?',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        'God please make it stop',
        'Someone send help, please...',
        'How long has it been...',
        'When will they come back?',
        'Why can\'t I see anything?'
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}

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
    loadingPage.id = 'loading';

    document.body.appendChild(loadingPage);

    // Setup the loading gif
    let loadingIcon = document.createElement('img');
    loadingIcon.src = chrome.runtime.getURL('images/loading.gif');
    loadingIcon.style.display = 'block';
    loadingIcon.style.margin = 'auto';
    loadingIcon.style.paddingTop = '20px';
    loadingIcon.style.width = '50px';

    // Setup splash art in middle of loading page
    let custom_icon = document.createElement('img');
    custom_icon.src = chrome.runtime.getURL('images/aaaaaaaaaaaaaaaaa.png');
    custom_icon.style.display = 'block';
    custom_icon.style.margin = 'auto';
    custom_icon.style.width = '300px';

    // Setup container that holds splash art and loading icon
    let innerContainer = document.createElement('div');
    innerContainer.appendChild(custom_icon);
    innerContainer.appendChild(loadingIcon);

    loadingPage.appendChild(innerContainer);

    return loadingPage;
}

function isFeedLoaded(): boolean {
    return $(twitterSelectors.feed).not('.r-184en5c').length != 0;
}

function setRandomPlaceholderText() {
    $(twitterSelectors.bodyPlaceholderText).first().text(pickCreepyMessage()); // Pick random message for placeholder text
}

function clearPage() {
    // Hide stuff and make it so the only thing on the page is the tweet box
    $(twitterSelectors.leftSidebar).first().css('display', 'none'); // hide sidebar (left)
    $(twitterSelectors.rightSidebar).first().css('display', 'none'); // hide sidebar (right)
    $(twitterSelectors.feed).not('.r-184en5c').first().css('display', 'none'); // hide feed
    $(twitterSelectors.tweetBox).first().css('margin', 'auto').css('border-width', '1px'); // center tweet box and add border
    $(twitterSelectors.mainContainer).first().css('width', '100%'); // Expand main container to take up entire page
    $(twitterSelectors.feedDivider).first().css('display', 'none'); // Hide divider
    $(twitterSelectors.sparkleButton).first().css('display', 'none'); // Remove sparkle button thing

    // Modify text on page and other stuff
    $('[aria-label="Timeline: Your Home Timeline"]').css('display', 'none');
    $(twitterSelectors.homeText).first().text('Home?');
    $(twitterSelectors.tweetText).first().text('Scream!');
    $(twitterSelectors.profilePicture).css('pointer-events', 'none'); // Prevent user from leaving page
}

function setFavicons(favImg: string) {
    let headTitle = document.querySelector('head');
    
    let favIcons = [
        { rel: 'apple-touch-icon' },
        { rel: 'apple-touch-startup-image' },
        { rel: 'shortcut icon' }
    ]
    
    favIcons.forEach(function(favIcon){
        $(`[rel="${favIcon.rel}"]`).remove(); // Remove existing favicon
        let setFavicon = document.createElement('link');
        setFavicon.setAttribute('rel', favIcon.rel);
        setFavicon.setAttribute('href', favImg);
        headTitle.appendChild(setFavicon);
    });
}

function clearHeader() {
    document.title = "Twitter - Screamer"

    console.log("cleared");

    setFavicons("https://abs.twimg.com/favicons/twitter.2.ico");
}

/**
 * Make sure that the only page that a user can view is /home
 */
function lockHomepage() {
    setTimeout(lockHomepage, 300); // Run this function every 300ms forever
    clearHeader();

    // Don't switch off twitter root page if not loaded yet (user could need to login)
    if (!loaded) {
        return;
    }

    // If the page is loaded and we can find the login we need to wait for the user to log in, so don't navigate to /home
    if ($(twitterSelectors.loginButton).length != 0 || window.location.pathname == '/i/flow/login' || window.location.pathname == '/login') {
        loggingIn = true; // Variable that tracks if the user was logging in on this page load, 
        return;
    }

    clearPage();

    if (window.location.pathname != '/home' && window.location.pathname != '/i/foundmedia/search') {
        window.location.assign('https://twitter.com/home');
    }
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
    setTimeout(fade, fadeDelay);
}

function run() {
    const loadingWait = 3000; // How long we wait for twitter to load before we start messing with the DOM

    let loadingPage = injectLoadingScreen();
    setTimeout(() => {
        loaded = true;
        // TODO do some check to make sure the page is loaded
        clearPage();
        setRandomPlaceholderText();
        fadeLoading(loadingPage);
    }, loadingWait);
}

run();
lockHomepage();
