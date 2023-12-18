import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {

    return (
        <>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#">
                        <Image src={require('../public/assets/img/logo.png')} alt='Spakcomm Logo' />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className='right-nav'>
                        <Form className="d-flex">
                            <Nav className="me-auto my-2 my-lg-0" navbarScroll >

                                <NavDropdown title="Saga" id="navbarScrollingDropdown">
                                    <NavDropdown.Item><Link href="/saga/origin">Origin</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/saga/our-why">Our Why</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/saga/journey">Journey</Link></NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Craftsmanship" id="navbarScrollingDropdown">
                                    <NavDropdown.Item><Link href="/craftsmanship/canvas">Canvas</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/craftsmanship/digital-tales">Digital Tales</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/craftsmanship/echoes">Echoes</Link></NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Whispers" id="navbarScrollingDropdown">
                                    <NavDropdown.Item><Link href="/whispers/conversations">Conversations</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/whispers/voices">Voices</Link></NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Crossroads" id="navbarScrollingDropdown">
                                    <NavDropdown.Item><Link href="/crossroads/connect">Connect</Link></NavDropdown.Item>
                                    <NavDropdown.Item><Link href="/crossroads/join-the-tale">Join The Table</Link></NavDropdown.Item>
                                </NavDropdown>
                                {/* <Nav.Link href="#"> Contact Us</Nav.Link> */}
                            </Nav>

                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </>
    );
};

export default Header;