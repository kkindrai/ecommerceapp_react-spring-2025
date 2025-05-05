// Imports
import { get, del } from 'aws-amplify/api'
import { useState, useEffect } from 'react'
import getProducts from './getProducts'
import setState from '../Final'

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
  const updatedProducts = await getProducts()
  setState({ products: updatedProducts, loading: false })

  } catch (err) {
  console.log('error: ', err)
  }
}

export default deleteItem