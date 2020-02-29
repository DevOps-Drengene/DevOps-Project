const puppeteer = require('puppeteer');

const defaultTimeoutTime = 10000; // 10 seconds

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
    browser = await puppeteer.launch({ headless: true }); // If headless = true then tests are run in UI browser (Chromium), else it is running as a background process (headless - only possible in CI pipeline)
    page = await browser.newPage();
});

describe('Test register', () => {
    async function testRegisterForm(formData, stringAssert, locationAssert) {
        await registerOnPage(formData);
        await waitForFormSubmissionToFinish();

        await stringAssert();
        locationAssert();
    }

    test('User can register with valid information', async () => {
        await testRegisterForm(
            mapDefaultUserToRegisterForm(),
            async () => null,
            () => assertPageIsLocatedAtRoute(routes.login)
        );        
    }, defaultTimeoutTime);

    test('User cannot register when submitted username is already taken', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.username = defaultUser.username; // Was submitted in previous test

        await testRegisterForm(
            formData,
            async () => await assertPageContainsString('The username is already taken'),
            () => assertPageIsLocatedAtRoute(routes.register)
        );
    }, defaultTimeoutTime);

    test('User cannot register when submitted username is blank', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.username = '';

        await testRegisterForm(
            formData,
            async () => await assertPageContainsString('You must fill out all fields'),
            () => assertPageIsLocatedAtRoute(routes.register)
        );
    }, defaultTimeoutTime);

    test('User cannot register when submitted password is blank', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.password = '';

        await testRegisterForm(
            formData,
            async () => await assertPageContainsString('You must fill out all fields'),
            () => assertPageIsLocatedAtRoute(routes.register)
        );
    }, defaultTimeoutTime);

    test('User cannot register when the two submitted passwords do not match', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.password2 = 'dittokiddo';

        await testRegisterForm(
            formData,
            async () => await assertPageContainsString('Passwords do not match'),
            () => assertPageIsLocatedAtRoute(routes.register)
        );
    }, defaultTimeoutTime);

    test('User cannot register when the submitted email is not valid', async () => {
        const formData = mapDefaultUserToRegisterForm();
        formData.username = 'new-user'; // New username
        formData.email = 'broken';

        await testRegisterForm(
            formData,
            async () => await assertPageContainsString('You have to enter a valid email address'),
            () => assertPageIsLocatedAtRoute(routes.register)
        );
    }, defaultTimeoutTime);
});

describe('Test login and logout', () => {
    async function testLoginForm(formData, stringAssert, locationAssert) {
        await loginOnPage(formData);
        await waitForFormSubmissionToFinish();

        await stringAssert();
        locationAssert();
    }

    test('User can log in with valid information', async () => {
        await testLoginForm(
            mapDefaultUserToLoginForm(),
            async () => null,
            () => assertPageIsLocatedAtRoute(routes.base)
        );
    }, defaultTimeoutTime);

    test('User can log out', async () => {
        await page.goto(routes.logout, { waitUntil: 'domcontentloaded' });

        assertPageIsLocatedAtRoute(routes.logout);
    }, defaultTimeoutTime);

    test('User cannot login with invalid password', async () => {
        const formData = mapDefaultUserToLoginForm();
        formData.password = 'wrongpassword';

        await testLoginForm(
            formData,
            async () => await assertPageContainsString('That did not work. Try again.'),
            () => assertPageIsLocatedAtRoute(routes.login)
        );
    }, defaultTimeoutTime);

    test('User cannot login with invalid username', async () => {
        const formData = mapDefaultUserToLoginForm();
        formData.username = 'user2';

        await testLoginForm(
            formData,
            async () => await assertPageContainsString('Unknown user'),
            () => assertPageIsLocatedAtRoute(routes.login)
        );
    }, defaultTimeoutTime);
});

describe('Test message recording', () => {
    beforeAll(async () => {
        await loginOnPage(mapDefaultUserToLoginForm());
        await page.waitForNavigation();
    });

    test('User can add message', async () => {
        const message = 'test message 1';
        await addMessage(message);

        await assertPageContainsString(message);
    }, defaultTimeoutTime);
});

describe('Test timelines', () => {
    const user2 = {
        username: 'user2',
        email: 'user@example.com',
        password: 'default2'
    };

    const defaultUserMessage = 'the message by default user';
    const user2Message = 'the message by user 2';

    beforeAll(async () => {
        // Default user logs in and adds a message
        await loginOnPage(mapDefaultUserToLoginForm());
        await page.waitForNavigation();
        await addMessage(defaultUserMessage);

        // User 2 registers, logs in, adds a message, and remains logged in for the rest of the tests
        await registerAndLoginUser(user2);
        await addMessage(user2Message);
    }, defaultTimeoutTime);

    test('Added messages in visible on public timeline', async () => {
        await page.goto(routes.public, { waitUntil: 'networkidle0' });

        await assertPageContainsString(defaultUserMessage);
        await assertPageContainsString(user2Message);
    }, defaultTimeoutTime);

    test('User 2\'s timeline should only show user 2\'s message', async () => {
        await page.goto(routes.profile(user2.username), { waitUntil: 'networkidle0' });

        await assertPageContainsString(user2Message);
        await assertPageDoesNotContainString(defaultUserMessage);
    }, defaultTimeoutTime);

    test('Default user\'s message is on user 2\'s timeline after follow', async () => {
        // Go to default's user profile via the public timeline
        await loginOnPage(mapUserToLoginForm(user2));
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        await page.$eval(`a[href="/public"]`, async (el) => await el.click());
        await page.waitForSelector(`a[href="/${defaultUser.username}"]`);
        await page.$eval(`a[href="/${defaultUser.username}"]`, async (el) => await el.click());

        // Follow profile
        await page.waitForSelector('.followstatus');
        await page.$eval('.followstatus button', async (el) => await el.click());
        await page.waitFor(500);

        await assertPageContainsString('You are currently following this user');

        // Go to user 2's "my timeline" and assert the default user's messages is shown on the timeline
        await page.$eval(`a[href="/"]`, async (el) => await el.click());
        await page.waitForSelector(`a[href="/${defaultUser.username}"]`);

        await assertPageContainsString(defaultUserMessage);
    }, defaultTimeoutTime);

    test('Profile timelines only contain user\'s message', async () => {
        // Go to default user's profile and assert only his/hers message is there as the only one
        await page.goto(routes.profile(defaultUser.username), { waitUntil: 'networkidle0' });
        
        await assertPageContainsString(defaultUserMessage);
        await assertPageDoesNotContainString(user2Message);

        // Go to user 2's profile and assert only his/hers message is there as the only one
        await page.goto(routes.profile(user2.username), { waitUntil: 'networkidle0' });
        
        await assertPageContainsString(user2Message);
        await assertPageDoesNotContainString(defaultUserMessage);
    }, defaultTimeoutTime);

    test('Default user\'s message is not on user 2\'s timeline after unfollow', async () => {
        // Go to default's user profile via the public timeline
        await loginOnPage(mapUserToLoginForm(user2));
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        await page.$eval(`a[href="/public"]`, async (el) => await el.click());
        await page.waitForSelector(`a[href="/${defaultUser.username}"]`);
        await page.$eval(`a[href="/${defaultUser.username}"]`, async (el) => await el.click());

        // Unfollow profile
        await page.waitForSelector('.followstatus');
        await page.$eval('.followstatus button', async (el) => await el.click());
        await page.waitFor(500);

        await assertPageContainsString('You are not yet following this user');

        // Go to user 2's "my timeline" and assert the default user's messages is NOT shown on the timeline
        await page.$eval(`a[href="/"]`, async (el) => await el.click());
        await page.waitForSelector(`a[href="/${user2.username}"]`);

        await assertPageDoesNotContainString(defaultUserMessage);
    }, defaultTimeoutTime);
});

afterAll(async () => {
    await page.close();
    await browser.close();
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

/**
 * Wait until the network form submission API call has been completed 
 */
async function waitForFormSubmissionToFinish() {
    // Whatever finishes first
    await Promise.race([
        page.waitForSelector("div.error"),                    // Error shown on screen
        page.waitForNavigation({ waitUntil: "networkidle0" }) // API call done
    ]);
}
