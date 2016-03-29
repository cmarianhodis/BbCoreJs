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
 * Tests for media library popin in BackBee
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Bogdan Oanes <bogdan.oanes@lp-digital.fr>
 */

var randomNumber = Math.floor((Math.random() * 1000) + 1);

module.exports = {
    /**
     * Login in BackBee and set some usefull global variables
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    before: function (client) {
        'use strict';

        // Login in BackBee
        client
            .windowMaximize()
            .login()
            .pause(client.globals.loadTime.toolbar);

        // Instantiate the necessary objects
        this.mediaLibraryObject = client.page.mediaLibrary();
        this.contextMenuSection = this.mediaLibraryObject.section.contextMenu;
        this.inlineEditSection = this.mediaLibraryObject.section.inlineEdit;
        this.formMediaImageSection = this.mediaLibraryObject.section.formMediaImage;
        this.mediaPreviewSection = this.mediaLibraryObject.section.mediaPreview;
        this.deletePopinSection = this.mediaLibraryObject.section.deletePopin;
        this.actionsDropdownSection = this.mediaLibraryObject.section.actionsDropdown;

        // Generate tests page names
        this.folderName = client.globals.mediaLibrary.names.folder + ' ' + randomNumber;
        this.imageName = client.globals.mediaLibrary.names.image + ' ' + randomNumber;
        this.pdfName = client.globals.mediaLibrary.names.pdf + ' ' + randomNumber;
    },

    /**
     * Wait before each test
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    beforeEach: function (client) {
        'use strict';

        client.pause(client.globals.loadTime.defaultWait);
    },

    /** 
     * Test the opening of media library popin
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test open media library': function (client) {
        'use strict';

        // Click the media library button and assert the visibility of the media library popin
        this.mediaLibraryObject
            .waitForElementVisible('@openMediaLibraryButton', client.globals.loadTime.longWait)
            .click('@openMediaLibraryButton');

        client.pause(client.globals.loadTime.longWait);

        this.mediaLibraryObject.assert.visible('@mediaLibrary');
    },

    /**
     * Click on another area when the popin is open and test that this doesn't close the popin
     * 
     * @returns {undefined}
     */
    'Test if clicking on another area doens\'t close the popin': function () {
        'use strict';

        // Click on overlay to check if popin closes
        this.mediaLibraryObject
            .assert.visible('@overlay')
            .click('@overlay')
            .assert.visible('@mediaLibrary');

        this.mediaLibraryObject
            .click('@mediaLibrary');
    },

   /**
     * Test click actions dropdown menu - Open/Close
     * 
     * @returns {undefined}
     */
    'Test click on actions dropdown menu (Open/Close)': function () {
        'use strict';

        // Open dropdown
        this.actionsDropdownSection
            .click('@toggleButton')
            .assert.visible('@add')
            .assert.visible('@edit')
            .assert.visible('@image')
            .assert.visible('@pdf');

        // Close on a new click
        this.actionsDropdownSection
            .click('@toggleButton')
            .assert.hidden('@add')
            .assert.hidden('@edit')
            .assert.hidden('@image')
            .assert.hidden('@pdf');
    },

    /**
     * Test selected state of a folder on click
     * 
     * @returns {undefined}
     */
    'Test selected state of a folder when clicked': function () {
        'use strict';

        // Click on second node to validate the selected state
        this.mediaLibraryObject
            .click('@secondChildNode')
            .expect.element('@secondChildNode').to.have.css('background-image', 'Check if the clicked page has a selected state');
    },

    /**
     * Test right click on folder opens context menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test right click on page opens context menu': function (client) {
        'use strict';

        this.mediaLibraryObject
            .click('@firstChildNode');
        // Move mouse on first element in tree and right click to show the contextual menu
        client
            .useXpath()
            .moveToElement(this.mediaLibraryObject.elements.firstChildNode.selector, 2, 2)
            .mouseButtonClick('right');

        this.mediaLibraryObject
            .expect.section('@contextMenu').to.be.visible.before(client.globals.loadTime.defaultWait);
    },

    /**
     * Test click on create new folder
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create new folder': function (client) {
        'use strict';

        this.contextMenuSection.click('@addButton');

        this.inlineEditSection
            .assertElementsPresent()
            .createFolder(this.folderName);

        this.mediaLibraryObject
            .waitForElementVisible('@lastChildNode', client.globals.loadTime.mediumWait)
            .assert.containsText('@lastChildNode', this.folderName);
    },

    /**
     * Test access to media folder on double click
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test access to media folder on double click': function (client) {
        'use strict';

        var self = this;

        // Check if double click on a tree element refreshes the media library
        client.moveToElement(self.mediaLibraryObject.elements.lastChildNode.selector, 1, 1)
            .doubleClick()
            .pause(client.globals.loadTime.mediumWait)
            .getText(self.mediaLibraryObject.elements.mediaCenterFolder.selector, function (result) {
                this.assert
                    .containsText(self.mediaLibraryObject.elements.lastChildNode.selector, result.value);
            });
    },

   /**
     * Test edit folder
     * 
     * @returns {undefined}
     */
    'Test edit folder': function () {
        'use strict';

        this.contextMenuSection
            .runNodeAction(this.mediaLibraryObject.elements.lastChildNode.selector, '@editButton');

        this.inlineEditSection
            .assertElementsPresent()
            .click('@closeBtn');
    },

    /**
     * Test cut folder - on the last child in tree (The new created folder)
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test cut folder': function (client) {
        'use strict';

        this.contextMenuSection
            .runNodeAction(this.mediaLibraryObject.elements.lastChildNode.selector, '@cutButton');

        client.pause(client.globals.loadTime.mediumWait);

        this.mediaLibraryObject
            .waitForElementVisible('@actionSelectedNode', client.globals.loadTime.mediumWait)
            .expect.element('@actionSelectedNode').to.have.css('color', 'Check if the cutted page has a selected state');

        client.moveToElement(this.mediaLibraryObject.elements.secondChildNode.selector, 0, 0)
                .mouseButtonClick('right');

        this.contextMenuSection
            .expect.element('@pasteButton').to.be.visible.before(client.globals.loadTime.defaultWait);
    },

    /**
     * Test required fields on create new media image 
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test required fields on create new media image': function (client) {
        'use strict';

        this.mediaLibraryObject
            .assert.visible('@overlay')
            .click('@overlay');

        this.contextMenuSection
            .runNodeAction(this.mediaLibraryObject.elements.lastChildNode.selector, '@createMediaImage');

        // Force popin on top
        client
            .useXpath()
            .waitForElementVisible(this.formMediaImageSection.selector, client.globals.loadTime.longWait)
            .moveToElement(this.formMediaImageSection.selector, 0, 0)
            .mouseButtonClick('left');

        this.formMediaImageSection
            .waitForElementVisible('@titleField', client.globals.loadTime.longWait)
            .click('@saveBtn')
            .assert.visible('@errorTitleField');
    },

    /**
     * Test remove media from form
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test remove media from form': function (client) {
        'use strict';

        client
            .dropFile(0, 'dz-hidden-input', client.globals.mediaLibrary.files.image)
            .pause(client.globals.loadTime.mediumWait);

        this.formMediaImageSection
            .waitForElementVisible('@dropzone', client.globals.loadTime.mediumWait)
            .waitForElementVisible('@removeBtn', client.globals.loadTime.mediumWait)
            .click('@removeBtn')
            .expect.element('@previewWrapper').to.not.be.present.after(client.globals.loadTime.mediumWait);
    },

    /**
     * Test create new media image picture
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create new media image picture': function (client) {
        'use strict';

        client
            .dropFile(0, 'dz-hidden-input', client.globals.mediaLibrary.files.image)
            .pause(client.globals.loadTime.mediumWait);

        this.formMediaImageSection
            .assert.visible('@previewWrapper')
            .setValue('@titleField', this.imageName)
            .click('@saveBtn');

        this.mediaPreviewSection
            .waitForElementVisible('@titleWrapper', client.globals.loadTime.longWait)
            .assert.containsText('@titleWrapper', this.imageName)
            .assert.visible('@pictureWrapper')
            .assert.visible('@seeButton')
            .assert.visible('@editButton')
            .assert.visible('@deleteButton');
    },

    /**
     * Test see button on media preview
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click see button': function (client) {
        'use strict';

        this.mediaPreviewSection
            .click('@seeButton');

        this.mediaLibraryObject
            .waitForElementVisible('@seePopinPictureWrapper', client.globals.loadTime.longWait)
            .assert.visible('@seePopinPictureWrapper');
        client.useXpath();
        this.mediaLibraryObject.click('@seePopinPictureDialogClose');
        client.useCss();
    },

    /**
     * Test edit button on media preview
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click edit button': function (client) {
        'use strict';

        this.mediaPreviewSection
            .click('@editButton');

        // Force popin on top
        client
            .useXpath()
            .waitForElementVisible(this.formMediaImageSection.selector, client.globals.loadTime.longWait)
            .moveToElement(this.formMediaImageSection.selector, 0, 0)
            .mouseButtonClick('left');

        this.formMediaImageSection
            .waitForElementVisible('@titleField', client.globals.loadTime.longWait)
            .assertElementsPresent()
            .click('@closeBtn');
    },

    /**
     * Test delete button on media preview
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click delete button': function (client) {
        'use strict';

        this.mediaPreviewSection
            .click('@deleteButton');

        this.deletePopinSection
            .waitForElementVisible('@yesBtn', client.globals.loadTime.longWait)
            .waitForElementVisible('@noBtn', client.globals.loadTime.longWait)
            .assert.visible('@yesBtn')
            .assert.visible('@noBtn')
            .click('@yesBtn');

        this.mediaPreviewSection
            .waitForElementNotPresent('@pictureWrapper', client.globals.loadTime.longWait)
            .assert.elementNotPresent('@pictureWrapper');
    },

    /**
     * Test required field on create pdf media form
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test required field on create pdf media form': function (client) {
        'use strict';

        this.contextMenuSection
            .runNodeAction(this.mediaLibraryObject.elements.lastChildNode.selector, '@createMediaPdf');

        // Force popin on top
        client
            .pause(client.globals.loadTime.mediumWait)
            .useXpath()
            .waitForElementVisible(this.formMediaImageSection.selector, client.globals.loadTime.longWait)
            .moveToElement(this.formMediaImageSection.selector, 0, 0)
            .mouseButtonClick('left')
            .pause(client.globals.loadTime.longWait);

        this.formMediaImageSection
            .waitForElementVisible('@titleField', client.globals.loadTime.longWait)
            .click('@saveBtn')
            .assert.visible('@errorTitleField');
    },

    /**
     * Test create new media image pdf
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create new media pdf': function (client) {
        'use strict';

        client
            .dropFile(2, 'dz-hidden-input', client.globals.mediaLibrary.files.pdf)
            .pause(client.globals.loadTime.mediumWait);

        this.formMediaImageSection
            .waitForElementVisible('@dropzone', client.globals.loadTime.mediumWait)
            .assert.visible('@previewWrapper')
            .setValue('@titleField', this.pdfName)
            .click('@saveBtn');

        client.pause(client.globals.loadTime.longWait);

        this.mediaPreviewSection
            .waitForElementVisible('@titleWrapper', client.globals.loadTime.longWait)
            .assert.containsText('@titleWrapper', this.pdfName)
            .assert.visible('@pictureWrapper')
            .assert.visible('@seeButton')
            .assert.visible('@editButton')
            .assert.visible('@deleteButton');

        // Delete pdf for next tests
        this.mediaPreviewSection
            .click('@deleteButton');

        client.pause(client.globals.loadTime.mediumWait);

        this.deletePopinSection
            .assert.visible('@yesBtn')
            .assert.visible('@noBtn')
            .click('@yesBtn');
    },

    /**
     * Test create folder from actions dropdown
     * 
     * @returns {undefined}
     */
    'Test create folder - actions dropdown': function () {
        'use strict';

        // Open actions dropdown and click add button
        this.actionsDropdownSection
            .click('@toggleButton')
            .click('@add');

        // Check if input and buttons are present
        this.inlineEditSection
            .assertElementsPresent()
            .click('@closeBtn');
    },

    /**
     * Test edit foldername from actions dropdown
     * 
     * @returns {undefined}
     */
    'Test edit - actions dropdown': function () {
        'use strict';

        // Open actions dropdown and click edit button
        this.actionsDropdownSection
            .click('@toggleButton')
            .click('@edit');

        // Check if input and buttons are present
        this.inlineEditSection
            .assertElementsPresent()
            .click('@closeBtn');
    },

    /**
     * Test create media picture from actions dropdown
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create media picture - actions dropdown': function (client) {
        'use strict';

        this.actionsDropdownSection
            .click('@toggleButton')
            .click('@image');

        // Force popin on top
        client
            .pause(client.globals.loadTime.mediumWait)
            .useXpath()
            .waitForElementVisible(this.formMediaImageSection.selector, client.globals.loadTime.longWait)
            .moveToElement(this.formMediaImageSection.selector, 0, 0)
            .mouseButtonClick('left');

        this.formMediaImageSection
            .waitForElementVisible('@titleField', client.globals.loadTime.longWait)
            .click('@saveBtn')
            .assert.visible('@errorTitleField')
            .click('@closeBtn');
    },

    /**
     * Test create media pdf from actions dropdown
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create media pdf - actions dropdown': function (client) {
        'use strict';

        this.actionsDropdownSection
            .click('@toggleButton')
            .click('@pdf');

        // Force popin on top
        client
            .pause(client.globals.loadTime.mediumWait)
            .useXpath()
            .waitForElementVisible(this.formMediaImageSection.selector, client.globals.loadTime.longWait)
            .moveToElement(this.formMediaImageSection.selector, 0, 0)
            .mouseButtonClick('left');

        this.formMediaImageSection
            .waitForElementVisible('@titleField', client.globals.loadTime.longWait)
            .click('@saveBtn')
            .assert.visible('@errorTitleField')
            .click('@closeBtn');
    },

   /**
     * Test delete folder
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test delete folder': function (client) {
        'use strict';

        var self = this;

        client.moveToElement(self.mediaLibraryObject.elements.lastChildNode.selector, 0, 0)
                .mouseButtonClick('right');

        this.mediaLibraryObject
            .assert.containsText('@lastChildNode', this.folderName)
            .section.contextMenu.click('@removeButton');
        client.pause(client.globals.loadTime.mediumWait);

        this.mediaLibraryObject
            .waitForElementVisible(self.mediaLibraryObject.elements.lastChildNode.selector, client.globals.loadTime.mediumWait)
            .expect.element(self.mediaLibraryObject.elements.lastChildNode.selector).text.to.not.contain(this.folderName);
    },

    /** 
     * Test the closing of media library popin
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test close media library popin': function (client) {
        'use strict';

        this.mediaLibraryObject
            .assert.visible('@closePopinButton')
            .click('@closePopinButton')
            .expect.element('@mediaLibrary').to.not.be.visible.after(client.globals.loadTime.mediumWait);
    },

    /**
     * After all tests are ran we end the client
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