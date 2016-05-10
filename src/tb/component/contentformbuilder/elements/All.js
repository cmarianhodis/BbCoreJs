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
    [
        'jquery',
        'jsclass'
    ],
    function (jQuery) {

        'use strict';

        var All = {

            services: {
                'ContentManager': 'content.main.getContentManager'
            },

            init: function (definition) {
                this.definition = definition;

                return this;
            },

            getConfig: function (object) {

                var self = this,
                    dfd = jQuery.Deferred(),
                    config,
                    element = object.content;

                if (!element || undefined === object.uid || undefined === object.type) {
                    dfd.reject('null_content');

                    return dfd.promise();
                }

                element.getData().done(function () {

                    config = {
                        'type': 'content',
                        'label': object.label || object.name,
                        'value': object.uid,
                        'image': element.data.image,
                        'object_name': object.name,
                        'object_type': object.type,
                        'object_label': element.data.label,
                        'element': element,
                        'addTrashButton':  (object.name === 'image' && self.definition.image !== element.data.image) ? true : false
                    };

                    dfd.resolve(config);
                }).fail(function (data, response) {
                    dfd.reject(data, response);
                });

                return dfd.promise();
            }
        };

        return All;
    }
);