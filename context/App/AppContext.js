import React, { createContext } from 'react';

const AppContext = createContext({
    onHeaderDimension: (obj) => void {},
    onFooterDimension: (obj) => void {},
    onMainDimension: (obj) => void {},
    fixedFooter: false
});

export default AppContext;