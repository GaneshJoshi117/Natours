const express = require('express');
//to send multi part form data

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//specifying destination for saving images

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); //this middleware will run before the below routes and protect all of the routes

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.delete(
  '/delete/:id',
  authController.restrictTo('admin'),
  userController.deleteUser
);

router.use(authController.restrictTo('admin')); //all the routes after this are protected and also restricted to admin only
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
