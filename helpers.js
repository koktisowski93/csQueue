const onExitResult = (state = false, msg = "", data = null) => {
  return {
    state,
    msg,
    data,
  };
};


module.exports = onExitResult

// export default onExitResult