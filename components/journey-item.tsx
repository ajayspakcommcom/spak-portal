import React from 'react';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';

interface JourneyItemProps {
    img?: string;
    heading?: string;
    paragraph?: string;
}


const JourneyItem: React.FC<JourneyItemProps> = ({ img = '', heading = 'Heading 1', paragraph = 'Paragraph 1' }) => (
    <>
        <Row className='journey-item-row'>
            <Col lg={1}>
                {img && <div className='journey-item-img'><Image src={require(`../public/assets/img/journey/${img}`)} className='img-fluid' alt={heading} /></div>}
            </Col>
            <Col lg={9} className='journey-item-content'>
                {heading && <strong>{heading}</strong>}
                {paragraph && <p>{paragraph}</p>}
            </Col>
        </Row>

    </>
);

export default JourneyItem;