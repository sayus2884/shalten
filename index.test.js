const ShaltenBoard = require("./index");

describe("Shalten methods", () => {
  const [TEST_KEY1, TEST_KEY2] = ["test", "test2"];
  const testFunc = () => {};
  const testValue = [TEST_KEY1, { func: testFunc, state: "off" }];
  const testValue2 = [TEST_KEY2, testFunc];
  const board = new ShaltenBoard([testValue2]);

  test("contains added shalten value", () => {
    const shaltenItem = board.add(TEST_KEY1, testFunc).get(TEST_KEY1);
    expect(shaltenItem).toEqual({ func: testFunc, state: "off" });
  });

  test("contains list of values", () => {
    expect(board.shaltens).toEqual([
      { name: TEST_KEY2, state: "off" },
      { name: testValue[0], state: testValue[1].state },
    ]);
  });

  test("turns on shalten value", () => {
    const shaltenItem = board.switchOn(TEST_KEY1).get(TEST_KEY1);

    expect(shaltenItem).toEqual({ func: testFunc, state: "on" });
  });

  test("turns off shalten value", () => {
    const shaltenItem = board.switchOff(TEST_KEY1).get(TEST_KEY1);
    expect(shaltenItem).toEqual({ func: testFunc, state: "off" });
  });

  test("does not contain removed shalten value", () => {
    const shaltenItem = board
      .add(TEST_KEY1, testFunc)
      .remove(TEST_KEY1)
      .get(TEST_KEY1);

    expect(shaltenItem).toBeUndefined();
  });

  test("throws shalten not found", () => {
    expect(() => {
      board.switchOn(TEST_KEY1);
    }).toThrow(`Shalten "${TEST_KEY1}" not found`);
  });

  test("turn off all shalten values", () => {
    board.switchAllOff();
    const shaltens = board.shaltens;

    expect(shaltens).toEqual([{ name: TEST_KEY2, state: "off" }]);
  });
});

describe("Fetch data from API", () => {
  const board = new ShaltenBoard();
  const fetchDataApi = jest.fn().mockReturnValue({ data: "data" });
  const checkState = jest.fn((state) => state).mockReturnValue("loading");
  let data = null;

  const fetchData = (_arg) => () => {
    const state = board.get("fetchData").state;
    checkState(state);
    data = fetchDataApi();
  };

  board.add("fetchData", fetchData("stuff"));

  test("turn on shalten value", () => {
    board.switchOn("fetchData");

    expect(fetchDataApi).toHaveBeenCalled();
  });

  test("check if shalten value is loading", () => {
    expect(checkState.mock.results[0].value).toEqual("loading");
  });

  test("check if shalten value is on", () => {
    expect(board.get("fetchData").state).toEqual("on");
  });

  test("check if data var received mock up data", () => {
    expect(data).toEqual({ data: "data" });
  });
});
