function createRandomColor() {
    let colorInt = Math.floor(Math.random() * 16777215);
    let colorString = ('000000' + colorInt.toString(16)).slice(-6);
    return '#' + colorString;
}

export { createRandomColor };
