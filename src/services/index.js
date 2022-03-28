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

async function getTransactionsByAccount(account, page, offset) {
    return await xapi
        .get("", {
            params: {
                module: "account",
                action: "txlist",
                address: account,
                startblock: 0,
                endblock: 'latest',
                page: page,
                offset: offset,
                sort: 'desc'
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


async function getTransactionCountByAccount(account) {
    return await xapi
        .get("", {
            params: {
                module: "proxy",
                action: "eth_getTransactionCount",
                address: account,
                endblock: 'latest',
            },
        })

}

const apiCalls = {
    getBalanceByAccount: (account) => getBalanceByAccount(account),
    getTransactionCountByAccount: (account) => getTransactionCountByAccount(account),
    getTransactionsByAccount: (account, page, offset) => getTransactionsByAccount(account, page, offset),
    getTransactionsByBlockRange: () => getTransactionsByBlockRange()

}

export default apiCalls
