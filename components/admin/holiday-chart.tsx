import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Paper } from '@material-ui/core';
import { EventContentArg } from '@fullcalendar/react';

type Holiday = {
    title: string;
    date: string;
    isHoliday: boolean;
};

// Define your holidays
const holidays: Holiday[] = [
    { title: "Spak Day", date: '2023-12-22', isHoliday: true },
    { title: 'Guru Nanak Jayanti', date: '2023-12-02', isHoliday: true },
    { title: 'Diwali Festival', date: '2023-12-05', isHoliday: true },
    { title: 'Bhai Dooj', date: '2023-12-10', isHoliday: true },
    { title: 'Chhat Pooja', date: '2023-12-20', isHoliday: true },
    { title: 'Christmas', date: '2023-12-25', isHoliday: true },
    { title: 'Demo', date: '2023-12-26', isHoliday: true },
    { title: 'New Year', date: '2023-12-30', isHoliday: true }
];

const Index = () => {

    const renderEventContent = (eventInfo: EventContentArg) => {
        if (eventInfo.event.extendedProps.isHoliday) {
            // Apply custom styles for holidays
            return (
                <div style={{ backgroundColor: 'red', padding: '5px', border: 0 }}>
                    <b>{eventInfo.event.title}</b>
                </div>
            );
        }

        // Default event rendering
        return (
            <div>
                <b>{eventInfo.event.title}</b>
            </div>
        );
    };

    return (
        <Paper elevation={3} style={{ padding: '1rem' }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={holidays}
                eventContent={renderEventContent}
            />
        </Paper>
    );
};

export default Index;