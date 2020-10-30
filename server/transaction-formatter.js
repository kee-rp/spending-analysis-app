class TransactionFormatter {
    format(transaction) {
        const formattedTransaction = {};

        formattedTransaction['date'] = this.formatDate(transaction['date']);
        formattedTransaction['description'] = transaction['description'];
        formattedTransaction['debit'] = this.formatMonetaryValue(
            transaction['debit']
        );
        formattedTransaction['credit'] = this.formatMonetaryValue(
            transaction['credit']
        );
        formattedTransaction['balance'] = this.formatMonetaryValue(
            transaction['balance']
        );

        return formattedTransaction;
    }

    // Modify MM/DD/YYYY to MySQL standard YYYY-MM-DD
    formatDate(date) {
        const dates = date.split('/');

        const year = dates[2];
        const month = dates[0];
        const day = dates[1];

        return year + '-' + month + '-' + day;
    }

    // Modify float values into int
    formatMonetaryValue(monetaryValue) {
        if (monetaryValue === '') {
            return 0;
        } else {
            const floatValue = parseFloat(monetaryValue);
            const intValue = Math.round(floatValue * 100);

            return intValue;
        }
    }
}

module.exports = TransactionFormatter;
