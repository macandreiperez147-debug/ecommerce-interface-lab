function safeDivide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    } catch (error) {
        return error.message;
    } finally {
        console.log("Operation attempted");
    }
}

function generateIDs(count) {
    let result = [];

    for (let i = 0; i < count; i++) {
        if (i === 5) continue;
        result.push(`ID-${i}`);
    }

    return result;
}