import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import errorMiddlware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js'
import miscRoutes from './routes/miscellanous.routes.js'
import userRoutes from './routes/user.Routes.js'
import testRoutes from './routes/test.routes.js';
import projectRoutes from './routes/project.routes.js';
import testResultRoutes from './routes/testResult.routes.js';
import adminRoutes from './routes/admin.routes.js';

config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
            'https://learning-management-system-roan.vercel.app', // Production
            'http://localhost:5173' // Development
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
  );

app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping',function(_req,res){
    res.send('Pong');
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/test-results', testResultRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', miscRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
});

app.all('*',(_req,res)=>{
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;