// Imports
import { put } from 'aws-amplify/api'
import getProducts from './getProducts'

async function upvoteItem(product, setState) {


    // Modify the body
    const modifiedProduct = {
        upvotes: product.upvotes + 1
    }

    console.log(product.upvotes)
    console.log(modifiedProduct.upvotes)


    try {

        // Put method to modify
        await put({
            apiName: 'ecommerceapi',
            path: `/products/${product.id}`,
            options: {
                body: modifiedProduct,
            }
        })

        console.log('successfully modified item')
        
        // Reload the Products Available
        await new Promise(resolve => setTimeout(resolve, 300)) // wait a (.3)sec so it looks instant
        setState({ products: await getProducts(), loading: false })

    } catch (err) {
        console.log('error: ', err)
    }

    
}

export default upvoteItem