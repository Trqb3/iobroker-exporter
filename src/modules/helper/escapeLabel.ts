import { sanitizeLabelValue } from './sanitize';

export function escapeLabel(value: string): string {
    return sanitizeLabelValue(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}