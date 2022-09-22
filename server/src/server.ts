import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import { convertHourToMinutos } from './utils/convertHour';
import { convertMinutesToHours } from './utils/convertMinutes';

const app = express();
const prisma = new PrismaClient({
  log: ['query'],
});

app.use(express.json());
app.use(cors());

const PORT = 3333;

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return res.json(games);
});

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourEnd: true,
      hourStart: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.json(
    ads.map((ad) => ({
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHours(ad.hourStart),
      hourEnd: convertMinutesToHours(ad.hourEnd),
    })),
  );
});

app.post('/games/:id/ads', async (req, res) => {
  const gameId: any = req.params.id;
  const body = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourToMinutos(body.hourStart),
      hourEnd: convertHourToMinutos(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });
  return res.status(201).json(ad);
});

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return res.json({
    discord: ad.discord,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
