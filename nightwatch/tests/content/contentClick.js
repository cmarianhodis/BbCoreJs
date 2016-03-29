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
 * Content click test
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

module.exports = {
    /**
     * Before doing the tests login into the backend and initialize objects
     *
     * @param {Object} client
     * @returns {undefined}
     */
    before: function (client) {
        'use strict';

        // login and wait the page tree popin to load
        client
            .login()
            .pause(client.globals.loadTime.toolbar);

        // initialize the objects
        this.contentObject = client.page.content();
        this.sections = this.contentObject.section;
        this.toolbarObject = client.page.toolbar();
        this.pageTreeObject = client.page.tree();
        // close the page tree popin
        this.pageTreeObject.section.pageTreeDialog.click('@closePopinButton');
        // make sure to be on the blocks tab
        this.toolbarObject.section.toolbar.section.tabs.click('@tabBlocksLink');
        client.pause(client.globals.loadTime.defaultWait);
    },

    /**
     * Test ContentSet border and plugins
     * Checks if after clicking a ContentSet the border and the plugins appear
     *
     * @param {Object} client
     * @returns {undefined}
     * 
     */
    'Test ContentSet border and plugins': function (client) {
        'use strict';

        // scroll to the location of the contentSet
        client.getLocation(this.sections.contentSet.selector, function (location) {
            client.execute('scrollTo(0,' + (location.value.y - 250) + ')');
        });
        // tests for contentSet section
        this.contentObject.testSection('contentSet');
        client
            .click(this.sections.contentSet.selector)
            .pause(client.globals.loadTime.defaultWait);
        this.contentObject
                .testCss(this.sections.contentSet.selector, 'box-shadow')
                .testSection('plugins', this.sections.contentSet)
                .testSectionElements(this.sections.contentSet.section.plugins);
    },

    /**
     * Test Content border and plugins
     * Checks if after clicking a Content the border and the plugins appear
     *
     * @param {Object} client
     * @returns {undefined}
     */
    'Test Content border and plugins': function (client) {
        'use strict';

        // scroll to the location of the content
        client.getLocation(this.sections.content.selector, function (location) {
            client.execute('scrollTo(0,' + (location.value.y - 250) + ')');
        });
        // tests for content section
        this.contentObject.testSection('content');
        client
            .click(this.sections.content.selector)
            .pause(client.globals.loadTime.defaultWait);
        this.contentObject
            .testCss(this.sections.content.selector, 'box-shadow')
            .testSection('plugins', this.sections.content)
            .testSectionElements(this.sections.content.section.plugins);
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