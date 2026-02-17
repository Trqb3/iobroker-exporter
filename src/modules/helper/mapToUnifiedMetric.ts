import { globalStates } from '../../lib/setup';
import { sanitizeLabelValue, sanitizeMetricName } from './sanitize';
import { escapeLabel } from './escapeLabel';

export function mapToUnifiedMetric(id: string) {
    const p: string[] = id.split('.');

    // Pattern: 0_userdata.0.STANDORT.EINHEIT.ROOM.sensorDataPoints.[subcat1].[subcat2]...[sensor]
    if (p[0] === '0_userdata' && /^\d+$/.test(p[1]) && p.length >= 7 && p[5] === 'sensorDataPoints') {
        const location: string = sanitizeLabelValue(p[2]);
        const unit: string = sanitizeLabelValue(p[3]);
        const room: string = sanitizeLabelValue(p[4]);

        const cp: string[] = p.slice(6, -1);
        const sensor: string = p[p.length - 1];

        const subcategory: string = cp.length > 0
            ? cp.join('_') + '_'
            : '';

        return {
            metricName: `smartoffice_sensor_${subcategory}${sensor}`,
            labels: { location, unit, room }
        };
    }

    // Pattern: 0_userdata.0.STANDORT.EINHEIT.ROOM.settings.[cat1].[cat2]...[setting]
    if (p[0] === '0_userdata' && /^\d+$/.test(p[1]) && p.length >= 7 && p[5] === 'settings') {
        const location: string = sanitizeLabelValue(p[2]);
        const unit: string = sanitizeLabelValue(p[3]);
        const room: string = sanitizeLabelValue(p[4]);

        const cp: string[] = p.slice(6, -1);
        const setting: string = p[p.length - 1];

        const category: string = cp.length > 0
            ? cp.join('_') + '_'
            : '';

        return {
            metricName: `smartoffice_setting_${category}${setting}`,
            labels: { location, unit, room }
        };
    }

    // Pattern: system.adapter.[ADAPTER].[INSTANCE].[value]
    if (p[0] === 'system' && p[1] === 'adapter' && p.length >= 5) {
        const adapter: string = p[2];
        const instance: string = p[3];
        const valueParts: string[] = p.slice(4);
        const value: string = valueParts.join('_');

        return {
            metricName: `iobroker_system_adapter_${sanitizeMetricName(value)}`,
            labels: {
                adapter,
                instance,
                id
            }
        };
    }

    // Pattern: system.host.[HOSTNAME].[value]
    if (p[0] === 'system' && p[1] === 'host' && p.length >= 4) {
        const hostname: string = p[2];
        const valueParts: string[] = p.slice(3);
        const value: string = valueParts.join('_');

        return {
            metricName: `iobroker_system_host_${sanitizeMetricName(value)}`,
            labels: {
                hostname,
                id
            }
        };
    }

    // Pattern: zigbee.[INSTANZ].[GERÄTE_ID].[kategorie1].[kategorie2]...[wert]
    if (p[0] === 'zigbee' && p.length >= 4) {
        const instance: string = p[1];
        const deviceId: string = p[2];

        const valuep: string[] = p.slice(3);
        const value: string = valuep[valuep.length - 1];
        const cp: string[] = valuep.slice(0, -1);

        const category: string = cp.length > 0
            ? cp.join('_') + '_'
            : '';

        const meta = globalStates.objectCache[id] || {};
        const deviceName: string = escapeLabel(meta.name || deviceId);

        return {
            metricName: `iobroker_zigbee_${category}${value}`,
            labels: {
                instance,
                device_id: deviceId,
                device_name: deviceName
            }
        };
    }

    // Pattern: [ADAPTER].[INSTANCE].[kategorie1].[kategorie2]...[value]
    // z.B. backitup.0.info.iobrokerNextTime
    if (p.length >= 3 && /^\d+$/.test(p[1])) {
        const adapter: string = sanitizeMetricName(p[0]);
        const instance: string = p[1];
        const valueParts: string[] = p.slice(2);
        const value: string = valueParts[valueParts.length - 1];
        const categoryParts: string[] = valueParts.slice(0, -1);

        const category: string = categoryParts.length > 0
            ? categoryParts.join('_') + '_'
            : '';

        return {
            metricName: `iobroker_${adapter}_${category}${value}`,
            labels: {
                adapter,
                instance,
                id
            }
        };
    }


    return {
        metricName: sanitizeMetricName(id),
        labels: { id }
    };
}