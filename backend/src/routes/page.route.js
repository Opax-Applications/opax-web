import express from 'express';

import controller from '../controllers/page.controller';

const router = express.Router();

router.get('/', controller.get_pages)
router.get('/:pageId/audits', controller.get_page_audits);
router.get('/:pageId', controller.get_page);

module.exports = router;
