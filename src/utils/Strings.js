/**
 * A singleton class which implements mostly used string operations.
 *
 * @class Strings
 */
class Strings {
    /**
     * The startsWith() method determines whether a string begins with the characters of another string, returning true or false as appropriate.
     * @param src
     * @param dest
     * @returns {boolean}
     */
    startsWith(value:string, searchString: string, position: number): boolean {
        position = position || 0;
        return value.substr(position, searchString.length) === searchString;
    }

    /**
     * The endsWith() method determines whether a string ends with the characters of another string, returning true or false as appropriate.
     * @param value
     * @param searchString
     * @param position
     * @returns {boolean}
     */
    endsWith(value:string, searchString: string, position: number): boolean {
        if (!value || !searchString || value.length < searchString.length) {
            return false;
        }
        position = position || value.length;
        return value.substring(position - searchString.length, position) === searchString;
    }
}

export default new Strings();