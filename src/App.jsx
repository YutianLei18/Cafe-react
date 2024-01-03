import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [order, setOrder] = useState([]);
  const [k,setK] = useState(0);
  const [done,setDone] = useState(false);
  const [orderNumber,setOrderNumber] = useState(0);

function addToOrder(item){
  let newItem = {iditem:item.iditem,name:item.name,cost:item.cost,meal:item.meal,id:k};
  setK(k+1);
  setOrder([...order,newItem]);
}

const orderItem = itemId => {
  const item = items.find(item => item.iditem === itemId);
  setOrder([...prevOrder, item]);
};
  // const filterMeal = selectedMeal => {
  //   setMeal(selectedMeal);
  // };

  // const removeItem = index => {
  //   setOrder(prevOrder => prevOrder.filter((_, i) => i !== index));
  // };

  const placeOrder = (number) => {
    setOrderNumber(number);
  };

  function removeFromOrder(index) {
    setOrder(order.filter(o=>o.id!=index));
  }

  function doDone() {
    setDone(true);
  }

  if(done == true) {
    return (<ShowConfirm data={orderNumber}/>)
  } else 
  return (
    <>
    <Menu addItem={addToOrder} />
    <Order orders={order} removeItem={removeFromOrder} />
    <PlaceOrder orders={order} placeOrder={placeOrder} doDone={doDone}/> 
    </>
  );
}


function Menu({ addItem }) {
  const [items, setItems] = useState([]);
  const [meal, setMeal] = useState('lunch');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('https://cmsc106.net/cafe/item')
      .then(response => response.json())
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  };

  function filterToMeal(){
    return items.filter((item)=>item.meal == meal);
  }
  return (
    <div>
      <button onClick={() => setMeal('breakfast')}>Breakfast</button>
      <button onClick={() => setMeal('lunch')}>Lunch</button>
      <button onClick={() => setMeal('dinner')}>Dinner</button>
      <table>
        <tbody>
          {filterToMeal().map(item => (
            <MenuItem key={item.iditem} item={item} orderItem={addItem}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MenuItem({ item, orderItem }) {
  return (
    <tr>
      <td className="align-middle">{item.name}</td>
      <td className="align-middle">${item.cost / 100}</td>
      <td>
        <button className="btn btn-secondary align-middle" onClick={() => orderItem(item)}>
          Order
        </button>
      </td>
    </tr>
  );
}

function Order({ orders, removeItem,iditem }) {
  
  return (
    <div>
      <table>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((item, index) => (
              <OrderItem key={item.iditem} item={item} removeItem={() => removeItem(item.id)} />
            ))
          ) : (
            <tr>
              <td colSpan="3">No items in order</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


function OrderItem({ item, removeItem }) {
  
  return (
    <tr>
      <td className="align-middle">{item.name}</td>
      <td className="align-middle">${item.cost / 100}</td>
      <td>
        <button className="btn btn-secondary align-middle" onClick={removeItem}>
          Remove
        </button>
      </td>
    </tr>
  );
}

function PlaceOrder({ orders, placeOrder , doDone }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const nameInput = useRef();
  const phoneInput = useRef();
  

  const handlePlaceOrder = () => {
    const ids = [];
    for (let n = 0; n < orders.length; n++) {
      ids.push(orders[n].iditem);
    }

    const toPost = {
      name: nameInput.current.value,
      phone: phoneInput.current.value,
      items: ids
    };

  fetch('https://cmsc106.net/cafe/purchase', {
    method: 'POST',
    body: JSON.stringify(toPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(response => showConfirm(response));

  doDone();
};

const showConfirm = (response) => {
  console.log('Order placed successfully!', response);
  placeOrder(response);
};



return (
  <div>
    <input
      type="text"
      placeholder="Name"
      ref={nameInput}
    />
    <input
      type="text"
      placeholder="Phone"
      ref={phoneInput}
    />
    <button onClick={handlePlaceOrder}>Place Order</button>
  </div>
);
}

function ShowConfirm({data}) {
  

  return (
    <div>
      <p>Your order number is {data}</p>
    </div>
  );
}



export default App;