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
 * Login object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

module.exports = {
    sections: {
        login: {
            selector: '#pop-in-1',
            elements: {
                popinCloseButton: {
                    selector: 'button.ui-dialog-titlebar-close'
                },
                username: {
                    selector: 'div.element_username input[type=text]'
                },
                password: {
                    selector: 'div.element_password input[type=password]'
                },
                submit: {
                    selector: 'button.bb-submit-form'
                },
                error: {
                    selector: '.help-block:nth-child(1)'
                }
            }
        },
        toolbar: {
            selector: '#bb5-navbar-primary',
            sections: {
                userSettings: {
                    selector: '#bb-current-user',
                    elements: {
                        topMostLogin: {
                            selector: '#bb5-topmost-login'
                        },
                        logout:  {
                            selector: 'div#bb-current-user ul li:nth-child(7) a'
                        }
                    }
                }
            }
        }
    }
};