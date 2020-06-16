import { findById } from '../component/lib/moneyTracker';

async function getInitData(id) {
    if (id) {
        return findById(id);
    }
    return Promise.resolve(null);
}

export {
    getInitData
};
