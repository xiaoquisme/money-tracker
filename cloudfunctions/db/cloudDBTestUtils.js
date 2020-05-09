function getMockServerDate(serverDateInit) {
    const mockServerDate = jest.fn().mockImplementation(({ offset }) => {
        const date = new Date(serverDateInit);
        date.setMilliseconds(offset);
        return date;
    });
    return mockServerDate;
}

function getMockCreateCollection() {
    return jest.fn().mockResolvedValue('todo: maybe succes');
}

function getMockCollection(responseValue) {
    const mockResponse = jest.fn().mockImplementation(() => {
        return { data: responseValue };
    });
    const mockUpdate = jest.fn().mockReturnValue(responseValue);
    const mockCount = jest.fn().mockResolvedValue({ total: 1 });
    const mockLimit = jest.fn().mockReturnValue({ get: mockResponse });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockWhere = jest.fn().mockReturnValue({
        get: mockResponse,
        update: mockUpdate,
        count: mockCount,
        skip: mockSkip
    });
    const mockAdd = jest.fn().mockReturnValue(responseValue);
    const mockCollection = jest.fn().mockReturnValue({ where: mockWhere, add: mockAdd });
    return mockCollection;
}

function mockCloudDB(responseValue, serverDateInit = '2020-01-01') {
    const mockCollection = getMockCollection(responseValue);
    const mockCreateCollection = getMockCreateCollection();
    const mockServerDate = getMockServerDate(serverDateInit);
    const mockRunTransaction = jest.fn().mockReturnValue('todo promise');
    const mockStartTransaction = jest.fn().mockReturnValue('promise');
    const mockDB = jest.fn().mockReturnValue({
        collection: mockCollection,
        createCollection: mockCreateCollection,
        serverDate: mockServerDate,
        runTransaction: mockRunTransaction,
        startTransaction: mockStartTransaction
    });
    return mockDB;
}

module.exports = {
    mockCloudDB
};
