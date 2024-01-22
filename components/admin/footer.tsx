import * as React from 'react';
import { Container, } from '@mui/material';
import AppContext from '@/context/App/AppContext';

const Index = () => {

    const ctx = React.useContext(AppContext);
    const footerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        ctx.onFooterDimension({ height: footerRef.current?.clientHeight });

        setTimeout(() => {
            console.log(ctx.fixedFooter);
        }, 6000);

    }, [ctx.fixedFooter]);

    return (
        <div className={`footer-wrapper ${!ctx.fixedFooter && 'fixed'}`} ref={footerRef}>
            <Container>
                <p>Copyright &#169; {new Date().getFullYear()} All Rights Reserved.</p>
            </Container>
        </div>
    );
}

export default React.memo(Index);