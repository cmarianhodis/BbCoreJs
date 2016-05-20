/*
 * Copyright (c) 2011-2013 Lp digital system
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

define(
    'tb.component/popin/main',
    [
        'Core',
        'tb.component/popin/PopIn',
        'jquery',
        'component!mask',
        'jqueryui',
        'jsclass'
    ],
    function (Core, PopIn, jQuery, MaskManager) {

        'use strict';

        /**
         * Contains every default options for a pop-in
         * @type {Object}
         */
        var DEFAULT_POPIN_OPTIONS = {
                autoOpen: false,
                maxHeight: jQuery(window).height() - 40,
                maxWidth: jQuery(window).height() - 40
            },

            /**
             * PopInManager allow us to handle with ease Core.PopIn
             */
            PopInManager = new JS.Class({

                /**
                 * Unique id generator for pop-in id
                 * @type {Number}
                 */
                popInId: 0,

                /**
                 * @type {String}
                 */
                toolbarId: Core.get('wrapper_toolbar_selector'),

                /**
                 * @type {String}
                 */
                containerId: 'bb5-dialog-container',

                popinsStatus: null,

                gap: 40,

                initialize: function () {
                    this.popinsStatus = {};
                    this.sessionPopinsStatus = JSON.parse(sessionStorage.getItem('popinsStatus')) || {};
                },

                updatePopinStatus: function (popIn, saveData) {
                    var dialog = jQuery('#' + popIn.getId()),
                        position = dialog.parent().position(),
                        width = dialog.parent().outerWidth(),
                        height = dialog.parent().outerHeight(),
                        positionEnd,
                        isFullscreen,
                        isOpened = popIn.isOpen();

                    if (!position || !position.hasOwnProperty("left") || !position.hasOwnProperty("top")) {
                        return;
                    }

                    positionEnd = {
                        'left': position.left + width,
                        'top': position.top + height
                    };

                    isFullscreen = (position.left < this.gap && positionEnd.left > (jQuery(window).width() - this.gap)) ? true : isFullscreen;

                    if (isOpened && !isFullscreen) {
                        this.popinsStatus[popIn.getId()] = {
                            'isOpen': true,
                            'position': position,
                            'positionEnd': positionEnd
                        };
                        if (popIn.options.hasOwnProperty('savePosition') && popIn.options.savePosition && saveData) {
                            this.sessionPopinsStatus[popIn.getId()] = {
                                'top': position.top,
                                'left': position.left,
                                'width': width,
                                'height': height
                            };
                            sessionStorage.setItem('popinsStatus', JSON.stringify(this.sessionPopinsStatus));
                        }
                    } else {
                        delete this.popinsStatus[popIn.getId()];
                    }
                },

                checkPosition: function (popIn) {
                    var key,
                        dialog = jQuery('#' + popIn.getId()),
                        position = dialog.parent().position(),
                        newPosition = jQuery.extend({}, position),
                        width = dialog.parent().outerWidth(),
                        height = dialog.parent().outerHeight();

                    if (!position || !position.hasOwnProperty("left") || !position.hasOwnProperty("top")) {
                        return;
                    }

                    for (key in this.popinsStatus) {
                        if (this.popinsStatus.hasOwnProperty(key) && popIn.getId() !== key && !this.sessionPopinsStatus.hasOwnProperty(key)) {
                            if (this.popinsStatus[key].isOpen) {
                                if (
                                    position.left >= this.popinsStatus[key].position.left &&
                                        position.left < this.popinsStatus[key].positionEnd.left &&
                                        position.top >= this.popinsStatus[key].position.top &&
                                        position.top < (this.popinsStatus[key].position.top + this.gap)
                                ) {
                                    newPosition.top = this.popinsStatus[key].position.top + this.gap;
                                }

                                if (
                                    (position.left + width) >= this.popinsStatus[key].position.left &&
                                        (position.left + width) < (this.popinsStatus[key].positionEnd.left + this.gap) &&
                                        (position.top + height) >= this.popinsStatus[key].position.top &&
                                        (position.top + height) < this.popinsStatus[key].positionEnd.top
                                ) {
                                    newPosition.left = this.popinsStatus[key].positionEnd.left + this.gap - width;
                                }
                            }
                        }
                    }

                    return newPosition;
                },

                /**
                 * Create a Core.PopIn with basic configuration like its id and options
                 * @param  {Object} config configuration of pop-in
                 * @return {PopIn}
                 */
                createPopIn: function (config) {
                    var popIn = new PopIn(),
                        options = jQuery.extend({}, DEFAULT_POPIN_OPTIONS),
                        option = null,
                        id;

                    config = typeof config === 'object' ? config : {};
                    id = config.id;

                    if (id === undefined) {
                        this.popInId = this.popInId + 1;
                        id = 'pop-in-' + this.popInId;
                    } else {
                        delete config.id;
                    }

                    popIn.setId(id);

                    for (option in config) {
                        if (config.hasOwnProperty(option)) {
                            options[option] = config[option];
                        }
                    }

                    options.appendTo = '#' + this.containerId;

                    popIn.setOptions(options);

                    return popIn;
                }

            }),

            /**
             * The unique instance of PopInManager
             * @type {PopInManager}
             */
            manager = new PopInManager();

        return {

            /**
             * Initialize the PopInManager by setting the toolbarId
             * @param {String} toolbarId
             */
            init: function (toolbarId) {
                if (typeof toolbarId === 'string') {
                    manager.toolbarId = toolbarId;
                }
            },

            /**
             * Create a Core.PopIn with basic configuration like its id and options
             * @param  {Object} options
             * @return {PopIn}
             */
            createPopIn: function (options) {
                var popIn = manager.createPopIn(options),
                    self = this;

                if (false === popIn.getOptions().hasOwnProperty('close')) {
                    popIn.addOption('close', function () {
                        self.hide(popIn);
                    });
                }

                /**
                 * Add display() method to Core.PopIn to call Core.PopInManager::display()
                 */
                popIn.display = function () {
                    self.display(popIn);
                };
                /**
                 * Add setContent() method to Core.PopIn
                 */
                popIn.setContent = function (content, force) {
                    popIn.content = content;

                    if (force || popIn.isOpen()) {
                        // if the dialog exists, just update the html
                        jQuery('#' + popIn.getId()).html(popIn.getContent());
                    }
                };

                /**
                 * Add hide() method to Core.PopIn to call Core.PopInManager::hide()
                 */
                popIn.hide = function () {
                    self.hide(popIn);
                };

                /**
                 * Add mask() method to Core.PopIn to display loader overlay on top of dialog
                 */
                popIn.mask = function (message) {
                    var mask = MaskManager.createMask({
                            'message': message
                        });

                    mask.mask(jQuery('#' + popIn.getId()).parent());
                };

                /**
                 * Add unmask() method to Core.PopIn to remove loader overlay from dialog
                 */
                popIn.unmask = function () {
                    var input;

                    MaskManager.createMask({}).unmask(jQuery('#' + popIn.getId()).parent());
                    input = jQuery('#' + popIn.getId() + ' form').find('input[type=text], input[type=email], select, textarea').eq(0);
                    if (input.length && input.prop('tagName').toLowerCase() === 'input') {
                        input.focus().val(input.val());
                    }
                };

                return popIn;
            },

            /**
             * Create and add a new child to parent pop-in
             * @param  {PopIn}  parent  the parent of the new pop-in to create
             * @param  {Object} options
             * @return {PopIn}  the child pop-in
             */
            createSubPopIn: function (parent, options) {
                var popIn,
                    parentPopin,
                    shift = 30,
                    isFullscreen,
                    maxHeight;

                options = options || {};
                options.modal = true;

                popIn = this.createPopIn(options);

                if (typeof parent === 'object' && typeof parent.isA === 'function' && parent.isA(PopIn)) {
                    if (parent.id !== undefined) {
                        parentPopin = jQuery("#" + parent.id).parent();

                        if (parentPopin !== undefined && typeof (parentPopin.position()) === 'object') {
                            maxHeight = jQuery(window).height() - parentPopin.position().top - shift - 5;

                            isFullscreen = ((jQuery(window).width() - 80) < parentPopin.outerWidth())  ? true : false;
                            if (isFullscreen) {
                                popIn.addOption('position', { my: "center top", at: "center top+180px", of: window});
                            } else {
                                popIn.addOption('position', { my: "left+" + shift + " top+" + shift, at: "left top", of: parentPopin });
                                popIn.addOption('maxHeight', maxHeight);
                            }
                        }

                    }

                    parent.addChild(popIn);
                    popIn.parent = parent;
                } else {
                    throw 'Provided parent is not a PopIn object';
                }

                return popIn;
            },

            /**
             * Display the pop-in
             * @param {PopIn} popIn the pop-in to display
             */
            display: function (popIn) {
                var self = this,
                    dialogWrapper,
                    dialogPosition,
                    position,
                    parentZIndex,
                    sessionPosition = {};

                if (popIn.isClose()) {
                    popIn.open();

                    if (jQuery('#' + popIn.getId()).length === 0) {
                        if (null === document.getElementById(manager.containerId)) {
                            jQuery(manager.toolbarId).append('<div id="' + manager.containerId + '"></div>');
                        }

                        if (jQuery('#' + popIn.getId()).length === 0) {
                            jQuery('#' + manager.containerId).append('<div id="' + popIn.getId() + '"></div>');
                        }

                        if (popIn.getContent().length || popIn.getContent() !== '') {
                            jQuery('#' + popIn.getId()).html(popIn.getContent());
                        }

                        jQuery('#' + popIn.getId()).dialog(popIn.getOptions());
                        jQuery('#' + popIn.getId()).on('dialogclose', function () {
                            self.hide(popIn);
                            manager.updatePopinStatus(popIn, true);
                        });

                        jQuery("#" + popIn.getId()).on('dialogfocus', jQuery.proxy(this.handleFocus, this, popIn));

                        jQuery("#" + popIn.getId()).on('dialogdragstop', function () {
                            manager.updatePopinStatus(popIn, true);
                        });

                        jQuery("#" + popIn.getId()).on('dialogresize', function () {
                            manager.updatePopinStatus(popIn, true);
                        });

                        jQuery("#" + popIn.getId()).on('dialogopen', function (event) {
                            manager.updatePopinStatus(popIn, false);

                            if (popIn.parent) {
                                parentZIndex = jQuery('#' + popIn.parent.getId()).zIndex();
                                dialogWrapper = jQuery(event.currentTarget).closest(".ui-dialog").eq(0);
                                jQuery(dialogWrapper).zIndex(parentZIndex + 1);
                                jQuery(dialogWrapper).nextAll('.ui-widget-overlay.ui-front').eq(0).zIndex(parentZIndex);
                            }
                        });
                    }

                    jQuery('#' + popIn.getId()).dialog('open');
                    dialogPosition = jQuery('#' + popIn.getId()).parent().position();

                    position = manager.checkPosition(popIn);
                    if (position !== dialogPosition) {
                        jQuery('#' + popIn.getId()).parent().css(position);
                    }

                    if (manager.sessionPopinsStatus.hasOwnProperty(popIn.getId())) {
                        sessionPosition = manager.sessionPopinsStatus[popIn.getId()];
                        jQuery('#' + popIn.getId()).parent().css(sessionPosition);
                    }

                    manager.updatePopinStatus(popIn, false);
                }
            },

            /**
             * Make sure, if the popin is focused on,
             * that its children are still visible
             **/

            handleFocus: function (popIn) {
                var child, children;
                children = popIn.getChildren();
                for (child in children) {
                    if (children.hasOwnProperty(child)) {
                        children[child].moveToTop();
                    }
                }

            },


            /**
             * Hide pop-in and its children
             * @param {PopIn} popIn
             */
            hide: function (popIn) {
                var child = null,
                    children = null;

                if (popIn.isOpen()) {
                    popIn.close();
                    children = popIn.getChildren();
                    jQuery('#' + popIn.getId()).dialog('close');

                    for (child in children) {
                        if (children.hasOwnProperty(child)) {
                            this.hide(children[child]);
                        }
                    }
                }

            },

            /**
             * Toggle display/hide of pop-in
             * @param {PopIn} popIn the pop-in to toggle
             */
            toggle: function (popIn) {
                if (popIn.isOpen()) {
                    this.hide(popIn);
                } else if (popIn.isClose()) {
                    this.display(popIn);
                }
            },

            /**
             * Destroy pop-in and its children
             * @param {PopIn} popIn the pop-in to destroy
             */
            destroy: function (popIn) {
                var child = null,
                    children = null;

                if (false === popIn.isDestroy()) {
                    children = popIn.getChildren();

                    if (popIn.isOpen()) {
                        jQuery('#' + popIn.getId()).dialog('close');
                    }

                    jQuery('#' + popIn.getId()).unbind();
                    jQuery('#' + popIn.getId()).remove();

                    for (child in children) {
                        if (children.hasOwnProperty(child)) {
                            this.destroy(children[child]);
                        }
                    }

                    popIn.destroy();
                }
            }

        };

    }
);
