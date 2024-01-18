import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Container } from '@mui/material';
import Header from '@/components/admin/header';
import { JsonWebTokenError } from 'jsonwebtoken';

interface RowData {
    id: number;
    name: string;
}

const MyTableComponent: React.FC = () => {

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    const generateRowData = (numRows: number): RowData[] => {
        const rows: RowData[] = [];

        for (let i = 0; i < numRows; i++) {
            rows.push({
                id: i,
                name: `Name ${i}`
            });
        }

        return rows;
    };

    const rows: RowData[] = [...generateRowData(1000)];

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Header />
            <Container component="main">
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">{row.id}</TableCell>
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                {JSON.stringify({ page })}
                <br />
                {JSON.stringify({ rowsPerPage })}

            </Container>
        </>
    );
};

export default MyTableComponent;
