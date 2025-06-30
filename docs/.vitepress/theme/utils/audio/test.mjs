// scripts/process-audio.js
import AudioCompressor from './audio-compressor.mjs';

async function processAudio() {
    const compressor = new AudioCompressor({
        bitrate: '128k',
        concurrency: 4,
        logProgress: true
    });

    await compressor.compressAll();
}

processAudio().catch(err => {
    console.error('音频处理失败:', err);
    process.exit(1);
});
