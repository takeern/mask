export const checkType = (obj: any, type: string) => {
    const checkType = {
        string: '[object String]',
        number: '[object Number]',
        function: '[object Function]',
        null: '[object Null]',
        undefined: '[object Undefined]',
    }
    return Object.prototype.toString.apply(obj) === checkType[type];
}

export const checkObjMiss = (obj: any, keys: string[]) => {
    let msg: string = null;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!obj[key]) {
            msg += ', ';
        }
    }
    return msg;
}