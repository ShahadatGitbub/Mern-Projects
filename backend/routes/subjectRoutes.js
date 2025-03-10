import express from 'express';
import { addSubject, deleteSubject, getAllSubjects,updateSubject} from '../controllers/subject.controller.js';
import userAuthentication from '../middlewares/userAuth.js';

const subjectRouter = express.Router();

subjectRouter.post('/add-subject', addSubject);
subjectRouter.delete('/delete-subject/:subjectId', deleteSubject);
subjectRouter.post('/update-subject', updateSubject);
subjectRouter.post('/get-all-subjects', getAllSubjects);

export default subjectRouter;