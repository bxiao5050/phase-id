import 'core-js/es/promise/index';
import 'core-js/es/map/index';
import 'core-js/es/set/index';
import 'core-js/es/object/assign';
/* 打补丁 */
/* requestAnimationFrame 和 cancelAnimationFrame 的补丁 react 需要*/
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback: FrameRequestCallback) {
    return (setTimeout(callback, 1000 / 60) as unknown) as number;
  };
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
