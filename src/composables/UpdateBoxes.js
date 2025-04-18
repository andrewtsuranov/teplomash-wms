export const useUpdateBoxes = (boxes, svgContainer) => {
  // Очищаем предыдущие коробки
  svgContainer.querySelectorAll(".box").forEach((box) => box.remove());

  // Добавляем новые коробки
  boxes.forEach((box) => {
    const boxElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    boxElement.setAttribute("class", "box");
    boxElement.setAttribute("x", box.x);
    boxElement.setAttribute("y", box.y);
    boxElement.setAttribute("width", box.width);
    boxElement.setAttribute("height", box.height);
    boxElement.setAttribute("fill", "gray");
    svgContainer.appendChild(boxElement);
  });
};
