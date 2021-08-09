import express from 'express';

import controller from '../controllers/site.controller';
import pageController from '../controllers/page.controller';

const router = express.Router();

router.get('/', controller.get_domains);
router.get('/:domainId/pages/:pageId/audits', pageController.get_page_audits);
router.get('/:domainId/pages/:pageId', pageController.get_page);
router.get('/:domainId/pages', controller.get_domain_pages);
router.get('/:domainId', controller.get_domain);
router.post('/', controller.create_domain);
module.exports = router;
