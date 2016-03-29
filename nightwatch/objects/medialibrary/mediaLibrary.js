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
 * Media library object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Bogdan Oanes <bogdan.oanes@lp-digital.fr>
 */

var inlineEditCommands = {
    assertElementsPresent: function () {
        'use strict';

        return this
                .assert.visible('@inputField')
                .assert.visible('@saveBtn')
                .assert.visible('@closeBtn');
    },
    createFolder: function (folderName) {
        'use strict';

        return this
                .setValue('@inputField', folderName)
                .click('@saveBtn');
    }
};

var contextMenuCommands = {
    runNodeAction: function (node, actionButton) {
        'use strict';

        this.api
            .moveToElement(node, 0, 0)
            .mouseButtonClick('left')
            .mouseButtonClick('right');

        return this.click(actionButton);
    }
};

var formMediaImageCommands = {
    assertElementsPresent: function () {
        'use strict';

        return this
                .assert.visible('@titleField')
                .assert.visible('@saveBtn');
    }
};

module.exports = {
    elements: {
        openMediaLibraryButton: {
            selector: 'button#btn-show-mediaLibrary'
        },
        mediaLibrary: {
            selector: '.media-library div#library-pane-wrapper'
        },
        closePopinButton: {
            selector: '.media-library button.ui-dialog-titlebar-close'
        },
        overlay: {
            selector: 'body .ui-widget-overlay'
        },
        firstChildNode: {
            selector: '//div[contains(@class, "mediaFolder-tree")]//ul[count(preceding-sibling::*)+count(following-sibling::*)=0]//li[count(preceding-sibling::*)+count(following-sibling::*)=0]/div',
            locateStrategy: 'xpath'
        },
        secondChildNode: {
            selector: 'div.mediaFolder-tree ul li > ul li:nth-child(1) div'
        },
        lastChildNode: {
            selector: 'div.mediaFolder-tree ul li > ul li:last-child:not(:only-child) div'
        },
        actionSelectedNode: {
            selector: 'div.mediaFolder-tree li.action-selected div span'
        },
        mediaCenterFolder: {
            selector: '.bb5-windowpane-main p.result-infos'
        },
        seePopinPictureWrapper: {
            selector: '.ui-dialog-content img.bb-content'
        },
        seePopinPictureDialogClose: {
            selector: '//div[contains(@class, "ui-dialog-content")]//img[contains(@class, "bb-content")]/ancestor::div[contains(@class, "ui-dialog")]//button[contains(@class, "ui-dialog-titlebar-close")]',
            locateStrategy: 'xpath'
        }
    },
    sections: {
        actionsDropdown: {
            selector: '.ui-layout-north .contents-action',
            elements: {
                toggleButton: {
                    selector: 'button.dropdown-toggle'
                },
                add: {
                    selector: 'li[data-button-key="bb5-context-menu-add"]'
                },
                edit: {
                    selector: 'li[data-button-key="bb5-context-menu-edit"]'
                },
                image: {
                    selector: 'li[data-button-key="bb5-contextmenu-Media-Image"]'
                },
                pdf: {
                    selector: 'li[data-button-key="bb5-contextmenu-Media-Pdf"]'
                }
            }
        },
        deletePopin: {
            selector: 'div.delete-media',
            elements: {
                yesBtn: {
                    selector: 'div.ui-dialog-buttonset button:first-child'
                },
                noBtn: {
                    selector: 'div.ui-dialog-buttonset button:last-child'
                }
            }
        },
        mediaPreview: {
            selector: '.bb5-windowpane-main .bb5-list-media li:first-child',
            elements: {
                titleWrapper: {
                    selector: '.item-ttl'
                },
                pictureWrapper: {
                    selector: '.item-picture'
                },
                seeButton: {
                    selector: '.show-media-btn'
                },
                editButton: {
                    selector: '.edit-media-btn'
                },
                deleteButton: {
                    selector: '.del-media-btn'
                }
            }
        },
        formMediaImage: {
            commands: [formMediaImageCommands],
            selector: '//div[contains(@class, "media-image-form")][last()]',
            locateStrategy: 'xpath',
            elements: {
                closeBtn: {
                    selector: '.ui-dialog-titlebar-close'
                },
                titleField: {
                    selector: 'textarea[name="title"]'
                },
                errorTitleField: {
                    selector: 'div.element_title span.form_error'
                },
                saveBtn: {
                    selector: 'button.bb-submit-form'
                },
                removeBtn: {
                    selector: '.dz-remove'
                },
                previewWrapper: {
                    selector: '.dz-preview'
                },
                dropzone: {
                    selector: '.dropzone-file'
                }
            }
        },
        inlineEdit: {
            commands: [inlineEditCommands],
            selector: 'li.jq-tree-editor',
            elements: {
                inputField: {
                    selector: 'input.tree-editing-field'
                },
                saveBtn: {
                    selector: '.save-btn'
                },
                closeBtn: {
                    selector: '.fa-close'
                }
            }
        },
        contextMenu: {
            selector: 'div.bb5-context-menu:last-child',
            commands: [contextMenuCommands],
            elements: {
                listItem: {
                    selector: 'ul li'
                },
                addButton: {
                    selector: 'button.bb5-context-menu-add'
                },
                editButton: {
                    selector: 'button.bb5-context-menu-edit'
                },
                removeButton: {
                    selector: 'button.bb5-context-menu-remove'
                },
                cutButton: {
                    selector: 'button.bb5-context-menu-cut'
                },
                pasteBeforeButton: {
                    selector: 'button.bb5-context-menu-paste-before'
                },
                pasteButton: {
                    selector: 'button.bb5-context-menu-paste'
                },
                pasteAfterButton: {
                    selector: 'button.bb5-context-menu-paste-after'
                },
                createMediaImage: {
                    selector: 'button.bb5-contextmenu-Media-Image'
                },
                createMediaPdf: {
                    selector: 'button.bb5-contextmenu-Media-Pdf'
                }
            }
        }
    }
};