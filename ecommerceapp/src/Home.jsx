import { useState, useEffect } from 'react'
import Container from './Container'
import { get, del } from 'aws-amplify/api'
import { List } from 'antd'
import checkUser from './checkUser'

function Main() {
  const [state, setState] = useState({products: [], loading: true})
  const [user, updateUser] = useState({})
  //let didCancel = false
  
  useEffect(() => {
    getProducts()
    checkUser(updateUser)
    // return () => didCancel = true
  }, [])
  

  /**
   * getProducts Function
   * 
   * Creates a list of products from our api
   * 
   * Imports Required:
   *  - import { get, del } from 'aws-amplify/api'
   *  - import { useState, useEffect } from 'react'
   */
  async function getProducts() {
    const request = await get({
        apiName: 'ecommerceapi',
        path: '/products'
    });

    const { body } = await request.response;
    const data = await body.json();

    console.log('data: ', data)
    //if (didCancel) return
    setState({
      products: data.data.Items, loading: false
    })
  }

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
  async function deleteItem(id) {
    try {
        const products = state.products.filter(p => p.id !== id)

        await del({
            apiName: 'ecommerceapi',
            path: `/products/${id}`
        })

      console.log('successfully deleted item')

    } catch (err) {
      console.log('error: ', err)
    }
  }



  return (
    <Container>
      
      {/* The List */}
      <List
        itemLayout="horizontal"
        dataSource={state.products}
        loading={state.loading}
        renderItem={item => (
          
          // The List Items (Component?)
          <List.Item
            actions={user.isAuthorized ?
              [<p onClick={() => deleteItem(item.id)}
              key={item.id}>delete</p>] : null}
          >
            <List.Item.Meta
              title={item.name}
              description={item.price}
            />
          </List.Item>
        )}
      />
    </Container>

    

  )
}

export default Main