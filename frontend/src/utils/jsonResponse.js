export function encodeJson(type, data) {
    return JSON.stringify({type, data});
}
export function decodeJson(data) {
    return JSON.parse(data);
}