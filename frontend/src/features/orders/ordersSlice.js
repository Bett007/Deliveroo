import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelOrderRequest,
  createOrderRequest,
  fetchOrderReferenceData,
  getOrderRequest,
  listOrders,
  listTrackingUpdatesRequest,
  updateOrderDestinationRequest,
} from "../../services/api/ordersApi";

const terminalStatuses = new Set(["delivered", "cancelled"]);

function getAuthToken(getState) {
  return getState().auth.token;
}

function rejectMissingToken(rejectWithValue) {
  return rejectWithValue({ message: "Missing authentication token." });
}

function sortByNewest(items) {
  return [...items].sort((left, right) => {
    const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime();
    const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime();
    return rightTime - leftTime;
  });
}

function splitOrders(items) {
  const sortedItems = sortByNewest(items);

  return sortedItems.reduce(
    (accumulator, order) => {
      if (terminalStatuses.has(order.status)) {
        accumulator.orderHistory.push(order);
      } else {
        accumulator.currentOrders.push(order);
      }

      return accumulator;
    },
    { currentOrders: [], orderHistory: [] },
  );
}

function mergeOrderCollections(state, incomingOrder) {
  const mergedOrders = [...state.currentOrders, ...state.orderHistory].filter(
    (order) => String(order.id) !== String(incomingOrder.id),
  );

  const nextCollections = splitOrders([incomingOrder, ...mergedOrders]);
  state.currentOrders = nextCollections.currentOrders;
  state.orderHistory = nextCollections.orderHistory;
}

const initialState = {
  currentOrders: [],
  orderHistory: [],
  selectedOrder: null,
  trackingUpdates: {},
  referenceData: {
    locations: [],
    weightCategories: [],
  },
  filters: {
    status: "all",
    query: "",
  },
  status: "idle",
  createStatus: "idle",
  detailsStatus: "idle",
  trackingStatus: "idle",
  mutationStatus: "idle",
  referenceStatus: "idle",
  error: null,
  fieldErrors: {},
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, { getState, rejectWithValue }) => {
  const token = getAuthToken(getState);

  if (!token) {
    return rejectMissingToken(rejectWithValue);
  }

  try {
    return await listOrders(token);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (orderId, { getState, rejectWithValue }) => {
  const token = getAuthToken(getState);

  if (!token) {
    return rejectMissingToken(rejectWithValue);
  }

  try {
    return await getOrderRequest(token, orderId);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchTrackingUpdates = createAsyncThunk(
  "orders/fetchTrackingUpdates",
  async (orderId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);

    if (!token) {
      return rejectMissingToken(rejectWithValue);
    }

    try {
      const response = await listTrackingUpdatesRequest(token, orderId);
      return { orderId: String(orderId), updates: response.updates };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loadOrderReferenceData = createAsyncThunk(
  "orders/loadOrderReferenceData",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);

    if (!token) {
      return rejectMissingToken(rejectWithValue);
    }

    try {
      return await fetchOrderReferenceData(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createOrder = createAsyncThunk("orders/createOrder", async (payload, { getState, rejectWithValue }) => {
  const token = getAuthToken(getState);

  if (!token) {
    return rejectMissingToken(rejectWithValue);
  }

  try {
    return await createOrderRequest(token, payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateOrderDestination = createAsyncThunk(
  "orders/updateOrderDestination",
  async ({ orderId, deliveryLocationId }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);

    if (!token) {
      return rejectMissingToken(rejectWithValue);
    }

    try {
      return await updateOrderDestinationRequest(token, orderId, {
        delivery_location_id: deliveryLocationId,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async ({ orderId, reason }, { getState, rejectWithValue }) => {
  const token = getAuthToken(getState);

  if (!token) {
    return rejectMissingToken(rejectWithValue);
  }

  try {
    return await cancelOrderRequest(token, orderId, reason ? { reason } : {});
  } catch (error) {
    return rejectWithValue(error);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetOrdersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.fieldErrors = {};
        state.selectedOrder = state.selectedOrder
          ? action.payload.items.find((order) => String(order.id) === String(state.selectedOrder.id)) || state.selectedOrder
          : null;

        const collections = splitOrders(action.payload.items);
        state.currentOrders = collections.currentOrders;
        state.orderHistory = collections.orderHistory;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Failed to load orders.";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.detailsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.error = null;
        state.selectedOrder = action.payload.order;
        mergeOrderCollections(state, action.payload.order);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.error = action.payload?.message ?? "Failed to load order details.";
      })
      .addCase(fetchTrackingUpdates.pending, (state) => {
        state.trackingStatus = "loading";
      })
      .addCase(fetchTrackingUpdates.fulfilled, (state, action) => {
        state.trackingStatus = "succeeded";
        state.trackingUpdates[action.payload.orderId] = action.payload.updates;
      })
      .addCase(fetchTrackingUpdates.rejected, (state, action) => {
        state.trackingStatus = "failed";
        state.error = action.payload?.message ?? "Failed to load tracking updates.";
      })
      .addCase(loadOrderReferenceData.pending, (state) => {
        state.referenceStatus = "loading";
      })
      .addCase(loadOrderReferenceData.fulfilled, (state, action) => {
        state.referenceStatus = "succeeded";
        state.referenceData = action.payload;
      })
      .addCase(loadOrderReferenceData.rejected, (state, action) => {
        state.referenceStatus = "failed";
        state.error = action.payload?.message ?? "Failed to load order reference data.";
      })
      .addCase(createOrder.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.error = null;
        mergeOrderCollections(state, action.payload.order);
        state.selectedOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload?.message ?? "Failed to create order.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(updateOrderDestination.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(updateOrderDestination.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.error = null;
        mergeOrderCollections(state, action.payload.order);
        state.selectedOrder = action.payload.order;
      })
      .addCase(updateOrderDestination.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload?.message ?? "Failed to update destination.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(cancelOrder.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.error = null;
        mergeOrderCollections(state, action.payload.order);
        state.selectedOrder = action.payload.order;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload?.message ?? "Failed to cancel order.";
        state.fieldErrors = action.payload?.errors ?? {};
      });
  },
});

export const { clearOrderError, clearSelectedOrder, setOrderFilters, resetOrdersState } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
