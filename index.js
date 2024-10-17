import express from 'express';
import cors from 'cors';
import { fileURLToPath, pathToFileURL } from 'url';
import { join, dirname } from 'path';
import { readdir } from 'fs/promises';
import morgan from 'morgan';
//EXPRESS FILE
import fileUpload from "express-fileupload";
const router = express.Router();
const PORT = 8063;
const app = express()

app.set('port', PORT);
app.use(fileUpload())
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);
const routesDir = join(_dirname, '/src/routes');

router.post(`/api/v1/papas`, (req, res) => {
    res.send('Hello from example route!');
});

const importRoutes = async () => {
    try {
        const routeFiles = (await readdir(routesDir)).filter(file => file.endsWith('routes.js'));

        await Promise.all(routeFiles.map(async file => {
            const filePath = join(routesDir, file);
            const fileUrl = pathToFileURL(filePath).href;
            const { default: routes } = await import(fileUrl);
            const routeName = file.replace('.routes.js', '');
            router.use(`/api/v1/${routeName}`,routes);
            console.log(`/api/v1/${routeName}`)
        }));
    } catch (error) {
        console.error('Error importing routes:', error);
    }
};

importRoutes();

app.use(router)

app.listen(PORT, () => {
    console.log('API lista por el puerto ', PORT)
})

export default app