// Imports
import { useState, useEffect } from 'react'
import { List } from 'antd'
import { CaretUpOutlined } from '@ant-design/icons'
import checkUser from '../checkUser'
import deleteItem from './deleteItem'
import upvoteItem from './upvoteItem'


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
                actions={
                    // if user is admin, can delete, else can upvote
                    user.isAuthorized ?
                        [<button className="btn" onClick={() => deleteItem(product.id, setState)}
                            key={product.id}>delete</button>] 
                        
                        : 
                        [<button className="btn" onClick={() => upvoteItem(product, setState)}
                            key={product.id}>{product.upvotes} <CaretUpOutlined /></button>]
                    }
            >
                <List.Item.Meta
                    title={product.name}
                    description={product.price} />
            </List.Item>
        </>
        
    )
}

export default Product