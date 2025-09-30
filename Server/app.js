import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import errorMiddlware from './middlewares/error.middleware.js';
import miscRoutes from './routes/miscellaneous.routes.js'
import userRoutes from './routes/user.routes.js'
import adminRoutes from './routes/admin.routes.js';
import jobSeekerRoutes from './routes/jobSeeker.routes.js';
import jobProviderRoutes from './routes/jobProvider.routes.js';

config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
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

// Setting up routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/job-seeker', jobSeekerRoutes);
app.use('/api/v1/job-provider', jobProviderRoutes);
app.use('/api/v1', miscRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
});

app.all('*',(_req,res)=>{\
    res.status(404).send('OOPS!!  404 page not found ')
})
app.use(errorMiddlware);

export default app;
