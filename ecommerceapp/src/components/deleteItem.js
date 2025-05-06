// Imports
import { del } from 'aws-amplify/api'
import getProducts from './getProducts'

/**
 * deleteItem Function
 * @param {*} id 
 * 
 * Deletes the product with the parsed ID from the url path
 * 
 * Imports Required:
 *  - import { get, del } from 'aws-amplify/api'
 *  - 
 */
async function deleteItem(id, setState) {
  

  try {

      await del({
          apiName: 'ecommerceapi',
          path: `/products/${id}`
      })

  console.log('successfully deleted item')

  // Reload the Products Available
  await new Promise(resolve => setTimeout(resolve, 300)) // wait a (.3)sec so it looks instant
  setState({ products: await getProducts(), loading: false })

  } catch (err) {
  console.log('error: ', err)
  }

  
}

export default deleteItem