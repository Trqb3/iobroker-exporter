export function sanitizeLabelValue(value: string): string {
    if (value === null || value === undefined) return '';

    return  String(value)
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/Ä/g, 'Ae')
        .replace(/Ö/g, 'Oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ß/g, 'ss')
        .replace(/[(){}\[\]]/g, '')
        .replace(/\n/g, ' ').replace(/"/g, '\\"');
}

export function sanitizeMetricName(name: string): string {
    let sanitized: string = name
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/Ä/g, 'Ae')
        .replace(/Ö/g, 'Oe')
        .replace(/Ü/g, 'Ue')
        .replace(/ß/g, 'ss')
        .replace(/[(){}\[\]=]/g, '')
        .replace(/[.\-\s]/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    if (/^\d/.test(sanitized)) {
        sanitized = 'n' + sanitized;
    }

    return sanitized.toLowerCase();
}