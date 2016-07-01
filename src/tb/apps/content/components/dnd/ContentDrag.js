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
    'app.content/components/dnd/ContentDrag',
    [
        'Core',
        'component!dnd',
        'content.manager',
        'content.container',
        'jquery',
        'jsclass'
    ],
    function (Core,
              dnd,
              ContentManager,
              ContentContainer,
              jQuery
            ) {

        'use strict';

        return new JS.Class({

            bindEvents: function (Manager) {
                Core.Mediator.subscribe('on:classcontent:dragstart', this.onDragStart, Manager);
                Core.Mediator.subscribe('on:classcontent:mousedown', this.onMouseDown, Manager);
            },

            unbindEvents: function () {
                Core.Mediator.unsubscribe('on:classcontent:dragstart', this.onDragStart);
                Core.Mediator.unsubscribe('on:classcontent:mousedown', this.onMouseDown);
            },

            /**
             * Event triggered on start drag content
             * @param {Object} event
             */
            onNewContentDragStart: function (event) {
                var target = jQuery(event.target);

                this.dataTransfer.content = {type: target.data(this.typeDataAttribute)};
            },

            /**
             * Event triggered on mousedown content
             * @param {Object} event
             */
            onMouseDown: function (event) {
                var cloneTarget = event.target.cloneNode(true),
                    target = event.target,
                    jTarget = jQuery(target),
                    content = ContentManager.getContentByNode(jTarget.parents('.' + this.contentClass + ':first')),
                    contentImage = jQuery(document.createElement('img'));

                if (jTarget.hasClass('fa-arrows')) {
                    if (cloneTarget.dataset && cloneTarget.dataset.dndAttached === 'true') {
                        cloneTarget.dataset.dndAttached = false;
                    }
                    target.parentNode.replaceChild(cloneTarget, target);

                    this.dataTransfer.content = content;

                    dnd('#bb5-site-wrapper').addListeners('classcontent', '.bb-dnd');

                    contentImage.attr('src', content.definition.image);
                    jTarget
                        .append(contentImage)
                        .removeClass('fa-arrows')
                        .css({
                            'top': Math.max(0, event.pageY - 50) + 'px',
                            'left': Math.max(0, event.pageX - 50) + 'px',
                            'position': 'absolute',
                            'pointerEvents': 'none'
                        }).appendTo(document.body);

                    setTimeout(function () {
                        jTarget.remove();
                    });

                    jTarget[0].dragDrop();
                } else {
                    target.dragDrop();
                }

                return false;
            },

            /**
             * Event trigged on start drag content
             * @param {Object} event
             */
            onDragStart: function (event) {
                event.stopPropagation();

                var target = jQuery(event.target),
                    parent = target.parent(),
                    targetData = (typeof event.target.dragDrop === 'function') ? parent.data(this.typeDataAttributeIE) : target.data(this.typeDataAttribute),
                    img,
                    content;

                this.dataTransfer.isNew = false;
                if (targetData) {
                    this.dataTransfer.isNew = true;
                    content = {type: targetData};
                } else if (typeof event.dataTransfer.setDragImage === 'function') {
                    content = ContentManager.getContentByNode(target.parents('.' + this.contentClass + ':first'));

                    img = document.createElement('img');
                    img.src = content.definition.image;
                    img.style.webkitUserDrag = 'element';

                    event.dataTransfer.setDragImage(img, 25, 25);
                }

                if (content) {
                    this.dataTransfer.content = content;
                }
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text', 'draging-content');

                ContentManager.buildContentSet();

                this.dataTransfer.contentSetDroppable = ContentContainer.findContentSetByAccept(this.dataTransfer.content.type);

                setTimeout(
                    this.showHTMLZoneForContentSet.bind(this),
                    10,
                    this.dataTransfer.contentSetDroppable,
                    this.dataTransfer.content.id,
                    this.dataTransfer.content.type
                );
                setTimeout(
                    this.showScrollZones.bind(this),
                    100
                );
            }
        });
    }
);