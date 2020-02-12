const puppeteer = require('puppeteer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const defaultTimeoutTime = 32000; // 32 seconds

const baseUrl = 'http://localhost:3000';
const routes = {
    base: `${baseUrl}/`,
    public: `${baseUrl}/public`,
    register: `${baseUrl}/register`,
    login: `${baseUrl}/login`,
    logout: `${baseUrl}/logout`,
    profile: (username) => `${baseUrl}/${username}`
};

let browser;
let page;

beforeAll(async () => {
    startApp();

    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
});

describe('Test register', () => {
    beforeAll(async () => await prepareNewSession());

    test('User can register with valid information', async () => {
        await registerOnPage(mapDefaultUserToRegisterForm());
        await page.waitForNavigation();

        assertPageIsLocatedAtRoute(routes.login);
    }, defaultTimeoutTime);

    test('User cannot register when submitted username is already taken', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.username = defaultUser.username; // Was submitted in previous test
        
        await registerOnPage(formData);

        await assertPageContainsString('The username is already taken');
        assertPageIsLocatedAtRoute(routes.register);
    }, defaultTimeoutTime);

    test('User cannot register when submitted username is blank', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.username = '';

        await registerOnPage(formData);

        await assertPageContainsString('You must fill out all fields');
        assertPageIsLocatedAtRoute(routes.register);
    }, defaultTimeoutTime);

    test('User cannot register when submitted password is blank', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.password = '';

        await registerOnPage(formData);

        await assertPageContainsString('You must fill out all fields');
        assertPageIsLocatedAtRoute(routes.register);
    }, defaultTimeoutTime);

    test('User cannot register when the two submitted passwords do not match', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.password2 = 'dittokiddo';

        await registerOnPage(formData);

        await assertPageContainsString('Passwords do not match');
        assertPageIsLocatedAtRoute(routes.register);
    }, defaultTimeoutTime);

    test('User cannot register when the submitted email is not valid', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.email = 'broken';

        await registerOnPage(formData);

        await assertPageContainsString('You have to enter a valid email address');
        assertPageIsLocatedAtRoute(routes.register);
    }, defaultTimeoutTime);
});

describe('Test login and logout', () => {
    beforeAll(async () => { 
        prepareNewSession();

        await registerOnPage(mapDefaultUserToRegisterForm());
        await page.waitForNavigation();
    });

    test('User can log in with valid information', async () => {
        await loginOnPage(mapDefaultUserToLoginForm());
        await page.waitForNavigation();

        assertPageIsLocatedAtRoute(routes.base);
    }, defaultTimeoutTime);

    test('User can log out', async () => {
        await page.goto(routes.logout, { waitUntil: 'domcontentloaded' });

        assertPageIsLocatedAtRoute(routes.logout);
    }, defaultTimeoutTime);

    test('User cannot login with invalid password', async () => {
        const formData = mapDefaultUserToLoginForm();
        formData.password = 'wrongpassword';

        await loginOnPage(formData);
        await page.waitFor(500);

        await assertPageContainsString('That did not work. Try again.');
        assertPageIsLocatedAtRoute(routes.login);
    }, defaultTimeoutTime);

    test('User cannot login with invalid username', async () => {
        const formData = mapDefaultUserToLoginForm();
        formData.username = 'user2';

        await loginOnPage(formData);

        await assertPageContainsString('User not found');
        assertPageIsLocatedAtRoute(routes.login);
    }, defaultTimeoutTime);
});

describe('Test message recording', () => {
    beforeAll(async () => {
        prepareNewSession();

        await registerAndLoginUser(defaultUser);
    });

    test('User can add message', async () => {
        const message1 = 'test message 1';
        const message2 = '<test message 2>';

        await addMessage(message1);
        await addMessage(message2);

        assertPageContainsString(message1);
        assertPageContainsString(message2);
    }, defaultTimeoutTime);
});

// TODO: Make compatible with new backend

// describe('Test timelines', () => {
//     const user2 = {
//         username: 'user2',
//         email: 'user@example.com',
//         password: 'default2'
//     };

//     const defaultUserMessage = 'the message by default user';
//     const user2Message = 'the message by user 2';

//     beforeAll(async () => {
//         await prepareNewSession();

//         // Default user registers, logs in, adds a message, and logs out
//         await registerAndLoginUser(defaultUser);
//         await page.goto(routes.base, { waitUntil: 'domcontentloaded' });
//         await addMessage(defaultUserMessage);
//         await page.goto(routes.logout, { waitUntil: 'domcontentloaded' });

//         // User 2 registers, logs in, adds a message, and remains logged in
//         await registerAndLoginUser(user2);
//         await page.goto(routes.base, { waitUntil: 'domcontentloaded' });
//         await addMessage(user2Message);
//     }, defaultTimeoutTime);

//     test('Added messages in visible on public timeline', async () => {
//         await page.goto(routes.public, { waitUntil: 'domcontentloaded' });

//         await assertPageContainsString(defaultUserMessage);
//         await assertPageContainsString(user2Message);
//     }, defaultTimeoutTime);

//     test('User 2\'s timeline should only show user 2\'s message', async () => {
//         await page.goto(routes.base, { waitUntil: 'domcontentloaded' });

//         await assertPageContainsString(user2Message);
//         await assertPageDoesNotContainString(defaultUserMessage);
//     }, defaultTimeoutTime);

//     test('Default user\'s message is on user 2\'s timeline after follow', async () => {
//         // Go to default's user profile and follow profile
//         await page.goto(routes.profile(defaultUser.username), { waitUntil: 'domcontentloaded' });
//         await page.waitForSelector('.followstatus');
//         await page.$eval('a.follow', async (el) => await el.click());

//         await assertPageContainsString(`You are now following "${defaultUser.username}"`);

//         // Go to public timeline and assert
//         await page.goto(routes.base, { waitUntil: 'domcontentloaded' });
//         await assertPageContainsString(user2Message);
//         await assertPageContainsString(defaultUserMessage);
//     }, defaultTimeoutTime);

//     test('Profile timelines only contain user\'s message', async () => {
//         // Go to default user's profile and assert only his/hers message is there as the only one
//         await page.goto(routes.profile(defaultUser.username), { waitUntil: 'domcontentloaded' });
//         await assertPageContainsString(defaultUserMessage);
//         await assertPageDoesNotContainString(user2Message);

//         // Go to user 2's profile and assert only his/hers message is there as the only one
//         await page.goto(routes.profile(user2.username), { waitUntil: 'domcontentloaded' });
//         await assertPageContainsString(user2Message);
//         await assertPageDoesNotContainString(defaultUserMessage);
//     }, defaultTimeoutTime);

//     test('Default user\'s message is not on user 2\'s timeline after unfollow', async () => {
//         // Go to default's user profile and unfollow profile
//         await page.goto(routes.profile(defaultUser.username), { waitUntil: 'domcontentloaded' });
//         await page.waitForSelector('.followstatus');
//         await page.$eval('a.unfollow', async (el) => await el.click());

//         await assertPageContainsString(`You are no longer following "${defaultUser.username}"`);

//         await page.goto(routes.base, { waitUntil: 'domcontentloaded' });
//         await assertPageContainsString(user2Message);
//         await assertPageDoesNotContainString(defaultUserMessage);
//     }, defaultTimeoutTime);
// });
 
afterAll(async () => {
    await page.close();
    await browser.close();
    
    stopApp();
});


//// TEST HELPER METHODS AND OBJECTS ////

const defaultUser = {
    username: 'user1',
    email: 'user1@example.com',
    password: 'default'
};

function mapDefaultUserToRegisterForm() {
    return mapUserToRegisterForm(defaultUser);
}

function mapUserToRegisterForm(user) {
    return {
        username: user.username,
        email: user.email,
        password: user.password,
        password2: user.password
    }
}

function mapDefaultUserToLoginForm() {
    return mapUserToLoginForm(defaultUser);
}

function mapUserToLoginForm(user) {
    return {
        username: user.username,
        password: user.password
    }
}

/**
 * Navigates to register site and submits data from 'registerFormData'
 * on site.
 * 
 * @param registerFormData Contains data to put in form
 */
async function registerOnPage(registerFormData) {
    await page.goto(routes.register, { waitUntil: 'domcontentloaded' });

    const form = await page.$('div.body form');
    const username = await form.$('input[name="username"]');
    const email = await form.$('input[name="email"]');
    const password = await form.$('input[name="password"]');
    const password2 = await form.$('input[name="password2"]');

    await username.type(registerFormData.username);
    await email.type(registerFormData.email);
    await password.type(registerFormData.password);
    await password2.type(registerFormData.password2);

    await form.$eval('input[value="Sign Up"]', async (el) => await el.click());
}

/**
 * Navigates to login site and submits data from 'loginFormData' on site.
 * 
 * @param loginFormData Contains data to put in form
 */
async function loginOnPage(loginFormData) {
    await page.goto(routes.login, { waitUntil: 'domcontentloaded' });

    const form = await page.$('div.body form');
    const username = await form.$('input[name="username"]');
    const password = await form.$('input[name="password"]');

    await username.type(loginFormData.username);
    await password.type(loginFormData.password);

    await form.$eval('input[value="Sign In"]', async (el) => await el.click());
}

async function registerAndLoginUser(user) {
    await registerOnPage(mapUserToRegisterForm(user));
    await page.waitForNavigation();
    await loginOnPage(mapUserToRegisterForm(user));
}

/**
 * Adds message on timeline.
 * It is required that page is located at base address (i.e. '/').
 * 
 * @param message Message to post
 */
async function addMessage(message) {
    await page.waitForSelector('div.twitbox form');

    const form = await page.$('div.twitbox form');
    const messageField = await form.$('input[name="text"]');

    await messageField.type(message);

    await form.$eval('input[value="Share"]', async (el) => await el.click());
}

/**
 * Asserts that string is present in the body element of the page.
 * The testing function that calls this function will fail if the assertion fails.
 * 
 * @param expectedStr Expected string to be present in HTML
 */
async function assertPageContainsString(expectedStr) {
    await page.waitFor('div.body');

    const html = await page.evaluate(() => document.body.innerHTML, { waitUntil: 'domcontentloaded' });

    expect(html.includes(expectedStr)).toBe(true);
}

/**
 * Asserts that string is not present in the body element of the page.
 * The testing function that calls this function will fail if the assertion fails.
 * 
 * @param expectedStr Expected string to be present in HTML
 */
async function assertPageDoesNotContainString(expectedStr) {
    await page.waitFor('div.body');

    const html = await page.evaluate(() => document.body.innerHTML, { waitUntil: 'domcontentloaded' });

    expect(html.includes(expectedStr)).toBe(false);
}

/**
 * Asserts that page is located at given route.
 * The testing function that calls this function will fail if the assertion fails.
 * 
 * @param route Expected route to be located at
 */
function assertPageIsLocatedAtRoute(route) {
    expect(page.url()).toBe(route);
}


//// TEST SUITE UTILS ////

/**
 * Prepares new user session to be included in test.
 */
async function prepareNewSession() {
    resetDb();

    await page.goto(routes.logout, { waitUntil: 'domcontentloaded' });
}

/**
 * Function to start REST API
 */
function startApp() {
    exec('../minitwit-backend/control.sh start');
}

/**
 * Function to stop REST API
 */
function stopApp() {
    exec('../minitwit-backend/control.sh stop');
}

/**
 * Function to wipe SQLite DB and initialize it with no data
 */
function resetDb() {
    exec('rm -rf /tmp/minitwit.db && ../minitwit-backend/control.sh init');
}
