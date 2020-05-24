import { findById } from '../component/lib/moneyTracker';

async function getInitData(options) {
    if (Object.prototype.hasOwnProperty.call(options, 'id')) {
        return findById(options.id);
    }
    return Promise.resolve(null);
}

export {
    getInitData
};
