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
 * Content object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var commands = {
    testSectionElements: function (section) {
        'use strict';

        var element;

        for (element in section.elements) {
            if (section.elements.hasOwnProperty(element)) {
                section.waitForElementVisible('@' + element, this.api.globals.loadTime.defaultWait);
            }
        }

        return this;
    },
    testSection: function (sectionName, section) {
        'use strict';

        if (section !== undefined) {
            section.expect.section('@' + sectionName).to.be.visible.before(this.api.globals.loadTime.defaultWait);
        } else {
            this.expect.section('@' + sectionName).to.be.visible.before(this.api.globals.loadTime.defaultWait);
        }

        return this;
    },
    testSectionAttribute: function (sectionName, attribute, value) {
        'use strict';

        this.expect.section('@' + sectionName).to.have.attribute(attribute).which.contains(value);

        return this;
    },
    testCss: function (element, cssProperty) {
        'use strict';

        this.expect.element(element).to.have.css(cssProperty);

        return this;
    }
};

module.exports = {
    commands: [commands],
    sections: {
        contentSet: {
            selector: 'div.container-fluid div.rootContentSet[data-bb-identifier^="ContentSet"]:first-child',
            sections: {
                plugins: {
                    selector: 'div.bb5-ui.bb5-content-actions.content-actions',
                    elements: {
                        contentPlus: {
                            selector: 'a.fa.fa-plus'
                        },
                        contentSelector : {
                            selector: 'a.fa.fa-th-large'
                        }
                    }
                }
            }
        },
        content: {
            selector: 'div#content div.rootContentSet .bb-dnd:first-child',
            sections: {
                plugins: {
                    selector: 'div.bb5-ui.bb5-content-actions.content-actions',
                    elements: {
                        pencil: {
                            selector: 'a.fa.fa-pencil'
                        },
                        infoCircle: {
                            selector: 'a.fa.fa-info-circle'
                        },
                        cog: {
                            selector: 'a.fa.fa-cog'
                        }
                    }
                }
            }
        }
    }
};