import { useState, useEffect } from 'react'
import Container from './Container'
import getProducts from './components/getProducts'
import ProductList from './components/ProductList'

function Main() {

    // Functions Here (states)
    const [state, setState] = useState({products: [], loading: true})
  

    // USE EFFECT!!!
    useEffect(() => {

        // roundabout component method to getProducts
        const fetchData = async () => {
            const products = await getProducts()
            setState({ products, loading: false })
        }

        // effect calls
        fetchData()
    }, [])
  

 

  

  return (
    <Container>
      <h1>React Final Project</h1>
      <p><code>By: Kendra Jade Kindrai</code></p>
      <p>Check submission text file for login info!</p>
      <hr />
      
      
      {/* Display Stuff here */}
      <ProductList state={state} setState={setState}/>



    </Container>

  )
}

export default Main