const express = require('express');
const {
  getExecutives,
  getExecutive,
  createExecutive,
  updateExecutive,
  deleteExecutive,
} = require('../controllers/executives');

const router = express.Router();

router.route('/').get(getExecutives).post(createExecutive);

router
  .route('/:id')
  .get(getExecutive)
  .put(updateExecutive)
  .delete(deleteExecutive);

module.exports = router;
