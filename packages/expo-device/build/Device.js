import { Platform, UnavailabilityError } from '@unimodules/core';
import ExpoDevice from './ExpoDevice';
import { deviceNamesByCode } from './DeviceNameByCode';
import { DeviceType } from './Device.types';
export const brand = ExpoDevice ? ExpoDevice.brand : null;
export const manufacturer = ExpoDevice ? ExpoDevice.manufacturer : null;
let model;
let fingerprint;
let platformModelId;
let platformDesignName;
let platformProductName;
let platformApi;
if (Platform.OS === 'ios') {
    let deviceName;
    let modelId = ExpoDevice.modelId;
    if (modelId) {
        deviceName = deviceNamesByCode[modelId];
        if (!deviceName) {
            // Not found on database. At least guess main device type from string contents:
            if (modelId.startsWith('iPod')) {
                deviceName = 'iPod Touch';
            }
            else if (modelId.startsWith('iPad')) {
                deviceName = 'iPad';
            }
            else if (modelId.startsWith('iPhone')) {
                deviceName = 'iPhone';
            }
            else if (modelId.startsWith('AppleTV')) {
                deviceName = 'Apple TV';
            }
        }
    }
    model = deviceName;
    fingerprint = null;
    platformModelId = ExpoDevice ? ExpoDevice.modelId : null;
    platformDesignName = null;
    platformProductName = null;
    platformApi = null;
}
else {
    model = ExpoDevice ? ExpoDevice.modelName : null;
    fingerprint = ExpoDevice ? ExpoDevice.osBuildFingerprint : null;
    platformModelId = null;
    platformDesignName = ExpoDevice ? ExpoDevice.designName : null;
    platformProductName = ExpoDevice ? ExpoDevice.productName : null;
    platformApi = ExpoDevice ? ExpoDevice.platformApiLevel : null;
}
export const osBuildFingerprint = fingerprint;
export const modelName = model;
export const modelId = platformModelId;
export const designName = platformDesignName;
export const productName = platformProductName;
export const platformApiLevel = platformApi;
export const osName = ExpoDevice ? ExpoDevice.osName : null;
export const totalMemory = ExpoDevice ? ExpoDevice.totalMemory : null;
export const isDevice = ExpoDevice ? ExpoDevice.isDevice : null;
export const supportedCpuArchitectures = ExpoDevice ? ExpoDevice.supportedCpuArchitectures : null;
export const osBuildId = ExpoDevice ? ExpoDevice.osBuildId : null;
export const osVersion = ExpoDevice ? ExpoDevice.osVersion : null;
export const deviceName = ExpoDevice ? ExpoDevice.deviceName : null;
export const osInternalBuildId = ExpoDevice ? ExpoDevice.osInternalBuildId : null;
export async function hasPlatformFeatureAsync(feature) {
    if (!ExpoDevice.hasPlatformFeatureAsync) {
        throw new UnavailabilityError('expo-device', 'hasPlatformFeatureAsync');
    }
    return await ExpoDevice.hasPlatformFeatureAsync(feature);
}
export async function getPlatformFeaturesAsync() {
    if (!ExpoDevice.getPlatformFeaturesAsync) {
        throw new UnavailabilityError('expo-device', 'getPlatformFeaturesAsync');
    }
    return await ExpoDevice.getPlatformFeaturesAsync();
}
export async function getMaxMemoryAsync() {
    if (!ExpoDevice.getMaxMemoryAsync) {
        throw new UnavailabilityError('expo-device', 'getMaxMemoryAsync');
    }
    let maxMemory = await ExpoDevice.getMaxMemoryAsync();
    if (maxMemory === -1) {
        maxMemory = Number.MAX_SAFE_INTEGER;
    }
    return Promise.resolve(maxMemory);
}
export async function isSideLoadingEnabled() {
    if (!ExpoDevice.isSideLoadingEnabled) {
        throw new UnavailabilityError('expo-device', 'isSideLoadingEnabled');
    }
    return await ExpoDevice.isSideLoadingEnabled();
}
export async function getUptimeAsync() {
    if (!ExpoDevice.getUptimeAsync) {
        throw new UnavailabilityError('expo-device', 'getUptimeAsync');
    }
    return await ExpoDevice.getUptimeAsync();
}
export async function isRootedExperimentalAsync() {
    if (!ExpoDevice.isRootedExperimentalAsync) {
        throw new UnavailabilityError('expo-device', 'isRootedExperimentalAsync');
    }
    return await ExpoDevice.isRootedExperimentalAsync();
}
export async function getDeviceTypeAsync() {
    if (!ExpoDevice.getDeviceTypeAsync) {
        throw new UnavailabilityError('expo-device', 'getDeviceTypeAsync');
    }
    const deviceType = await ExpoDevice.getDeviceTypeAsync();
    switch (deviceType) {
        case deviceType === DeviceType.PHONE:
            return Promise.resolve(DeviceType.PHONE);
        case deviceType === DeviceType.TABLET:
            return Promise.resolve(DeviceType.TABLET);
        case deviceType === DeviceType.TV:
            return Promise.resolve(DeviceType.TV);
        case deviceType === DeviceType.DESKTOP:
            return Promise.resolve(DeviceType.DESKTOP);
        default:
            return Promise.resolve(DeviceType.UNKNOWN);
    }
}
//# sourceMappingURL=Device.js.map