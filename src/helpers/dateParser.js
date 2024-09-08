export function dateParser(date) {
    const obj = new Date(date);
    const today = new Date();
    const hours = obj.getHours() < 10 ? '0' + obj.getHours() : obj.getHours();
    const minutes = obj.getMinutes() < 10 ? '0' + obj.getMinutes() : obj.getMinutes();

    if (obj.getMonth() == today.getMonth()) {
        if (obj.getDate() == today.getDate()) {
            return `Сегодня, в ${hours}:${minutes}`;
        } else if (obj.getDate() == today.getDate() - 1) {
            return `Вчера, в ${hours}:${minutes}`;
        }
    }

    const day = obj.getDate() < 10 ? '0' + obj.getDate() : obj.getDate()
    const month = obj.getMonth() + 1;
    const year = obj.getFullYear();

    return `${day}.${month < 10 ? '0' + month : month}.${year}, в ${hours}:${minutes}`;
}