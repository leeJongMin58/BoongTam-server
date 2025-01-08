import * as communityStoreReportModel from '../models/communityStoreReportModel.js';

export const createStoreReport = async (lat, lng, address, name, storeType, appearanceDay, open_hour, close_hour, paymentMethod, isOrderOnline) => {
    return await communityStoreReportModel.createStoreReport(lat, lng, address, name, storeType, appearanceDay, open_hour, close_hour, paymentMethod, isOrderOnline);
};
