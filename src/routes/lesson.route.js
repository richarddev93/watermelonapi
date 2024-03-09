import express from 'express';
import lessonsController from "../controller/lessons.controller.js";
const router = express.Router();

router.get('/', lessonsController.findAll);
router.get('/:bookID', lessonsController.findByID);
router.post('', lessonsController.create);
router.patch('/:bookID', lessonsController.update);
router.delete('/:bookID', lessonsController.deleteByID);


export default router;