// Imports
import { get } from 'aws-amplify/api'

/**
 * getProducts Function
 * 
 * Fetches a list of products from the API and returns them
 */
async function getProducts() {
  const request = await get({
    apiName: 'ecommerceapi',
    path: '/products'
  })

  const { body } = await request.response
  const data = await body.json()

  console.log("Products Obtained");   
  console.log('data:', data)


  
  return data.data.Items // <-- este es el return real de la función
}


export default getProducts