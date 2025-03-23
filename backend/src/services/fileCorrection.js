import PQueue from 'p-queue';

const correctionQueue = new PQueue({ concurrency: 1 });

correctionQueue.on('active', () => {
    console.log(`📌 Correction en cours. Taille restante de la queue : ${correctionQueue.size}`);
});

correctionQueue.on('completed', () => {
    console.log(`✅ Correction terminée. Taille restante de la queue : ${correctionQueue.size}`);
});

export default correctionQueue;
