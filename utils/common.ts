
export function formatDateToDDMMYYYY(date: Date | string): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatDateToDDMMYYYYWithTime(date: Date | string): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function truncateString(str: string) {
    if (str.length > 20)
        return str.substring(0, 20) + '...';
    else
        return str;
}

export function getDayText(day: number) {
    if (day === 1)
        return `${day} Day`;
    else
        return `${day} Days`;
}

export function capitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTotalVoucherAmount(data: any): number {

    if (data?.length > 0) {
        let totalAmt = 0;
        data.forEach((item: any) => {
            totalAmt = totalAmt + +item.amount;
        });

        return totalAmt;
    }
    return 0
}

