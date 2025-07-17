const express = require('express');
const router = express.Router();
const notificationController = require('../notification/notificationController');

router.post('/', notificationController.createNotificationHandler);
router.get('/', notificationController.getDonorNotifications);
router.get('/requester/:requesterId', notificationController.getRequesterNotifications);
router.patch('/:id', notificationController.updateNotificationStatus);
router.get('/request-counts', notificationController.getRequestCounts);


module.exports = router;
