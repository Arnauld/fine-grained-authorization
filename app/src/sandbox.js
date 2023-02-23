const { OpenFgaApi, CredentialsMethod } = require('@openfga/sdk'); // OR import { OpenFgaApi } from '@openfga/sdk';

let config = {
    apiScheme: process.env.OPENFGA_API_SCHEME || "http", // optional, defaults to "https"
    apiHost: process.env.OPENFGA_API_HOST || "localhost:8080", // required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
    // storeId: process.env.OPENFGA_STORE_ID, // not needed when calling `CreateStore` or `ListStores`
    credentials: {
        method: CredentialsMethod.ApiToken,
        config: {
            token: process.env.OPENFGA_API_TOKEN || "key1", // will be passed as the "Authorization: Bearer ${ApiToken}" request header
        }
    }
}

const getOrCreateStoreIfNotExists = async function (store_name) {
    const openFga = new OpenFgaApi(config);
    const { stores } = await openFga.listStores();
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i]
        if (store.name === store_name) {
            const storeId = store.id
            console.log("Store found, id: ", storeId)
            return storeId
        }
    }

    // still there ?
    console.log("Store not found in", stores)
    const { id: storeId } = await openFga.createStore({
        name: store_name,
    });
    console.log("Store created, id: ", storeId)
    return storeId
}

const init = async function () {
    const storeId = await getOrCreateStoreIfNotExists("sandbox")
    const openFga = new OpenFgaApi({
        ...config,
        storeId
    });

    const schemaAsJson = require('./sample-schema').sampleAsJson
    const { authorization_model_id } = await openFga.writeAuthorizationModel(schemaAsJson)
    console.log('Schema written, id: ', authorization_model_id)

    const tuples = [
        { user: 'user:anne', relation: 'member', object: 'group:support' },
        { user: 'device:VA_ALO', relation: 'owner', object: 'document:val001' },
        { user: 'device:VA_ALO', relation: 'owner', object: 'document:val002' },
        { user: 'device:VA_ALO', relation: 'owner', object: 'document:val003' },
        { user: 'group:support', relation: 'group', object: 'device:VA_ALO' }
    ]

    // NOTE that one writes the tuple one by one due to the duplicate error management (no idempotent)
    for (let i = 0; i < tuples.length; i++) {
        const tuple = tuples[i];
        const results = await openFga.write({
            authorization_model_id,
            writes: {
                tuple_keys: [tuple]
            }
        })
            .then(result => {
                console.log('Tuple written: ', tuple)
            })
            .catch(err => {
                if (err.responseData?.message?.includes('cannot write a tuple which already exists')) {
                    console.log('Tuple already exists: ', tuple)
                }
                else throw err
            });
    }

    const tuple_keys = [
        {
            user: 'user:anne',
            relation: 'can_read',
            object: 'document:val001',
        },
        {
            user: 'group:support',
            relation: 'can_read',
            object: 'document:val001',
        },

    ]

    for (let i = 0; i < tuple_keys.length; i++) {
        const tuple_key = tuple_keys[i];
        const { allowed } = await openFga.check({
            authorization_model_id,
            tuple_key
        });
        console.log("allowed: ", allowed, tuple_key)
    }

    const result_expand = await openFga.expand({
        authorization_model_id,
        tuple_key: {
            relation: "can_read",
            object: 'document:val001'
        }
    });
    console.log("expand: ", result_expand.tree.root.leaf.tupleToUserset.computed)

}

init()


