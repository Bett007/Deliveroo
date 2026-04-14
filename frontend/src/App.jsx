import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateSession } from "./features/auth/authSlice";
import { fetchOrders } from "./features/orders/ordersSlice";
import { AppRouter } from "./routes/AppRouter";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    let isActive = true;

    if (token) {
      (async () => {
        const result = await dispatch(hydrateSession());

        if (isActive && hydrateSession.fulfilled.match(result)) {
          dispatch(fetchOrders());
        }
      })();
    }

    return () => {
      isActive = false;
    };
  }, [dispatch, token]);

  return <AppRouter />;
}

export default App;
