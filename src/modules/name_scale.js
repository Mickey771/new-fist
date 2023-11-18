import { models } from '@/modules/music'

function isArpeggio(model) {
    return model.startsWith('arp-');
}

export function nameModel(model) {
    const baseName = models[model].name;
    const suffix = isArpeggio(model) ? 'arpeggio' : 'scale';
    return `${baseName} ${suffix}`;
}