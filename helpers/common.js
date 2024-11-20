const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

function hp(percentage) {
  return (percentage * deviceHeight) / 100;
}
function wp(percentage) {
  return (percentage * deviceHeight) / 100;
}