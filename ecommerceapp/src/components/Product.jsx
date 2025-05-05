// Imports
import { useState, useEffect } from 'react'
import { List } from 'antd'
import checkUser from '../checkUser'
import deleteItem from './deleteItem'


const Product = ({product, setState}) => {

    // Code to act on
    const [user, updateUser] = useState({})

    useEffect(() => {
        checkUser(updateUser)
    }, [])

    


    return (
        // Display Here
        <>

            {/* // The List Items (Component?) */}
            <List.Item
                actions={user.isAuthorized ?
                    [<p onClick={() => deleteItem(product.id, setState)}
                        key={product.id}>delete</p>] : null}
            >
                <List.Item.Meta
                    title={product.name}
                    description={product.price} />
            </List.Item>

        </>
        
    )
}

export default Product