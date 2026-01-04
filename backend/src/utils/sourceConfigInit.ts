import SourceConfig from '../models/SourceConfig.js';

/**
 * Initialize default source configurations
 */
export async function initializeSourceConfigs() {
    try {
        console.log('Initializing source configurations...');

        const sources = [
            { sourceName: 'otakudesu', baseUrl: 'https://otakudesu.best' },
            { sourceName: 'kuramanime', baseUrl: 'https://v8.kuramanime.tel' }
        ];

        for (const source of sources) {
            const existing = await SourceConfig.findOne({ sourceName: source.sourceName });

            if (!existing) {
                await SourceConfig.create({
                    ...source,
                    isActive: true,
                    lastUpdated: new Date(),
                    updatedBy: 'system'
                });
                console.log(`✓ Created SourceConfig for ${source.sourceName}: ${source.baseUrl}`);
            } else {
                console.log(`✓ SourceConfig already exists for ${source.sourceName}`);
            }
        }

        console.log('Source configurations initialized successfully');
    } catch (error) {
        console.error('Error initializing source configs:', error);
        throw error;
    }
}
