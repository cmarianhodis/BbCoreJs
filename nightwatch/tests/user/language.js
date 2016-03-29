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
 * User language tests
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Flavia Fodor <flavia.fodor@lp-digital.fr>
 */

// variable used to test if a refresh is done
var testRefreshClass = 'testRefreshClass';

var verifyCorrectLanguage = function (client, self) {
    'use strict';

    client.getLocalStorage('locale', function (result) {
        client
            .openUserDropDown()
            .getAttribute(self.userSettingsSection.elements.languageActive.selector, 'data-locale', function (element) {
                client.assert.equal(result.value, element.value);
            });
    });
};

module.exports = {
   /**
    * Before doing the tests, login into the backend
    * 
    * @param {Object} client
    * @returns {undefined}
    */
    before: function (client) {
        'use strict';

        client.login();

        // initialize object and sections
        this.toolbarObject = client.page.toolbar();
        this.toolbarSection = this.toolbarObject.section.toolbar;
        this.userSettingsSection = this.toolbarSection.section.userSettings;
    },

    /**
     * Reclick on the same language -> The toolbar doesn't change the dropdown list closes
     *
     * @param {Object} client
     * @returns {undefined}
     */
    'Test clicking on the same laguage': function (client) {
        'use strict';

        var self = this;

        // click on the same language ---> The toolbar doesn't change and the dropdown list closes
        client
            .pause(client.globals.loadTime.toolbar)
            .windowSetClassOnElement('', testRefreshClass)
            .openUserDropDown()
            .click(this.userSettingsSection.elements.languageActive.selector)
            .expect.element('body').to.have.attribute('class').which.contains(testRefreshClass);
        client.waitForElementNotPresent(self.userSettingsSection.elements.dropDownOpen.selector, client.globals.loadTime.defaultWait);
        // verify the correct language
        verifyCorrectLanguage(client, self);
    },

    /**
     * Click on a language -> The toolbar will refresh and appear in the selected language , the dropdown list closed
     *
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click on languages': function (client) {
        'use strict';

        var self = this;

        client
            //set class on body in order to verify if it refreshs
            .windowSetClassOnElement('', testRefreshClass)
            .expect.element('body').to.have.attribute('class').which.contains(testRefreshClass);
        // click on the user drop down in order to select the language
        client
            .openUserDropDown()
            .pause(client.globals.loadTime.defaultWait)
            .waitForElementPresent(self.userSettingsSection.elements.dropDownOpen.selector, client.globals.loadTime.defaultWait, false)
            //click on the non-active langauge
            .click(this.userSettingsSection.elements.languageNotActive.selector)
            //expect toolbar to load
            .pause(client.globals.loadTime.toolbar)
            //verify if the tollbar is loaded => it does not contain testRefreshClass
            .expect.element('body').to.not.have.attribute('class').which.contains(testRefreshClass);
            //verify if dropdown list is closed
        client.waitForElementNotPresent(self.userSettingsSection.elements.dropDownOpen.selector, client.globals.loadTime.defaultWait, false);
        //verify if the toolbar appears in the selected language
        verifyCorrectLanguage(client, self);
    },

    /**
     * After all tests are done logout and close browser
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    after: function (client) {
        'use strict';

        client
            .logout()
            .end();
    }
};



