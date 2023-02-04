const express = require('express');
const router = express.Router();
const { getMDIIcons } = require('../models/icons');

/**
 * Apply filters
 *
 * @param {any[]} data The data to send
 * @param {any} params The filters to apply
 *
 * @returns filtred data
 */
const applyFilters = (data, {offset, limit, select, search, type}) => {
  // Parsing & default values
  offset = offset ? parseInt(offset) : 0;
  limit = limit ? parseInt(limit) : 25;
  select = select ? select.split(',') : undefined;

  // Filtering by type
  if(type) {
    if(type == "filled") {
      data = data.filter(({name}) => !name.endsWith('-outline'))
    } else if(type == "outline") {
      data = data.filter(({name}) => name.endsWith('-outline'))
    }
  }

  // Filtering by search content
  if(search) {
    data = data.filter(({name, aliases}) => {
      const s = search.toLowerCase();
      // Check in name
      if(name.includes(s)) {
        return true
      }
      // Check in aliases
      for (const alias of aliases) {
        if(alias.includes(s)) {
          return true;
        }
      }
      // Check failed
      return false;
    })
  }

  const total = data.length;
  // Slicing data
  data = data.slice(offset, limit+offset);

  // Selecting fields
  if(select) {
    data = data.map((icon) => {
      const obj = {};
      for (const [key, value] of Object.entries(icon)) {
        if(select.includes(key)) {
          obj[key] = value
        }
      }
      return obj;
    })
  }

  return {
    total,
    count: data.length,
    offset,
    data,
  };
}

/* GET MDI icons */
router.get('/', async (req, res) => {
  try {
    const icons = await getMDIIcons();

    res.send(applyFilters(icons, req.query));
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).send({
      status: 500,
      message: typeof error === "object" ? error.message : error,
    })
  }
});

/* GET specific MDI icons */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const icon = (await getMDIIcons()).find(({id: iid}) => iid === id);
    if(icon) {
      res.send(applyFilters([icon], {
        select: req.query.select
      }));
    } else {
      res.status(404).send({
        status: 404,
        message: 'Icon not found'
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).send({
      status: 500,
      message: typeof error === "object" ? error.message : error,
    })
  }
});

module.exports = router;
