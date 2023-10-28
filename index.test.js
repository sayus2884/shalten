const Shalten = require("./index");

describe("Shalten methods", () => {
  const [TEST_KEY1, TEST_KEY2] = ["test", "test2"];
  const testFunc = () => {
    return () => {};
  };
  const testFunc2 = () => {};
  const testValue = [TEST_KEY1, { func: testFunc, state: "off" }];
  const testValue2 = [TEST_KEY2, testFunc2];
  const board = new Shalten([testValue2]);

  test("contains added shalten value", () => {
    const shaltenItem = board.add(TEST_KEY1, testFunc).get(TEST_KEY1);
    expect(shaltenItem).toEqual({ func: testFunc, state: "off" });
  });

  test("contains list of values", () => {
    expect(board.values).toEqual([
      [TEST_KEY2, { func: testFunc2, state: "off" }],
      testValue,
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
    }).toThrow(`Shalten ${TEST_KEY1} not found`);
  });

  test("do nothing if there's no cleanup", () => {
    expect(() => {
      board.switchOn(TEST_KEY2);
    }).not.toThrow();
  });

  test("turn off all shalten values", () => {
    board.switchAllOff();
    const shaltens = board.values;

    expect(shaltens).toEqual([[TEST_KEY2, { func: testFunc2, state: "off" }]]);
  });
});

describe("Fetch data from API", () => {
  const fetchDataApi = jest.fn().mockReturnValue({ data: "data" });

  let data = null;
  const fetchData = (_arg) => () => {
    data = fetchDataApi();
  };

  const board = new Shalten([["fetchData", fetchData("stuff")]]);

  test("turn on shalten value", () => {
    board.switchOn("fetchData");

    expect(fetchDataApi).toHaveBeenCalled();
  });

  test("check if shalten value is on", () => {
    expect(board.get("fetchData").state).toEqual("on");
  });

  test("check if data var received mock up data", () => {
    expect(data).toEqual({ data: "data" });
  });
});
