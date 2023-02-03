const icons = require('@mdi/svg/meta.json')

/**
 * Get icons from lib.
 *
 * @returns {Promise<any[]>} The icons
 */
const getMDIIcons = async () => {
	return Promise.resolve(icons);
}

module.exports = {
	getMDIIcons
}
