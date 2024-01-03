import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface componentProps {
    onClick: (event: SelectChangeEvent, val: string) => void;
    defaultSelected: string,
    isDisabled: boolean
}

const Index: React.FC<componentProps> = ({ onClick, defaultSelected, isDisabled = false }) => {

    const [age, setAge] = React.useState(defaultSelected ? defaultSelected : 'Not Started');

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
                    inputProps={{ 'aria-label': 'Without label' }}
                    className='default-status-color'
                    sx={{
                        backgroundColor: age === 'Not Started' ? 'lightgray' :
                            age === 'Started Working' ? '#ffe599' :
                                age === 'Stuck' ? '#e06666' :
                                    age === 'Completed' ? '#38761d' :
                                        'white',
                        color: age === 'Not Started' ? '#000' :
                            age === 'Started Working' ? '#000' :
                                age === 'Stuck' ? '#fff' :
                                    age === 'Completed' ? '#fff' :
                                        '#000',
                    }}
                    disabled={isDisabled}
                >
                    <MenuItem value={'Not Started'} selected><em>Not Started</em></MenuItem>
                    <MenuItem value={'Started Working'}>Started Working</MenuItem>
                    <MenuItem value={'Stuck'}>Stuck</MenuItem>
                    <MenuItem value={'Completed'}>Completed</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default Index;