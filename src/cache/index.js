const { default: axios } = require('axios');
const dayjs = require('dayjs');
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');

const filename = join(__dirname, 'mdi-icons.json');

/**
 * Fetch icons over API and write it into cache
 *
 * @returns {Promise<any[]>} The icons
 */
const writeMDIIcons = async () => {
	const { data } = await axios.get('https://materialdesignicons.com/api/package/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B');
	await writeFile(filename, JSON.stringify({
		icons: data.icons,
		updated: dayjs(),
	}))
	return data.icons;
}

/**
 * Get icons over cache, or over API if needed.
 *
 * Cache is valid for 7 days
 *
 * @returns {Promise<any[]>} The icons
 */
const getMDIIcons = async () => {
	try {
		const {icons, updated} = JSON.parse(await readFile(filename, 'utf-8'));

		if(dayjs(updated).add(7, 'd').isAfter(dayjs())) {
			return icons;
		}
		return writeMDIIcons();
	} catch (error) {
		return writeMDIIcons();
	}
}

module.exports = {
	getMDIIcons
}
