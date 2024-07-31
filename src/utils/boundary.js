// export const setNewOffSet = (card, mousemOveDir = {x: 0, y: 0}) => {
//     const offsetLeft = card.offsetLeft - mousemOveDir.x
//     const offsetTop = card.offsetTop - mousemOveDir.y


//     return {
//         x: offsetLeft < 0 ? 0 : offsetLeft,
//         y: offsetTop < 0 ? 0 : offsetTop
//     }
// }


export const setNewOffSet = (card, offset = { x: 0, y: 0 }) => {
    const offsetLeft = card.offsetLeft + offset.x;
    const offsetTop = card.offsetTop + offset.y;
  
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
  
    const maxOffsetLeft = window.innerWidth - cardWidth;
    const maxOffsetTop = window.innerHeight - cardHeight;
  
    return {
      x: Math.max(0, Math.min(maxOffsetLeft, offsetLeft)),
      y: Math.max(0, Math.min(maxOffsetTop, offsetTop))
    };
  };
  