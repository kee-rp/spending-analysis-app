const TransactionFormatter = require('../transaction-formatter');

describe('TransactionFormatter', () => {
    it('should format JSON object accordingly', () => {
        const formatterInstance = new TransactionFormatter();

        const input = {
            date: '09/23/2020',
            description: 'SHOPPERSDRUGMART2273',
            debit: '12.31',
            credit: '',
            balance: '-86.06'
        };

        const output = {
            date: '"2020-09-23"',
            description: '"SHOPPERSDRUGMART2273"',
            debit: 1231,
            credit: 0,
            balance: -8606
        };

        expect(formatterInstance.format(input)).toEqual(output);
    });

    it('it should format JSON object accordingly 2', () => {
        const formatterInstance = new TransactionFormatter();

        const input = {
            date: '10/04/2020',
            description: 'UBER * PENDING',
            debit: '62.73',
            credit: '',
            balance: '541.51'
        };

        const output = {
            date: '"2020-10-04"',
            description: '"UBER * PENDING"',
            debit: 6273,
            credit: 0,
            balance: 54151
        };

        expect(formatterInstance.format(input)).toEqual(output);
    });
});
