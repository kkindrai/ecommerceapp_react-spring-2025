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
        const updatedProducts = await getProducts()
        setState({ products: updatedProducts, loading: false })

    } catch (err) {
        console.log('error: ', err)
    }
}

export default upvoteItem