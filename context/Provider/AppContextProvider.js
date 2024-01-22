import React, { useEffect, useState } from 'react';
import AppContext from '../App/AppContext';

const AppContextProvider = (props) => {

    const [headerDimension, setHeaderDimension] = useState();
    const [footerDimension, setFooterDimension] = useState();
    const [mainDimension, setMainDimension] = useState();
    const [isFooterFixed, setIsFooterFixed] = useState(false);



    useEffect(() => {
        const { innerHeight: windowHeight } = window;

        const mainPlusHeader = ((headerDimension?.height) + (mainDimension?.height));
        console.log(mainPlusHeader);

        if (mainPlusHeader > (windowHeight - 50)) {
            setIsFooterFixed(true)
        } else {
            setIsFooterFixed(false)
        }

        return () => console.log('App Context Provider Removed');
    }, [headerDimension, footerDimension, mainDimension]);


    const onHeaderDimensionHandler = (obj) => {
        setHeaderDimension(obj)
        console.log('Header', obj);
    };

    const onFooterDimensionHandler = (obj) => {
        setFooterDimension(obj)
        console.log('Footer', obj);
    };

    const onMainDimensionHandler = (obj) => {
        setMainDimension(obj)
        console.log('Main', obj);
    };

    return (
        <AppContext.Provider value={{ onHeaderDimension: onHeaderDimensionHandler, onFooterDimension: onFooterDimensionHandler, onMainDimension: onMainDimensionHandler, fixedFooter: isFooterFixed }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;