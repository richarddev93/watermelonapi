import express from 'express';
import booksController from "../controller/books.controller.js";
const router = express.Router();

router.get('/', booksController.findAll);
router.get('/:bookID1', booksController.findByID);
router.get('/pull/:bookID', booksController.pullChanges);

router.post('/push', booksController.pushChanges);
router.post('', booksController.create);

router.patch('/:bookID', booksController.update);
router.delete('/:bookID', booksController.deleteByID);


export default router;