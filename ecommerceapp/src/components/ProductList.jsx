// Imports
import { List } from 'antd'
import Product from './Product'

const ProductList = ({ state, setState }) => {
    return (
      <>
        {state ? (
          <List
            className="product-list"
            itemLayout="horizontal"
            dataSource={state.products}
            loading={state.loading}
            renderItem={item => (
              <Product product={item} setState={setState} />
            )}
          />
        ) : (
          <p>No Data Loaded...</p>
        )}
      </>
    )
  }

export default ProductList