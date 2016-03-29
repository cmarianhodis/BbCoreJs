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
 * Page tree object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var homePageContextMenuButtons = ['addButton', 'editButton', 'browseToButton'];

var commands = {
    // click on the show folder checkbox
    clickShowFolderCheckbox: function () {
        'use strict';

        this
            .waitForElementVisible('@showFoldersCheckbox', this.api.globals.loadTime.defaultWait)
            .click('@showFoldersCheckbox');

        return this;
    },
    // check the results for show folder checkbox when it's checked
    checkShowFolderCheckboxCheckedResults: function () {
        'use strict';

        var self = this;

        // check that folder items to be hidden
        this.api.elements('css selector', this.section.treeView.elements.resultItemFolder.selector, function (result) {
            result.value.map(function (value) {
                self.api.elementIdDisplayed(value.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === true, 'Check if folder is displayed');
                });
            });
        });
        // check that non folder items to be hidden
        this.api.elements('css selector', this.section.treeView.elements.resultItemNonFolder.selector, function (result) {
            result.value.map(function (value) {
                self.api.elementIdDisplayed(value.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === false, 'Check non folders to be hidden');
                });
            });
        });

        return this;
    },
    // check that all pages are displayed after unchecking the show folder checkbox
    checkShowFolderCheckboxNotCheckedResults: function () {
        'use strict';

        var self = this;

        this.api.elements('css selector', this.section.treeView.elements.resultItem.selector, function (result) {
            result.value.forEach(function (element) {
                self.api.elementIdDisplayed(element.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === true, 'Check page to be displayed');
                });
            });
        });

        return this;
    }
};

var treeViewCommands = {
    moveMouseOnTreeElement: function (element, callback) {
        'use strict';

        var self = this;

        this.api.element('css selector', element, function (result) {
            self.api.moveTo(result.value.ELEMENT, 0, 0, function () {
                if (typeof callback === 'function') {
                    callback.call(self);
                }
            });
        });

        return this;
    }
};

var searchCommands = {
    search: function (searchPage) {
        'use strict';

        var loadTime = this.api.globals.loadTime.pageTree;

        this
            .waitForElementVisible('@searchInput', loadTime.searchInput)
            .setValue('@searchInput', searchPage)
            .waitForElementVisible('@submitButton', loadTime.searchSubmitButton)
            .click('@submitButton');

        this.api.pause(loadTime.waitForSearchResults);

        return this;
    },
    checkSearchResults: function (searchPage) {
        'use strict';

        var self = this,
            iterator = 1;

        this.api
            .elements('css selector', this.elements.resultItem.selector, function (result) {
                result.value.forEach(function (element) {
                    self.api.elementIdText(element.ELEMENT, function () {
                        self.api.assert.containsText(
                            self.elements.resultItem.selector + ':nth-child(' + iterator + ')',
                            searchPage,
                            'Check if results contain the searched text'
                        );
                    });
                    if (iterator < result.value.length) {
                        iterator += 1;
                    }
                });
            })
            .pause(this.api.globals.loadTime.pageTree.waitForSearchResults);

        return this;
    }
};

var contextMenuCommands = {
    clickElementOnContextMenu: function (button) {
        'use strict';

        this.api.mouseButtonClick('right');
        this.click('@' + button);

        return this;
    },
    // check if the add, edit and browse to buttons are displayed in homepage context menu and the rest to be hidden
    checkHomeDisplayedButtons: function () {
        'use strict';

        var element;

        for (element in this.elements) {
            if (this.elements.hasOwnProperty(element)) {
                if (homePageContextMenuButtons.indexOf(element) !== -1) {
                    this.expect.element(this.elements[element].selector).to.be.visible.after(this.api.globals.loadTime.minimumWait);
                } else {
                    this.expect.element(this.elements[element].selector).to.not.be.visible.after(this.api.globals.loadTime.minimumWait);
                }
            }
        }

        return this;
    },
    // check if the paste, paste before, paste after buttons are displayed
    checkCopyDisplayedButtons: function () {
        'use strict';

        // check paste button to be visible
        this.assert.visible('@pasteButton');
        // check paste before button to be visible
        this.assert.visible('@pasteBeforeButton');
        // check paste after button to be visible
        this.assert.visible('@pasteAfterButton');

        return this;
    }
};

var actionsMenuCommands = {
    checkActionsAgainstContextMenu: function () {
        'use strict';

        var self = this,
            contextMenuSection = this.parent.section.contextMenu,
            treeViewSection = this.parent.section.treeView;

        // open the context menu
        this.api.element('css selector', treeViewSection.elements.firstItemFolder.selector, function (result) {
            self.api.moveTo(result.value.ELEMENT, 0, 0, function () {
                self.api.mouseButtonClick('right');
            });
        });

        // loop through all options from actions menu
        this.api.elements('css selector', this.elements.listItem.selector, function (result) {
            result.value.forEach(function (element) {
                // get the data attribte and check that in context menu this is visible
                self.api.elementIdAttribute(element.ELEMENT, 'data-button-key', function (attributeResult) {
                    contextMenuSection.assert.visible('.' + attributeResult.value);
                });
            });
        });

        return this;
    }
};

module.exports = {
    commands: [commands],
    elements: {
        navBarBrand: {
            selector: 'span.navbar-brand img'
        },
        openPageTreeButton: {
            selector: 'button#bundle-toolbar-tree'
        },
        pageTree: {
            selector: 'div#bb-page-tree'
        },
        showFoldersCheckbox: {
            selector: 'div.action-ctn.folder-filter input[type=checkbox]'
        },
        actionButton: {
            selector: 'div#bb-page-tree .contents-action button:first-child'
        },
        actionButtonDropdown: {
            selector: 'div#bb-page-tree .contents-action button.dropdown-toggle'
        }
    },
    sections: {
        pageTreeDialog: {
            selector: '[aria-describedby="bb-page-tree"] > div.ui-draggable-handle:first-child',
            elements: {
                closePopinButton: {
                    selector: ' button.ui-dialog-titlebar-close'
                }
            }
        },
        treeView: {
            selector: 'div#bb-page-tree div.bb5-treeview ul.jqtree_common.jqtree-tree',
            commands: [treeViewCommands],
            elements: {
                home: {
                    selector: 'li.jqtree_common.jqtree-folder:first-child div.jqtree-element.jqtree_common'
                },
                resultItemFolder: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder'
                },
                resultItemNonFolder: {
                    selector: 'li.jqtree_common ul li.jqtree_common:not(.jqtree-folder)'
                },
                resultItem: {
                    selector: 'li.jqtree_common ul li.jqtree_common'
                },
                allItemsName: {
                    selector: 'li.jqtree_common ul li.jqtree_common span.jqtree-title'
                },
                firstItem: {
                    selector: 'li.jqtree_common ul li.jqtree_common:not(.jqtree-folder) span.jqtree-title:first-child'
                },
                lastItem: {
                    selector: 'li.jqtree_common ul li.jqtree_common:last-child div'
                },
                lastItemBorder: {
                    selector: 'li.jqtree_common ul li.jqtree_common:last-child span.jqtree-border'
                },
                ghostItem: {
                    selector: 'li.jqtree_common ul li.jqtree-ghost'
                },
                ghostItemLine: {
                    selector: 'li.jqtree_common ul li.jqtree-ghost span.jqtree-line'
                },
                firstNonFolderItem: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder + li:not(.jqtree-folder) span.jqtree-title'
                },
                nonFolderItem: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder ~ li:not(.jqtree-folder) span.jqtree-title'
                },
                selectedFolderItem: {
                    selector: 'li.jqtree_common ul li.jqtree-selected div a.jqtree-toggler'
                },
                selectedFolderItemChild: {
                    selector: 'li.jqtree_common ul li.jqtree-selected ul.jqtree_common li.jqtree_common div.jqtree-element span.jqtree-title'
                },
                firstItemFolder: {
                    selector: 'li.jqtree_common ul li.jqtree-folder:first-child div'
                },
                firstItemFolderFirstChild: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder:first-child ul.jqtree_common li.jqtree_common div'
                },
                firstItemFolderChildren: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder:first-child ul.jqtree_common li.jqtree_common'
                },
                firstItemFolderToggler: {
                    selector: 'li.jqtree_common ul li.jqtree_common.jqtree-folder:first-child div a.jqtree-toggler'
                }
            }
        },
        search: {
            selector: 'div#bb-page-tree div.search-bar',
            commands: [searchCommands],
            elements: {
                searchInput: {
                    selector: 'div.search-bar input[type=text]'
                },
                showFoldersCheckbox: {
                    selector: 'div.action-ctn.folder-filter input[type=checkbox]'
                },
                submitButton: {
                    selector: '.search-bar button.searchButton'
                },
                resultItem: {
                    selector: 'div.bb5-treeview ul li.jqtree_common'
                }
            }
        },
        contextMenu: {
            selector: 'div.bb5-context-menu',
            commands: [contextMenuCommands],
            elements: {
                addButton: {
                    selector: 'button.bb5-context-menu-add'
                },
                editButton: {
                    selector: 'button.bb5-context-menu-edit'
                },
                removeButton: {
                    selector: 'button.bb5-context-menu-remove'
                },
                copyButton: {
                    selector: 'button.bb5-context-menu-copy'
                },
                pasteButton: {
                    selector: 'button.bb5-context-menu-paste'
                },
                pasteBeforeButton: {
                    selector: 'button.bb5-context-menu-paste-before'
                },
                pasteAfterButton: {
                    selector: 'button.bb5-context-menu-paste-after'
                },
                cutButton: {
                    selector: 'button.bb5-context-menu-cut'
                },
                browseToButton: {
                    selector: 'button.bb5-context-menu-flyto'
                }
            }
        },
        actionsMenu: {
            selector: 'div#bb-page-tree div.contents-action ul.dropdown-menu',
            commands: [actionsMenuCommands],
            elements: {
                listItem: {
                    selector: 'li.menu-item'
                },
                addButton: {
                    selector: '[data-button-key="bb5-context-menu-add"]'
                },
                editButton: {
                    selector: '[data-button-key=bb5-context-menu-edit]'
                },
                removeButton: {
                    selector: '[data-button-key=bb5-context-menu-remove]'
                },
                copyButton: {
                    selector: '[data-button-key=bb5-context-menu-copy]'
                },
                pasteButton: {
                    selector: '[data-button-key=bb5-context-menu-paste]'
                },
                pasteBeforeButton: {
                    selector: '[data-button-key=bb5-context-menu-paste-before]'
                },
                pasteAfterButton: {
                    selector: '[data-button-key=bb5-context-menu-paste-after]'
                },
                cutButton: {
                    selector: '[data-button-key=bb5-context-menu-cut]'
                },
                browseToButton: {
                    selector: '[data-button-key=bb5-context-menu-flyto]'
                }
            }
        }
    }
};