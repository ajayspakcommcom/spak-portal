import React from 'react';
import { Avatar, Box, Tab, Tabs, Typography, Paper } from '@mui/material';

const Index: React.FC = () => {

    const [tabValue, setTabValue] = React.useState(0);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
            <Avatar alt="User Name" src="/user-avatar.jpg" style={{ width: 60, height: 60 }} />
            <Typography variant="h6" style={{ marginTop: 8 }}>
                User Name
            </Typography>
            <Typography variant="subtitle1" style={{ marginBottom: 20 }}>
                Brief Bio
            </Typography>

            <Paper square>
                <Tabs
                    value={tabValue}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="profile tabs"
                >
                    <Tab label="Posts" />
                    <Tab label="About" />
                    <Tab label="Settings" />
                </Tabs>

                {/* <TabPanel value={tabValue} index={0}>
                    User posts content
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    Personal details and contact information
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    Settings content
                </TabPanel> */}
            </Paper>
        </Box>
    );
};

export default Index;
