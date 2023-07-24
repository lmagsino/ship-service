const mock = jest.fn().mockImplementation(() => ({
  async getSummary() {
    return 1;
  }
}));
export default mock;
