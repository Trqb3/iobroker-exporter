/// <reference types="@iobroker/types" />

import Logger from '../../lib/util/Logger';
import { globalStates } from "../../lib/setup";
import { CustomError, ErrorCodes } from '../../lib/errors';
import { fetchJSON } from './fetchJSON';
import { sanitizeLabelValue } from './sanitize';

const logger = new Logger();


export async function loadObjectMetadata(): Promise<void> {
    try {
        const objects: Record<string, ioBroker.Object> = await fetchJSON('/v1/objects?filter=*&type=state');

        for (const [id, obj] of Object.entries(objects)) {
            if (obj && obj.common) {
                const p: string[] = id.split('.');
                let roomName: string = '';
                let locationName: string = '';

                if (p[0] === '0_userdata' && /^\d+$/.test(p[1]) && p.length >= 6) {
                    // Hole Location-Object: 0_userdata.0.D6
                    const locationId = `${p[0]}.${p[1]}.${p[2]}`;
                    try {
                        const locationObj: ioBroker.Object = await fetchJSON(`/v1/object/${locationId}`);
                        if (locationObj?.common?.name) {
                            locationName = typeof locationObj.common.name === 'string'
                                ? locationObj.common.name
                                : locationObj.common.name?.en || '';
                        }
                    } catch (e) {
                        // Location existiert nicht
                    }

                    // Hole Room-Object: 0_userdata.0.D6.16.TG1
                    const roomId = `${p[0]}.${p[1]}.${p[2]}.${p[3]}.${p[4]}`;
                    try {
                        const roomObj: ioBroker.Object = await fetchJSON(`/v1/object/${roomId}`);
                        if (roomObj?.common?.name) {
                            roomName = typeof roomObj.common.name === 'string'
                                ? roomObj.common.name
                                : roomObj.common.name?.en || '';
                        }
                    } catch (e) {
                        // Room existiert nicht
                    }
                }

                const loc = extractLocationMetadata(id);
                const name: string = typeof obj.common.name === 'string'
                    ? obj.common.name
                    : obj.common.name?.en || '';

                globalStates.objectCache[id] = {
                    name: sanitizeLabelValue(name),
                    location: sanitizeLabelValue(locationName || loc.location),
                    unit: loc.unit,
                    room: sanitizeLabelValue(roomName || loc.room)
                };
            }
        }

        globalStates.cacheLoaded = true;
        logger.write(0, `Loaded metadata for ${Object.keys(globalStates.objectCache).length} objects`);
    } catch (error) {
        throw new CustomError(ErrorCodes.LoadObjectMetadataFailed);
    }
}

function extractLocationMetadata(id: string) {
    const p: string[] = id.split('.');

    if (p[0] === '0_userdata' && /^\d+$/.test(p[1]) && p.length >= 6) {
        return {
            location: sanitizeLabelValue(p[2]),
            unit: sanitizeLabelValue(p[3]),
            room: sanitizeLabelValue(p[4]),
        };
    }

    return { location: '', unit: '', room: '' };
}