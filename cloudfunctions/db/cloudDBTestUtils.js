function mockCloudDB(responseValue, serverDateInit = '2020-01-01') {
    const mockResponse = jest.fn().mockImplementation(() => responseValue);
    const mockWhere = jest.fn().mockReturnValue({ get: mockResponse });
    const mockCollection = jest.fn().mockReturnValue({ where: mockWhere });
    const mockCreateCollection = jest.fn().mockReturnValue('promise');
    const mockServerDate = jest.fn().mockImplementation(({ offset }) => {
        const date = new Date(serverDateInit);
        date.setMilliseconds(offset);
        return date;
    });
    const mockRunTransaction = jest.fn().mockReturnValue('todo promise');
    const mockStartTransaction = jest.fn().mockReturnValue('promise');
    const mockDB = jest.fn().mockReturnValue({
        collection: mockCollection,
        createCollection: mockCreateCollection,
        serverDate: mockServerDate,
        runTransaction: mockRunTransaction,
        startTransaction: mockStartTransaction
    });
    return {
        mockDB
    };
}

module.exports = {
    mockCloudDB
};
