/**
 * Copyright (c) 2011-2016 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Tests for login in BackBee
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var openLoginPopin = function (client) {
    'use strict';

    client
        .waitForElementPresent('body', client.globals.loadTime.body)
        .openLoginPopin();
};

var fillLoginForm = function (client, loginSection, username, password) {
    'use strict';

    loginSection
        .waitForElementVisible(loginSection.selector, client.globals.loadTime.loginPopin)
        .assert.elementPresent('@username')
        .setValue('@username', username)
        .assert.elementPresent('@password')
        .setValue('@password', password)
        .assert.elementPresent('@submit')
        .click('@submit');
};

var testRefreshClass = 'testRefresh';

module.exports = {
    /**
     * Set some usefull global variables
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    before : function (client) {
        'use strict';

        this.loginObject = client.page.login();
        this.loginSection = this.loginObject.section.login;
        this.loginData = client.globals.login;

        client.openUrl(client.globals.baseUrl);
    },

    /**
     * Test open / close login popin
     * 
     * Checks:
     * 1. The login popin appears
     * 2. When the login popin is closed the page refreshes
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test open / close login popin' : function (client) {
        'use strict';

        // Open the login popin
        openLoginPopin(client);

        // Check if the login popin appears
        this.loginObject.expect.section('@login').to.be.visible.after(client.globals.loadTime.loginPopin);

        // Set class on body tag to check the page refresh on closing the login popin
        client
            .windowSetClassOnElement('', testRefreshClass)
            .closeLoginPopin()
            .pause(client.globals.loadTime.defaultWait)
            .expect.element('body').to.not.have.attribute('class').which.contains(testRefreshClass);
    },

    /**
     * Test login with a fake user
     * 
     * Checks: 
     * 1. The user is not logged in
     * 2. The error message appears
     * 
     * @param {type} client
     * @returns {undefined}
     */
    'Test login with a fake user' : function (client) {
        'use strict';

        var loginSection = this.loginObject.section.login;

        // Open the login popin
        openLoginPopin(client);

        // Fill in the login form with the fake user data
        fillLoginForm(client, loginSection, this.loginData.fakeUser.username, this.loginData.fakeUser.password);

        // Check that user is not logged in
        client
            .pause(client.globals.loadTime.defaultWait)
            .getLocalStorage('bb-session-auth', function (result) {
                this.assert.ok(result.value === null, 'Check if failed login');
            });

        // Check if the error message is displayed
        loginSection
            .waitForElementVisible('@error', client.globals.loadTime.errorDisplay)
            .assert.elementPresent('@error')
            .getText(loginSection.elements.error.selector, function (result) {
                this.assert.ok(result.value.length > 0, 'Check if error message is displayed');
            });
    },

    /**
     * Test login / logout with a real user
     * Checks:
     * 1. The user is logged in
     * 2. The page is refreshed
     * 3. The toolbar is present
     * 4. The user is logged out
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test login / logout with a real user' : function (client) {
        'use strict';

        var toolbarSection = this.loginObject.section.toolbar,
            userSettingsSection = toolbarSection.section.userSettings;

        // Open the login popin
        openLoginPopin(client);

        // Set class on body element
        client.windowSetClassOnElement('', testRefreshClass);

        // Fill in the login form with the real user data
        fillLoginForm(client, this.loginSection, this.loginData.realUser.username, this.loginData.realUser.password);

        // Check if the page is refreshed
        client
            .pause(client.globals.loadTime.toolbar)
            .expect.element('body').to.not.have.attribute('class').which.contains(testRefreshClass);

        // Check if succesfull login
        client.getLocalStorage('bb-session-auth', function (result) {
            this.assert.ok(result.value !== null, 'Check if successfull login');
        });

        // Check if toolbar is present
        toolbarSection.assert.elementPresent(toolbarSection.selector);

        // Set class on body element before logout to test if the page refresh
        client.windowSetClassOnElement('', testRefreshClass);

        // Simulate logout
        userSettingsSection
            .assert.elementPresent('@topMostLogin')
            .click('@topMostLogin')
            .assert.elementPresent('@logout')
            .click('@logout');

        // Check if successfull logout
        client
            .pause(client.globals.loadTime.logout)
            .getLocalStorage('bb-session-auth', function (result) {
                this.assert.ok(result.value === null, 'Check if successfull logout');
            });

        // Check if toolbar is not present
        toolbarSection.assert.elementNotPresent(toolbarSection.selector);

        // Check if the page is refreshed after logout
        client
            .pause(client.globals.loadTime.toolbar)
            .expect.element('body').to.not.have.attribute('class').which.contains(testRefreshClass);
    },

    /**
     * After all tests are ran we end the client
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    after : function (client) {
        'use strict';

        client.end();
    }
};