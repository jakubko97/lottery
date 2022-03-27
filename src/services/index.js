import xapi from '@/plugins/index/axios.js'

async function getBalanceByAccount(account) {
    return await xapi
        .get("", {
            params: {
                module: "account",
                action: "balance",
                address: account,
                tag: "latest",
            },
        })
}

async function getTransactionsByAccount(account) {
    return await xapi
        .get("", {
            params: {
                module: "account",
                action: "txlist",
                address: account,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 10,
                sort: 'asc'
            },
        })
}

async function getTransactionsByBlockRange() {
    return await xapi
        .get("", {
            params: {
                module: "account",
                action: "txlistinternal",
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 10,
                sort: 'asc'
            },
        })

}

const apiCalls = {
    getBalanceByAccount: (account) => getBalanceByAccount(account),
    getTransactionsByAccount: (account) => getTransactionsByAccount(account),
    getTransactionsByBlockRange: () => getTransactionsByBlockRange()

}

export default apiCalls
