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
 * Page popins object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var createCommands = {
    // create a new page
    createNewPage: function (pageName) {
        'use strict';

        this
            .setValue('@title', pageName)
            .click('@layoutFirstNonEmptyOption')
            .click('@submit');

        return this;
    },
    // assert that all elements from create new page popin are present
    assertElementsPresent: function () {
        'use strict';

        this
            .assert.elementPresent('@title')
            .assert.elementPresent('@alttitle')
            .assert.elementPresent('@layout')
            .assert.elementPresent('@submit');

        return this;
    }
};

var editCommands = {
    // assert that all elements from delete popin are present
    assertElementsPresent: function () {
        'use strict';

        var self = this;

        // check that the elements are present
        this
            .assert.elementPresent('@title')
            .assert.elementPresent('@alttitle')
            .assert.elementPresent('@url')
            .assert.elementPresent('@target')
            .assert.elementPresent('@redirect')
            .assert.elementPresent('@layout')
            .assert.elementPresent('@submit');

        // check that these elements have values
        this.getValue('@title', function (result) {
            self.assert.ok(result.value !== '', 'Check if title has value');
        });
        this.getValue('@url', function (result) {
            self.assert.ok(result.value !== '', 'Check if url has value');
        });
        this.getValue('@target', function (result) {
            self.assert.ok(result.value !== '', 'Check if target has value');
        });
        this.getValue('@layout', function (result) {
            self.assert.ok(result.value !== '', 'Check if layout has value');
        });

        return this;
    },
    editPage: function (pageName) {
        'use strict';

        this
            .clearValue('@title')
            .setValue('@title', pageName)
            .click('@submit');

        return this;
    }
};

var deleteCommands = {
    // delete page
    deletePage: function () {
        'use strict';

        this.click('@validateButton');

        return this;
    },
    // assert that all elements from delete popin are present
    assertElementsPresent: function () {
        'use strict';

        this
            .assert.elementPresent('@warningText')
            .assert.elementPresent('@cancelButton')
            .assert.elementPresent('@validateButton');

        return this;
    }
};

module.exports = {
    sections: {
        createPopin: {
            selector: '.create-new-page-popin',
            commands: [createCommands],
            elements: {
                title: {
                    selector: 'div.element_title input[type=text]'
                },
                alttitle: {
                    selector: 'div.element_alttitle input[type=text]'
                },
                layout: {
                    selector: 'div.element_layout_uid select'
                },
                layoutFirstNonEmptyOption: {
                    selector: 'div.element_layout_uid select option:nth-child(2)'
                },
                submit: {
                    selector: 'button.bb-submit-form'
                }
            }
        },
        editPopin: {
            selector: '.edit-page-popin',
            commands: [editCommands],
            elements: {
                title: {
                    selector: 'div.element_title input[type=text]'
                },
                alttitle: {
                    selector: 'div.element_alttitle input[type=text]'
                },
                url: {
                    selector: 'div.element_url input[type=text]'
                },
                target: {
                    selector: 'div.element_target select'
                },
                redirect: {
                    selector: 'div.element_redirect input[type=text]'
                },
                layout: {
                    selector: 'div.element_layout_uid select'
                },
                submit: {
                    selector: 'button.bb-submit-form'
                },
                closeButton: {
                    selector: 'div.ui-dialog-titlebar button.ui-dialog-titlebar-close'
                }
            }
        },
        deletePopin: {
            selector: '.delete-page-popin',
            commands: [deleteCommands],
            elements: {
                warningText: {
                    selector: 'p'
                },
                cancelButton: {
                    selector: 'button.bb-delete-page-cancel'
                },
                validateButton: {
                    selector: 'button.bb-delete-page-validate'
                },
                closeButton: {
                    selector: 'div.ui-dialog-titlebar button.ui-dialog-titlebar-close'
                }
            }
        }
    }
};