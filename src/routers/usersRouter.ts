import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { check } from 'express-validator';
import { checkRole, checkAuth } from '../middlewares/authMiddleware.js';

const router: Router = Router();

const validateUser = [
  check('name').notEmpty().withMessage('User name is required'),
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isStrongPassword().withMessage('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character'),
  check('role').isIn(["USER", "ADMIN"]).withMessage("Invalid role"),
  check('avatarFile').custom((value, { req }) => {
    if (req.files && req.files.avatarFile) {
      const avatar = req.files.avatarFile;
      const allowedMimes = ['image/jpeg', 'image/png'];
      if (!allowedMimes.includes(avatar.mimetype)) {
        throw new Error('Invalid image format. Only .jpg and .png files are allowed');
      }
      if (avatar.size > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds the max limit of 5MB.');
      }
    }
    return true;
  })
];

router.post('/users/register', validateUser, UserController.register);
router.post('/users/login', UserController.login);
router.put('/users/:id', checkAuth, UserController.update);
router.get('/users', checkAuth, checkRole(["ADMIN"]), UserController.getAll);
router.get('/users/:id', checkAuth, UserController.getOne);
router.delete('/users/:id', checkAuth, UserController.delete);

export default router;