import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import axios from 'axios';

let ClientList: any[] = [];

interface ClientName {
    name: string;
}

interface Month {
    mon: string;
    date: string;
}

interface Year {
    year: string;
    date: string;
}

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

export async function getClientList() {
    if (typeof window !== 'undefined' && window.localStorage.getItem('jwtToken')) {
        const taskConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('jwtToken')}`
            },
        };

        const objData = { type: "LIST" };

        try {
            const response = await axios.post(`${publicRuntimeConfig.API_URL}client`, JSON.stringify(objData), taskConfig);
            ClientList = response.data.map((item: ClientName) => {
                return {
                    value: item.name,
                    label: item.name.toLowerCase()
                };
            });

        } catch (error) {
            console.error('Error fetching client list', error);
        }
    }
}

export function getCurrentDay(date: Date): string {

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date(date as Date);
    const currentDay = days[currentDate.getDay()];

    return currentDay;
}

export function getMonthList(): Month[] {

    const month: Month[] = [
        { mon: 'January', date: "2024-01-01" },
        { mon: 'February', date: "2024-02-01" },
        { mon: 'March', date: "2024-03-01" },
        { mon: 'April', date: "2024-04-01" },
        { mon: 'May', date: "2024-05-01" },
        { mon: 'June', date: "2024-06-01" },
        { mon: 'July', date: "2024-07-01" },
        { mon: 'August', date: "2024-08-01" },
        { mon: 'September', date: "2024-09-01" },
        { mon: 'October', date: "2024-10-01" },
        { mon: 'November', date: "2024-11-01" },
        { mon: 'December', date: "2024-12-01" }];

    return month;
}

export function getYearList(): Year[] {

    const year: Year[] = [
        { year: '2024', date: "2024-01-01" },
        { year: '2025', date: "2025-02-01" },
        { year: '2026', date: "2026-03-01" },
        { year: '2027', date: "2027-04-01" },
        { year: '2028', date: "2028-05-01" },
        { year: '2029', date: "2029-06-01" },
        { year: '2030', date: "2030-07-01" },
        { year: '2031', date: "2031-08-01" },
        { year: '2032', date: "2032-09-01" },
        { year: '2033', date: "2033-10-01" },
        { year: '2034', date: "2034-11-01" },
        { year: '2034', date: "2035-12-01" }];

    return year;
}



await getClientList();

// property exported
export { ClientList };



