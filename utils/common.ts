
export function formatDateToDDMMYYYY(date: Date | string): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatDateToYYYYMMDD(date: Date | string): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
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

export function getNextDate(currentDate: Date) {
    let nextDate = new Date(currentDate);

    nextDate.setDate(nextDate.getDate() + 1);

    let dd = String(nextDate.getDate()).padStart(2, '0');
    let mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    let yyyy = nextDate.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

export function disablePreviousDates(elemId: string): void {
    let today: Date = new Date();
    let dd: string = String(today.getDate()).padStart(2, '0');
    let mm: string = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy: string = today.getFullYear().toString();

    let currentDate: string = yyyy + '-' + mm + '-' + dd;
    const datePicker: HTMLInputElement | null = document.getElementById(`${elemId}`) as HTMLInputElement;

    if (datePicker) {
        datePicker.setAttribute('min', currentDate);
    }
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

export function getTotalDays(startDate: string, endDate: string): number {

    const start: Date = new Date(startDate);
    const end: Date = new Date(endDate);

    const diffTime: number = Math.abs(end.getTime() - start.getTime());
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
}



