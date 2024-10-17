import { Router } from "express";
//importaImportar controller
import { signcontroller } from "../controller/sign.controller.js";

const router = Router()
router.post('/', signcontroller.sign);
router.post('/certificate', signcontroller.certificado);
export default router