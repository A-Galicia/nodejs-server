
function showImage(elemId, imgSrc) {
    console.log("Mouse is over text");
    console.log("\tElemId:" + elemId + " Image Source:" + imgSrc);
    const elem = document.getElementById(elemId);
    const img = new Image();
    img.src = imgSrc;
    img.style.position = "absolute";
    img.style.zIndex = "1";
    elem.appendChild(img);
}

function hideImage(elemId) {
    console.log("Mouse is off text");
    console.log("\tElemId:" + elemId);
    const elem = document.getElementById(elemId);
    while (elem.childElementCount > 0)
        elem.removeChild(elem.lastChild);
}