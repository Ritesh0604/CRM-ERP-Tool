const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const settingController = require('@/controllers/coreControllers/settingController');
const emailController = require('@/controllers/coreControllers/emailController');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');

// Admin Management
router.get('/admin/read/:id', catchErrors(adminController.read));
router.patch('/admin/password-update/:id', catchErrors(adminController.updatePassword));

// Admin Profile
router.patch('/admin/profile/password', catchErrors(adminController.updateProfilePassword));
router.patch('/admin/profile/update',
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
);

// Global Setting
router.post('/setting/create', catchErrors(settingController.create));
router.get('/setting/read/:id', catchErrors(settingController.read));
router.patch('/setting/update/:id', catchErrors(settingController.update));
router.get('/setting/search', catchErrors(settingController.search));
router.get('/setting/list', catchErrors(settingController.list));
router.get('/setting/listAll', catchErrors(settingController.listAll));
router.get('/setting/filter', catchErrors(settingController.filter));
router.get('/setting/readBySettingKey/:settingKey', catchErrors(settingController.readBySettingKey));
router.get('/setting/listBySettingKey', catchErrors(settingController.listBySettingKey));
router.patch('/setting/updateBySettingKey/:settingKey',
    catchErrors(settingController.updateBySettingKey)
);
router.patch('/setting/upload/:settingKey?',
    singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' }),
    catchErrors(settingController.updateBySettingKey)
);
router.patch('/setting/updateManySetting', catchErrors(settingController.updateManySetting));

// Email Templates
router.post('/email/create', catchErrors(emailController.create));
router.get('/email/read/:id', catchErrors(emailController.read));
router.patch('/email/update/:id', catchErrors(emailController.update));
router.get('/email/search', catchErrors(emailController.search));
router.get('/email/list', catchErrors(emailController.list));
router.get('/email/listAll', catchErrors(emailController.listAll));
router.get('/email/filter', catchErrors(emailController.filter));

module.exports = router;
