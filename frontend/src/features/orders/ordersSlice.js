import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelOrderRequest,
  createOrderRequest,
  fetchOrderReferenceData,
  listOrders,
  updateOrderDestinationRequest,
} from "../../services/api/ordersApi";

function getAuthToken(getState) {
  return getState().auth.token;
}

function rejectMissingToken(rejectWithValue) {
  return rejectWithValue({ message: "Missing authentication token." });
}

function upsertOrder(collection, order) {
  const index = collection.findIndex((item) => item.id === order.id);

  if (index === -1) {
    collection.unshift(order);
    return;
  }

  collection[index] = order;
}

function removeOrder(collection, orderId) {
  return collection.filter((item) => item.id !== orderId);
}

function placeOrderInGroups(state, order) {
  state.currentOrders = removeOrder(state.currentOrders, order.id);
  state.orderHistory = removeOrder(state.orderHistory, order.id);

  if (["delivered", "cancelled"].includes(order.status)) {
    upsertOrder(state.orderHistory, order);
  } else {
    upsertOrder(state.currentOrders, order);
  }
}

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

export const submitOrder = createAsyncThunk("orders/submitOrder", async (payload, { getState, rejectWithValue }) => {
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

export const submitOrderDestinationUpdate = createAsyncThunk(
  "orders/submitOrderDestinationUpdate",
  async ({ orderId, payload }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);

    if (!token) {
      return rejectMissingToken(rejectWithValue);
    }

    try {
      return await updateOrderDestinationRequest(token, orderId, payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const submitOrderCancellation = createAsyncThunk(
  "orders/submitOrderCancellation",
  async ({ orderId, reason }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState);

    if (!token) {
      return rejectMissingToken(rejectWithValue);
    }

    try {
      return await cancelOrderRequest(token, orderId, reason ? { reason } : {});
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrders: [],
    orderHistory: [],
    selectedOrderId: null,
    filters: {
      status: "all",
      query: "",
    },
    status: "idle",
    createStatus: "idle",
    updateStatus: "idle",
    referenceStatus: "idle",
    referenceData: {
      locations: [],
      weightCategories: [],
    },
    error: null,
    fieldErrors: {},
  },
  reducers: {
    selectOrder: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearOrderError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrders = action.payload.currentOrders;
        state.orderHistory = action.payload.orderHistory;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Failed to load orders.";
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
      .addCase(submitOrder.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        placeOrderInGroups(state, action.payload.order);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload?.message ?? "Failed to create order.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(submitOrderDestinationUpdate.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(submitOrderDestinationUpdate.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        placeOrderInGroups(state, action.payload.order);
      })
      .addCase(submitOrderDestinationUpdate.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload?.message ?? "Failed to update destination.";
        state.fieldErrors = action.payload?.errors ?? {};
      })
      .addCase(submitOrderCancellation.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(submitOrderCancellation.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        placeOrderInGroups(state, action.payload.order);
      })
      .addCase(submitOrderCancellation.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload?.message ?? "Failed to cancel order.";
        state.fieldErrors = action.payload?.errors ?? {};
      });
  },
});

export const { selectOrder, setOrderFilters, clearOrderError } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
