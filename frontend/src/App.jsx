import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateSession } from "./features/auth/authSlice";
import { fetchOrders } from "./features/orders/ordersSlice";
import { AppRouter } from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(hydrateSession());
      dispatch(fetchOrders());
    }
  }, [dispatch, token]);

  return <AppRouter />;
}

export default App;
