import React from 'react';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

interface OtherHeaderProps {
    img?: string;
    heading?: string;
    paragraph?: string;
}


const OtherHeader: React.FC<OtherHeaderProps> = ({ img = '', heading = 'Heading 1', paragraph = 'Paragraph 1' }) => (
    <>
        <div className='banner-wrapper'>
            <Container>
                <Row>
                    <Col lg={3} className='header-heading'>
                        <div>
                            {heading && <h1>{heading}</h1>}
                            {paragraph && <p>{paragraph}</p>}
                        </div>
                    </Col>
                    <Col lg={9}>
                        {img && <Image src={require(`../public/assets/img/banner/${img}`)} className='img-fluid' alt={heading} />}
                    </Col>
                </Row>
            </Container>
        </div>
    </>
);

export default OtherHeader;