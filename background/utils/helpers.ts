export function stringDoesNotContainAnyFromArray(str: string): boolean {
    const array: string[] = ["newtab", "localhost"];

    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false;
        }
    }
    return true;
}