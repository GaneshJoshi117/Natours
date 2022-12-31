import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51MKTwDSEsbiyeA2cUAH8ozKi6pE8R7LuaY54g9ab34ZkA7NzQPjF4KsuavRqjqxAL1SZwvHFugm5MipXi25EoEzR00bxnGzdIQ'
    );
    //   console.log(tourId);
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });
    console.log(session);
    /////////////////////////////////////////////////
    //checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    // window.location.replace(session.data.session.url);
  } catch (e) {
    showAlert('error', e);
  }
};
