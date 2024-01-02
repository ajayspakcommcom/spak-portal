import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface componentProps {
    onClick: (event: SelectChangeEvent, val: string) => void;
    defaultSelected: string
}

const Index: React.FC<componentProps> = ({ onClick, defaultSelected }) => {

    const [age, setAge] = React.useState(defaultSelected);

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
        onClick(event, event.target.value);
    };

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem value={''}><em>Not Started</em></MenuItem>
                    <MenuItem value={'Started Working'}>Started Working</MenuItem>
                    <MenuItem value={'Stuck'}>Stuck</MenuItem>
                    <MenuItem value={'Completed'}>Completed</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default Index;