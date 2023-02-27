import { createContext, ReactNode, useContext, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';

type ShoppingCartProviderProps = {
  children: ReactNode
};

type CartItem = {
  id: number
  quantity: number
}

type ShoppingCartContextType = {
  getItemQuantity: (id: number) => number
  increaseCartQuantity: (id: number) => void
  decreaseCartQuantity: (id: number) => void
  removeFromCart: (id: number) => void
  openCart: () => void
  closeCart: () => void
  cartQuantity: number
  cartItems: CartItem[]
};

const ShoppingCartContext = createContext({} as ShoppingCartContextType);


export function useShoppingCart() {
  return useContext(ShoppingCartContext);
};


export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  };

  function increaseCartQuantity(id: number) {
    setCartItems(currItems => {
        if(currItems.find(item => item.id === id) == null) {
            return [...currItems, { id, quantity: 1 }];
        } else {
            return currItems.map(item => {
                if(item.id === id) {
                    return {...item, quantity: item.quantity + 1 }; 
                } else {
                    return item;
                }
            })
        }
    })
  };

  function decreaseCartQuantity(id: number) {
    setCartItems(currItems => {
        if(currItems.find(item => item.id === id)?.quantity == 1) {
            return currItems.filter(item => item.id !== id);
        } else {
            return currItems.map(item => {
                if(item.id === id) {
                    return {...item, quantity: item.quantity - 1 }; 
                } else {
                    return item;
                }
            })
        }
    })
  };

  function removeFromCart(id: number) {
    setCartItems(currItems => {
      return currItems.filter(item => item.id !== id);
    }) 
  };

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity, 0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <ShoppingCartContext.Provider 
        value={{
          getItemQuantity,
          increaseCartQuantity,
          decreaseCartQuantity,
          removeFromCart,
          cartItems,
          cartQuantity,
          openCart,
          closeCart,
    }}>
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  )
};


//every time you use a provider, the provider needs to have objects and children
//inside of it. So, we are creating a wrapper around our context that has this
//children object 

//we dont have addToCart function in our type as it is the same function as increaseCartQuantity

//cartItems.find(item => item.id === id)?.quantity || 0; --> 
//cartItems.find(item => item.id === id)? if this part evaluates to smth return quantity
//otherwise return zero:  || 0

//increaseCartQuantity: if(currItems.find(item => item.id === id) == null) means this id doesnt exist in
//our currentItems so we need to add it to cart!

//decreaseCartQuantity if(currItems.find(item => item.id === id)?.quantity == 1) if 
//quantity is 1 then get rid of it


