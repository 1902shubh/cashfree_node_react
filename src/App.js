import './App.css';
import {load} from '@cashfreepayments/cashfree-js';
import axios from "axios";

function App() {
  let cashfree;

  var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox" //production - for real payment
    })
  }

  initializeSDK();

  const initializePayment = async (e) => {
    e.preventDefault();

    let order_id = new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString();
    let order_amount = e.target.order_amount.value;
    let customer_id = e.target.customer_id.value;
    let customer_phone = e.target.customer_phone.value;

    let order = {
      order_id: order_id,
      order_amount: order_amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_name: "Papaya coders",
        customer_email: "papayacoder@gmail.com"
      },
      order_meta: {
        return_url: "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}"
      }
    }

    axios.post('http://localhost:3001/order', order)
    .then((response) => {
      console.log(response.data);
      doPayment(response.data.payment_session_id, order_id);
    }).catch((error) => {
      console.log(error)
    })
  }

  const doPayment = async (session_id, order_id) => {
    let checkoutOptions = {
      paymentSessionId: session_id,
      redirectTarget: "_modal"
    };

    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        console.log("Clinet side or server side error")
        alert("Some payment error")
      }
      if (result.redirect) {
        console.log("Payment redirected")
      }
      if (result.paymentDetails) {
        console.log("Payment Details: ", result.paymentDetails.paymentMessage);
        console.log(result);
        fetchOrderId(order_id);
        alert("Success: Payment Done")
      }
    })
  }

  const fetchOrderId = (order_id) => {
    axios.post("http://localhost:3001/checkStatus", {
      order_id: order_id
    })
    .then((res) => {
      console.log(res.data);
      alert("Valid: Payment status checked!")
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
  }
  
  return (
    <div className="App">
      <form onSubmit={initializePayment}>
        <input type='text' name="order_amount" placeholder='Order Amount' />
        <input type='text' name="customer_id" placeholder='Customer Id' />
        <input type='text' name="customer_phone" placeholder='Customer Phone Number' />
        <button type='submit'>Create payment</button>
      </form>
    </div>
  );
}

export default App;
