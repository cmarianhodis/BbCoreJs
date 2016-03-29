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
 * Custom command for opening an url
 * Checks if the provided url is a valid url
 *
 * @category    NightWatch
 * @subcategory CustomCommands
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

module.exports.command = function (url, callback) {
    'use strict';

    var self = this,
        urlPattern = new RegExp(
            '^' +
                '(?:(?:https?|ftp)://)' +
                '(?:\\S+(?::\\S*)?@)?' + '(?:' + '(?!(?:10|127)(?:\\.\\d{1,3}){3})' + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
                '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
                '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
                '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
                '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
                '|' +
                '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
                '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
                '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
                '\\.?' +
                ')' +
                '(?::\\d{2,5})?' +
                '(?:[/?#]\\S*)?' +
                '$',
            'i'
        );

    try {
        if (!urlPattern.test(url)) {
            throw 'Provided base url is not a valid url!';
        }
        this
            .url(url)
            .resizeWindow(1920, 1080);

        if (typeof callback === 'function') {
            callback.call(self);
        }
    } catch (error) {
        console.log(error);
    }

    return this;
};