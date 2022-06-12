import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import CartItem from './CartItem';
import { cartItemsReceived, cartItemsCheckout } from '../actions/cartActions';

const getCartTotal = (items) => items.reduce((prev, curr) => prev + curr.price * curr.quantity, 0);

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartItems);

  useEffect(() => {
    const getCartItems = async () => {
      const { data } = await axios.get('http://localhost:5001/api/cart');
      dispatch(cartItemsReceived(data));
    }

    getCartItems();
  }, [dispatch]);

  const checkout = async () => {
    const deletedItems = await axios.post('/api/checkout');
    return deletedItems;
  }
  
  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await checkout();
      dispatch(cartItemsCheckout([]));
    } catch (err) {
      console.log('checkout failed: ', err);
      alert('Checkout failed');
    }
  }

  const checkoutButtonClass = () => {
    if (cartItems.length > 0) {
      return 'button checkout';
    }
    return 'button checkout disabled';
  }

  return ( 
    <div className='cart'>
      <h2>Your Cart</h2>
      {cartItems.length === 0 &&
      <>
        <p>Your cart is empty</p>
        <br />
        <p>Total: $0</p>
      </>
      }
      {cartItems.length > 0 &&
      <table className='cart-items'>
        <tbody>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
            {cartItems.map( item => (
              <CartItem key={item._id} title={item.title} quantity={item.quantity} price={item.price} />
            ))}
          <tr>
            <td colSpan='3' className='total'>Total: ${getCartTotal(cartItems)}</td>
          </tr>
        </tbody>
      </table>
      }
      <a href='/#' className={checkoutButtonClass()} onClick={handleCheckout}>Checkout</a>
    </div> 
  );
};

export default Cart;