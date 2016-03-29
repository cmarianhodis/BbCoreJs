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
 * Tests for page tree popin in BackBee
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var randomNumbersFor = {
        tests: Math.floor((Math.random() * 1000) + 1),
        testsContextMenu: Math.floor((Math.random() * 1000) + 1),
        testsEditContextMenu: Math.floor((Math.random() * 1000) + 1),
        testsActionsMenu: Math.floor((Math.random() * 1000) + 1),
        testsEditActionsMenu: Math.floor((Math.random() * 1000) + 1)
    },
    testsPageNameTreeElement = '//div[@class="bb5-treeview"]/ul/li/ul/li/div/span[text()="pagenamehere"]';

module.exports = {
    /**
     * Login in BackBee and set some usefull global variables
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    before: function (client) {
        'use strict';

        var self = this;

        // login in BackBee
        client
            .login()
            .pause((client.globals.loadTime.toolbar + client.globals.loadTime.longWait));

        // instantiate the necessary page objects
        this.pageTreeObject = client.page.tree();
        this.pagePopinsObject = client.page.popins();
        // make sure page tree is opened
        this.pageTreeObject.click('@openPageTreeButton');
        client.pause(client.globals.loadTime.pageTree.loadPopin);
        // instantiate the necessary sections of page tree
        this.pageTreeDialogSection = this.pageTreeObject.section.pageTreeDialog;
        this.treeViewSection = this.pageTreeObject.section.treeView;
        this.contextMenuSection = this.pageTreeObject.section.contextMenu;
        this.actionsMenuSection = this.pageTreeObject.section.actionsMenu;
        this.searchSection = this.pageTreeObject.section.search;
        // generate tests page names for all the required actions
        this.testsPageName = client.globals.pageTree.createNewPage + ' ' + randomNumbersFor.tests;
        this.testsPageNameTreeElement = testsPageNameTreeElement.replace('pagenamehere', this.testsPageName);
        this.testsPageNameContextMenu = client.globals.pageTree.createNewPage + ' ' + randomNumbersFor.testsContextMenu;
        this.testsPageNameActionsMenu = client.globals.pageTree.createNewPage + ' ' + randomNumbersFor.testsActionsMenu;
        // open context menu on home and click "Create"
        this.treeViewSection.moveMouseOnTreeElement(this.treeViewSection.elements.home.selector, function () {
            self.contextMenuSection.clickElementOnContextMenu('addButton');
        });
        // wait for the create page popin to load
        client.pause(client.globals.loadTime.pageTree.createPagePopin);
        // create a new page for tests
        this.pagePopinsObject.section.createPopin.createNewPage(this.testsPageName);
        // wait for the page to be created
        client.pause(client.globals.loadTime.pageTree.createPage);
        // refresh the page to make sure the page is correctly placed in tree
        client.refreshPage();
        // make sure page tree is opened
        this.pageTreeObject.click('@openPageTreeButton');
        client.pause(client.globals.loadTime.pageTree.loadPopin);
    },

    /**
     * Make sure page tree is open before each test
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    beforeEach: function (client) {
        'use strict';

        // make sure page tree is opened
        this.pageTreeObject.click('@openPageTreeButton');
        client.pause(client.globals.loadTime.pageTree.loadPopin);
    },

    /**
     * Test position of page tree popin
     * The position is based on x and y offsets
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test position of page tree popin': function (client) {
        'use strict';

        // check the visibility of the page tree popin
        this.pageTreeObject
            .waitForElementVisible('@pageTree', client.globals.loadTime.pageTree.loadPopin)
            // get the page tree popin position and compare the offsets
            .getLocation(this.pageTreeObject.elements.pageTree.selector, function (location) {
                this.assert.ok(
                    location.value.x < client.globals.pageTree.position.x && location.value.y < client.globals.pageTree.position.y,
                    'Check page tree popin position to be top left'
                );
            });
    },

    /**
     * Click on another area when the popin is open and test that this doesn't close the popin
     * 
     * @returns {undefined}
     */
    'Test if clicking on another area does not close the popin': function () {
        'use strict';

        // page tree popin is opened from previous test, click on BackBee image and test if page tree is still opened
        this.pageTreeObject
            .click('@navBarBrand')
            .assert.visible('@pageTree');
    },

    /**
     * Move, close then reopen page tree popin and check that position of popin is the same
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Move, close and reopen page tree popin and check that position of popin is the same': function (client) {
        'use strict';

        var self = this;

        // test if the page tree dialog and the close button are visible
        this.pageTreeObject.expect.section('@pageTreeDialog').to.be.visible.before(client.globals.loadTime.defaultWait);
        this.pageTreeDialogSection.assert.visible('@closePopinButton');
        client
            // move the popin to a new position
            .moveToElement(this.pageTreeDialogSection.selector, 5, 5)
            .mouseButtonDown('left')
            .moveToElement('body', 150, 150)
            .mouseButtonUp('left')
            // get the location of the popin before closing
            .getLocation('css selector', this.pageTreeDialogSection.selector, function (locationBeforeClosing) {
                //  close popin
                self.pageTreeDialogSection.click('@closePopinButton');
                // reopen popin
                self.pageTreeObject
                    .click('@openPageTreeButton')
                    // get the location of the popin after reopening
                    .getLocation('css selector', self.pageTreeDialogSection.selector, function (locationAfterReopening) {
                        // test x and y offsets of the two locations to be equal
                        this.assert.ok(
                            locationBeforeClosing.value.x === locationAfterReopening.value.x && locationBeforeClosing.value.y === locationAfterReopening.value.y,
                            'Check page tree popin keeps location after the move and closure'
                        );
                    });
            });
    },

    /**
     * Test the folder only checkbox
     * 
     * @returns {undefined}
     */
    'Test the folder only checkbox': function () {
        'use strict';

        this.pageTreeObject
            .clickShowFolderCheckbox()
            .checkShowFolderCheckboxCheckedResults()
            .clickShowFolderCheckbox()
            .checkShowFolderCheckboxNotCheckedResults();
    },

    /**
     * Test drag and drop page at same level shows position
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test drag and drop page at same level shows position': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .waitForElementVisible(this.testsPageNameTreeElement, client.globals.loadTime.defaultWait, function () {
                client.moveToElement(self.testsPageNameTreeElement, 0, 0);
            })
            .mouseButtonDown('left')
            .pause(client.globals.loadTime.defaultWait)
            .useCss()
            .waitForElementVisible(this.treeViewSection.elements.lastItem.selector, client.globals.loadTime.defaultWait, function () {
                client.element('css selector', self.treeViewSection.elements.lastItem.selector, function (result) {
                    client.elementIdSize(result.value.ELEMENT, function (size) {
                        client.moveToElement(self.treeViewSection.elements.lastItem.selector, 0, size.value.height);
                    });
                });
            });
        // test that the ghost element appears and has background-color
        this.treeViewSection
            .assert.elementPresent('@ghostItem')
            .expect.element('@ghostItemLine').to.have.css('background-color', 'Check if drag page at same level shows position');
        // drag back the test page in the initial position and release the left mouse button
        client
            .useXpath()
            .waitForElementVisible(this.testsPageNameTreeElement, client.globals.loadTime.defaultWait, function () {
                client
                    .moveToElement(self.testsPageNameTreeElement, 0, 0)
                    .mouseButtonUp('left');
            });
    },

    /**
     * Test drag and drop page at another level shows position
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test drag and drop page at another level shows position': function (client) {
        'use strict';

        var self = this;

        // find the test page and drag over the last item of tree
        client
            .useXpath()
            .waitForElementVisible(this.testsPageNameTreeElement, client.globals.loadTime.defaultWait, function () {
                client.moveToElement(self.testsPageNameTreeElement, 0, 0);
            })
            .mouseButtonDown('left')
            .pause(client.globals.loadTime.defaultWait)
            .useCss()
            .waitForElementVisible(this.treeViewSection.elements.lastItem.selector, client.globals.loadTime.defaultWait, function () {
                client.moveToElement(self.treeViewSection.elements.lastItem.selector, 0, 5);
            });
        // check that the element is visible
        this.treeViewSection.assert.visible('@lastItemBorder', 'Check if drag page at another level shows position');
        // drag back the test page in the initial position and release the left mouse button
        client
            .useXpath()
            .waitForElementVisible(this.testsPageNameTreeElement, client.globals.loadTime.defaultWait, function () {
                client
                    .moveToElement(self.testsPageNameTreeElement, 0, 0)
                    .mouseButtonUp('left');
            });
    },

    /**
     * Test selected state of a page when clicked
     * 
     * @returns {undefined}
     */
    'Test selected state of a page when clicked': function () {
        'use strict';

        this.treeViewSection
            .click('@home')
            .expect.element('@home').to.have.css('background-image', 'Check if the clicked page has a selected state');
    },

    /**
     * Test double click on a page
     * Loading of the page that was double-clicked, the interface is on the "Edit" section and popin tree reappears in the same configuration
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test double click on a page does the redirect and the popin is open': function (client) {
        'use strict';

        var self = this;

        // get the old url
        client.url(function (oldUrl) {
            // find the test page and double click it
            client
                .useXpath()
                .moveToElement(self.testsPageNameTreeElement, 0, 0, function () {
                    client.doubleClick();
                })
                // wait for the refresh to be done
                .pause(client.globals.loadTime.toolbar)
                .url(function (currentUrl) {
                    // get the new url and check that is different then the old url
                    this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                });
            // test the page tree popin to be visible again
            self.pageTreeObject.expect.element('@pageTree').to.be.visible.after(client.globals.loadTime.pageTree.loadPopin);
        });
        // do a redirect to home
        this.treeViewSection.moveToElement('@home', 0, 0, function () {
            self.contextMenuSection.clickElementOnContextMenu('browseToButton');
        });
        client.pause(client.globals.loadTime.toolbar);
    },

    /**
     * Test right click on page opens context menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test right click on page opens context menu': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                client.mouseButtonClick('right');
                self.pageTreeObject.expect.section('@contextMenu').to.be.visible.before(client.globals.loadTime.defaultWait);
            });
    },

    /**
     * Test context menu on homepage
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test context menu on homepage': function (client) {
        'use strict';

        var self = this;

        client
            .useCss()
            .refreshPage()
            .element('css selector', this.treeViewSection.elements.home.selector, function (result) {
                client.moveTo(result.value.ELEMENT, 0, 0, function () {
                    client.mouseButtonClick('right');
                    self.pageTreeObject.expect.section('@contextMenu').to.be.visible.before(client.globals.loadTime.defaultWait);
                });
            });
        this.contextMenuSection.checkHomeDisplayedButtons();
    },

    /**
     * Test context menu after clicking on copy
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test context menu after clicking on copy': function (client) {
        'use strict';

        var self = this;

        client
            .useCss()
            .refreshPage()
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('copyButton');
                client.pause(client.globals.loadTime.minimumWait);
                self.treeViewSection.expect.element('@firstItem').to.have.css('outline-style', 'Check if the copied page has a dotted frame');
            })
            .useCss()
            .element('css selector', this.treeViewSection.elements.lastItem.selector, function (result) {
                client.moveTo(result.value.ELEMENT, 0, 0, function () {
                    client.mouseButtonClick('right');
                });
            });
        this.contextMenuSection.checkCopyDisplayedButtons();
    },

    /**
     * Test create button from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create button from contextual menu': function (client) {
        'use strict';

        var self = this;

        // find page and create a test sub page
        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('addButton');
            })
            .useCss();
        this.pagePopinsObject.expect.section('@createPopin').to.be.visible.after(client.globals.loadTime.pageTree.createPagePopin);
        client.pause(client.globals.loadTime.pageTree.createPagePopin);
        this.pagePopinsObject.section.createPopin.createNewPage(this.testsPageNameContextMenu);
        client.pause(client.globals.loadTime.pageTree.createPage);
        this.treeViewSection
            .waitForElementVisible('@selectedFolderItem', client.globals.loadTime.defaultWait)
            .click('@selectedFolderItem');
        client.pause(client.globals.loadTime.pageTree.waitForSubpagesToShow);
        // check if the page created before is the first subpage
        this.treeViewSection.getText('@selectedFolderItemChild', function (result) {
            self.treeViewSection.assert.ok(result.value === self.testsPageNameContextMenu, 'Check if the new created page is the first subpage');
        });
        // delete the created page
        client.element('css selector', this.treeViewSection.elements.selectedFolderItemChild.selector, function (result) {
            client.moveTo(result.value.ELEMENT, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('removeButton');
                client.pause(client.globals.loadTime.pageTree.deletePagePopin);
                self.pagePopinsObject.section.deletePopin.deletePage();
                client.pause(client.globals.loadTime.toolbar);
            });
        });
    },

    /**
     * Test edit button from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test edit button from contextual menu': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('editButton');
                // test if the page tree popin is still open
                self.pageTreeObject.assert.elementPresent('@pageTree');
            });
        // test if the edit page popin appears
        this.pagePopinsObject.expect.section('@editPopin').to.be.visible.after(client.globals.loadTime.pageTree.editPagePopin);
        client.pause(client.globals.loadTime.pageTree.editPagePopin);
        this.pagePopinsObject.section.editPopin.assertElementsPresent();
        // edit the test page and check that the edit was done succesfully
        this.testsPageName = client.globals.pageTree.createNewPage + ' ' + randomNumbersFor.testsEditContextMenu;
        this.testsPageNameTreeElement = testsPageNameTreeElement.replace('pagenamehere', this.testsPageName);
        this.pagePopinsObject.section.editPopin.editPage(this.testsPageName);
        client
            .pause(client.globals.loadTime.toolbar)
            .useXpath()
            .getText(this.testsPageNameTreeElement, function (result) {
                this.assert.ok(result.value === self.testsPageName, 'Check if the page was edited succesfully');
            })
            .useCss();
    },

    /**
     * Test delete from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test delete from contextual menu': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('removeButton');
                // test if the page tree popin is still open
                self.pageTreeObject.assert.elementPresent('@pageTree');
            })
            .useCss();
        // test if the delete page popin appears
        client.pause(client.globals.loadTime.pageTree.deletePagePopin);
        this.pagePopinsObject.expect.section('@deletePopin').to.be.visible.after(client.globals.loadTime.pageTree.deletePagePopin);
        // test that text and buttons are displayed
        this.pagePopinsObject.section.deletePopin
            .assertElementsPresent()
            // close the delete popin
            .click('@cancelButton');
    },

    /**
     * Test browse to from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test browse to from contextual menu': function (client) {
        'use strict';

        var self = this;

        // get the old url
        client.url(function (oldUrl) {
            // find the test page and double click it
            client
                .useXpath()
                .moveToElement(self.testsPageNameTreeElement, 0, 0, function () {
                    self.contextMenuSection.clickElementOnContextMenu('browseToButton');
                })
                .useCss()
                // wait for the refresh to be done
                .pause(client.globals.loadTime.toolbar)
                .url(function (currentUrl) {
                    // get the new url and check that is different then the old url
                    this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                });
        });
         // test the page tree popin to be visible again
        this.pageTreeObject.expect.element('@pageTree').to.be.visible.after(client.globals.loadTime.toolbar);
        // wait for the popin to be loaded
        client.pause(client.globals.loadTime.pageTree.loadPopin);
        // do a redirect to home
        this.treeViewSection.moveToElement('@home', 0, 0, function () {
            self.contextMenuSection.clickElementOnContextMenu('browseToButton');
        });
        client.pause(client.globals.loadTime.toolbar);
    },

    /**
     * Test paste as subpage from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste as subpage from contextual menu': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('cutButton');
            })
            .getCssProperty(this.testsPageNameTreeElement, 'outline-style', function (result) {
                this.assert.ok(result.value === 'dashed', 'Check if the cutted page has a dotted frame');
            })
            .useCss();
        this.treeViewSection
            .moveToElement('@firstItemFolder', 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('pasteButton');
            })
            .click('@firstItemFolderToggler');
        client
            .pause(client.globals.loadTime.defaultWait)
            .getText(this.treeViewSection.elements.selectedFolderItemChild.selector, function (result) {
                this.assert.ok(result.value === self.testsPageName, 'Check if the page was successfully moved as a subpage');
            });
    },

    /**
     * Test paste before from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste before from contextual menu': function (client) {
        'use strict';

        var self = this;

        this.treeViewSection.moveToElement('@firstItemFolderFirstChild', 0, 0, function () {
            self.contextMenuSection.clickElementOnContextMenu('cutButton');
        });
        this.treeViewSection.moveToElement('@firstNonFolderItem', 0, 0, function () {
            self.contextMenuSection.clickElementOnContextMenu('pasteBeforeButton');
        });
        client
            .pause(client.globals.loadTime.minimumWait)
            .getText(this.treeViewSection.elements.firstNonFolderItem.selector, function (result) {
                this.assert.ok(result.value === self.testsPageName, 'Check if the page was successfully moved before');
            });
    },

    /**
     * Test paste after from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste after from contextual menu': function (client) {
        'use strict';

        var self = this;

        client
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('cutButton');
            })
            .useCss()
            // select all non folder items and paste after the last element
            .querySelectorAll(this.treeViewSection.elements.nonFolderItem.selector, function (result) {
                client.moveTo(result.value[(result.value.length - 1)].ELEMENT, 0, 0, function () {
                    self.contextMenuSection.clickElementOnContextMenu('pasteAfterButton');
                });
            })
            .pause(client.globals.loadTime.minimumWait)
            // select all non folder items and check the last elements text to match our page name
            .querySelectorAll(this.treeViewSection.elements.nonFolderItem.selector, function (result) {
                client.elementIdText(result.value[(result.value.length - 1)].ELEMENT, function (textResult) {
                    this.assert.ok(textResult.value === self.testsPageName, 'Check if the page was successfully moved after');
                });
            });
    },

    /**
     * Test click arrow of folder shows subpages
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click arrow of folder shows subpages': function (client) {
        'use strict';

        // refresh the page to have the tree in it's open state
        client
            .refreshPage()
            .pause(client.globals.loadTime.pageTree.loadPopin);
        // click on the first folder toggler to show subpages
        this.treeViewSection.click('@firstItemFolderToggler');
        client
            .pause(client.globals.loadTime.pageTree.waitForSubpagesToShow)
            .elements('css selector', this.treeViewSection.elements.firstItemFolderChildren.selector, function (result) {
                result.value.forEach(function (element) {
                    client.elementIdDisplayed(element.ELEMENT, function (displayed) {
                        this.assert.ok(displayed.value === true, 'Check subpage to be displayed');
                    });
                });
            });
    },

    /**
     * Test click arrow of folder hides subpages
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click arrow of folder hides subpages': function (client) {
        'use strict';

        // click on the first folder toggler to hide subpages
        this.treeViewSection.click('@firstItemFolderToggler');
        client
            .pause(client.globals.loadTime.pageTree.waitForSubpagesToShow)
            .elements('css selector', this.treeViewSection.elements.firstItemFolderChildren.selector, function (result) {
                result.value.forEach(function (element) {
                    client.elementIdDisplayed(element.ELEMENT, function (displayed) {
                        this.assert.ok(displayed.value === false, 'Check subpage to not be displayed');
                    });
                });
            });
    },

    /**
     * Test actions dropdown
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test actions dropdown': function (client) {
        'use strict';

        // check if the actions dropdown is present and is not disabled anymore
        client
            .useXpath()
            .click(this.testsPageNameTreeElement)
            .useCss();
        this.pageTreeObject
            .assert.elementPresent('@actionButton')
            .assert.cssClassNotPresent('@actionButton', 'disabled')
            .assert.elementPresent('@actionButtonDropdown')
            .assert.cssClassNotPresent('@actionButtonDropdown', 'disabled');
        // check available actions against contextul menu actions
        this.actionsMenuSection.checkActionsAgainstContextMenu();
        // make sure to have the context menu closed
        this.pageTreeObject.click('@navBarBrand');
    },

    /**
     * Test create button from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create button from actions menu': function (client) {
        'use strict';

        var self = this;

        // find page and create a test sub page
        client
            .useXpath()
            .click(this.testsPageNameTreeElement)
            .useCss();
        this.pageTreeObject.click('@actionButtonDropdown');
        this.actionsMenuSection.click('@addButton');
        this.pagePopinsObject.expect.section('@createPopin').to.be.visible.after(client.globals.loadTime.pageTree.createPagePopin);
        client.pause(client.globals.loadTime.pageTree.createPagePopin);
        this.pagePopinsObject.section.createPopin.createNewPage(this.testsPageNameActionsMenu);
        client.pause(client.globals.loadTime.pageTree.createPage);
        this.treeViewSection
            .waitForElementVisible('@selectedFolderItem', client.globals.loadTime.defaultWait)
            .click('@selectedFolderItem');
        client.pause(client.globals.loadTime.pageTree.waitForSubpagesToShow);
        // check if the page created before is the first subpage
        this.treeViewSection.getText('@selectedFolderItemChild', function (result) {
            self.treeViewSection.assert.ok(result.value === self.testsPageNameActionsMenu, 'Check if the new created page is the first subpage');
        });
        // delete the created page
        client.element('css selector', this.treeViewSection.elements.selectedFolderItemChild.selector, function (result) {
            client.moveTo(result.value.ELEMENT, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('removeButton');
                client.pause(client.globals.loadTime.pageTree.deletePagePopin);
                self.pagePopinsObject.section.deletePopin.deletePage();
                client.pause(client.globals.loadTime.toolbar);
            });
        });
    },

    /**
     * Test edit button from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test edit button from actions menu': function (client) {
        'use strict';

        var self = this;

        // find page and create a test sub page
        client
            .useXpath()
            .click(this.testsPageNameTreeElement)
            .useCss();
        this.pageTreeObject.click('@actionButtonDropdown');
        this.actionsMenuSection.click('@editButton');
        // test if the edit page popin appears
        this.pagePopinsObject.expect.section('@editPopin').to.be.visible.after(client.globals.loadTime.pageTree.editPagePopin);
        client.pause(client.globals.loadTime.pageTree.editPagePopin);
        this.pagePopinsObject.section.editPopin.assertElementsPresent();
        // edit the test page and check that the edit was done succesfully
        this.testsPageName = client.globals.pageTree.createNewPage + ' ' + randomNumbersFor.testsEditActionsMenu;
        this.testsPageNameTreeElement = testsPageNameTreeElement.replace('pagenamehere', this.testsPageName);
        this.pagePopinsObject.section.editPopin.editPage(this.testsPageName);
        client
            .pause(client.globals.loadTime.toolbar)
            .useXpath()
            .getText(this.testsPageNameTreeElement, function (result) {
                this.assert.ok(result.value === self.testsPageName, 'Check if the page was edited succesfully');
            })
            .useCss();
    },

    /**
     * Test delete from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test delete from actions menu': function (client) {
        'use strict';

        // refresh the page then click the test page
        client
            .refreshPage()
            .pause(client.globals.loadTime.pageTree.loadPopin)
            .useXpath()
            .click(this.testsPageNameTreeElement)
            .useCss();
        // click the remove button
        this.pageTreeObject.click('@actionButtonDropdown');
        this.actionsMenuSection.click('@removeButton');
        // test if the delete page popin appears
        client.pause(client.globals.loadTime.pageTree.deletePagePopin);
        this.pagePopinsObject.expect.section('@deletePopin').to.be.visible.after(client.globals.loadTime.pageTree.deletePagePopin);
        // test that text and buttons are displayed
        this.pagePopinsObject.section.deletePopin
            .assertElementsPresent()
            // close the delete popin
            .click('@cancelButton');
    },

    /**
     * Test browse to from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test browse to from actions menu': function (client) {
        'use strict';

        var self = this;

        this.treeViewSection.click('@home');
        // get the old url
        client
            .url(function (oldUrl) {
                // find the test page and double click it
                client
                    .useXpath()
                    .click(self.testsPageNameTreeElement)
                    .useCss();
                self.pageTreeObject.click('@actionButtonDropdown');
                self.actionsMenuSection.click('@browseToButton');
                client
                    // wait for the refresh to be done
                    .pause(client.globals.loadTime.toolbar)
                    .url(function (currentUrl) {
                        // get the new url and check that is different then the old url
                        this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                    });
            });
        // test the page tree popin to be visible again
        this.pageTreeObject.expect.element('@pageTree').to.be.visible.after(client.globals.loadTime.toolbar);
        client.pause(client.globals.loadTime.pageTree.loadPopin);
        // do a redirect to home
        this.treeViewSection.moveToElement('@home', 0, 0, function () {
            self.contextMenuSection.clickElementOnContextMenu('browseToButton');
        });
        client.pause(client.globals.loadTime.toolbar);
    },

    /**
     * Test search page tree
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test search page tree': function () {
        'use strict';

        this.searchSection
            .search(this.testsPageName)
            .checkSearchResults(this.testsPageName)
            .clearValue('@searchInput')
            .click('@submitButton');
    },

    /**
     * After all tests are ran we logout and end the client
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    after: function (client) {
        'use strict';

        var self = this;

        // refresh to make sure no duplicate delete popin is present then delete the test page
        client
            .useCss()
            .refreshPage()
            .pause(client.globals.loadTime.pageTree.loadPopin)
            .useXpath()
            .moveToElement(this.testsPageNameTreeElement, 0, 0, function () {
                self.contextMenuSection.clickElementOnContextMenu('removeButton');
                client.pause(client.globals.loadTime.pageTree.deletePagePopin);
                self.pagePopinsObject.section.deletePopin.deletePage();
            })
            .useCss();
        // logout and end test
        client
            .pause(client.globals.loadTime.toolbar)
            .logout()
            .end();
    }
};