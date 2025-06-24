export function getHeightAboveComponent(element) {
  if (!element) {
    return 0;
  }
  let height = 0;
  let currentElement = element;

  while (currentElement) {
    height += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }
  return height;
}
