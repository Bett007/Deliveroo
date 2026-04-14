import { store } from "../store";

describe("Redux Store", () => {
  it("is defined", () => {
    expect(store).toBeDefined();
  });

  it("has getState and dispatch functions", () => {
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
  });
});
