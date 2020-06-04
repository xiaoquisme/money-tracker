import * as moneyTracker from '../component/lib/moneyTracker';

import * as utils from './utils';

jest.mock('../component/lib/moneyTracker');

describe('utils test', () => {
    describe('getInitData test', () => {
        it.each`
        id             |  expectResult
        ${ null }      | ${ null }
        ${ undefined } | ${ null }
        ${ '' }        | ${ null }
        ${ 123 }       | ${ { id: 1 } }
        `(' method findById method is called $expect given id is $id', async ({ id, expectResult }) => {
            moneyTracker.findById.mockResolvedValue({ id: 1 });
            const result = await utils.getInitData(id);
            expect(result).toStrictEqual(expectResult);

        });
    });
});
