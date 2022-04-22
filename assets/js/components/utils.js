function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function fetchPosition(element) {
    let position;
    while (!position) {
        for (let i = 0; i < element.classList.length; i++) {
            try {
                let classValue = element.classList[i];
                position = parseInt(classValue);
                break;
            } catch(e) {
                alert(`ERROR: ${e}`);
            }
        }
    }
    return position;
}


export { 
    sleep,
    fetchPosition
};