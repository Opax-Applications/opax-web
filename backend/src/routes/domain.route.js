import express from 'express';

import controller from '../controllers/domain.controller';

const router = express.Router();

router.get('/', controller.get_domains);
router.get('/:domainId/pages', controller.get_domain_pages);
router.get('/:domainId', controller.get_domain);
router.post('/', controller.create_domain);
module.exports = router;
