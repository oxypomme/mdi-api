const express = require('express');
const router = express.Router();
const { getMDIIcons } = require('../cache');

/* GET MDI icons, from cache or from net */
router.get('/', async (req, res) => {
  const { limit: l, offset: o, select } = req.query;
  const selectArr = select ? select.split(',') : undefined;
  try {
    const rawIcons = await getMDIIcons();

    const offset = o ? parseInt(o) : 0;
    const limit = l ? parseInt(l) : 25;

    const icons = rawIcons.slice(
      offset,
      limit + offset
    ).map((icon) => {
      const obj = {};
      for (const [key, value] of Object.entries(icon)) {
        if(!selectArr || selectArr.includes(key)) {
          obj[key] = value;
        }
      }
      return obj;
    })

    res.send({
      total: rawIcons.length,
      count: icons.length,
      offset: offset ?? 0,
      data: icons
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: typeof error === "object" ? error.message : error,
    })
  }
});

/* GET specific MDI icons, from cache or from net */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { select } = req.query;
  const selectArr = select ? select.split(',') : undefined;
  try {
    const icon = (await getMDIIcons()).find(({id: iid}) => iid === id);
    if(icon) {
      const obj = {};
      for (const [key, value] of Object.entries(icon)) {
        if(!selectArr || selectArr.includes(key)) {
          obj[key] = value;
        }
      }

      res.send({
        count: 1,
        data: obj
      });
    } else {
      res.status(404).send({
        status: 404,
        message: 'Icon not found'
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: typeof error === "object" ? error.message : error,
    })
  }
});

module.exports = router;
