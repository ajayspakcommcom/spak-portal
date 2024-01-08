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

    const [status, setStatus] = React.useState(defaultSelected ? defaultSelected : 'Not Started');

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
        onClick(event, event.target.value);
    };

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                <Select
                    value={status}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className='default-status-color'
                    style={{ width: '160px', paddingTop: '0', paddingBottom: 0 }}
                    sx={{
                        backgroundColor: status === 'Not Started' ? 'lightgray' :
                            status === 'Started Working' ? '#ffe599' :
                                status === 'Stuck' ? '#e06666' :
                                    status === 'Completed' ? '	#6cc070' :
                                        'white',
                        color: status === 'Not Started' ? '#000' :
                            status === 'Started Working' ? '#000' :
                                status === 'Stuck' ? '#fff' :
                                    status === 'Completed' ? '#fff' :
                                        '#000',
                    }}
                    disabled={isDisabled}
                >
                    <MenuItem value={'Not Started'} selected style={{ backgroundColor: 'lightgray' }}><em>Not Started</em></MenuItem>
                    <MenuItem value={'Started Working'} style={{ backgroundColor: '#ffe599' }}>Started Working</MenuItem>
                    <MenuItem value={'Stuck'} style={{ backgroundColor: '#e06666' }}>Stuck</MenuItem>
                    <MenuItem value={'Completed'} style={{ backgroundColor: '#6cc070' }}>Completed</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default Index;