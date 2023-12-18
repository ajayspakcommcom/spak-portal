import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';



const Footer: React.FC = () => {
    return (
        <>
            <footer className="footer text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h5><Image src={require('../public/assets/img/logo-w.png')} alt='Spakcomm Logo' /></h5>
                            <p className='footer-text'>Seeking to elevate your brand?<br />You've landed in the perfect spot.</p>
                            <button className="custom-btn">Connect with us »</button>

                            <div className="social-media mt-3">
                                <a href="#" className="me-4 text-white"><FontAwesomeIcon icon={faTwitter} /></a>
                                <a href="#" className="me-4 text-white"> <FontAwesomeIcon icon={faFacebookF} /></a>
                                <a href="#" className="me-2 text-white"> <FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="#" className="ms-4 text-white"> <FontAwesomeIcon icon={faLinkedinIn} /></a>
                            </div>

                        </div>
                        <div className="col-md-2">
                            <h6>Saga</h6>
                            <ul className="list-unstyled custom-bullets">
                                <li><Link href="/saga/origin">Origin</Link></li>
                                <li><Link href="/saga/our-why">Our Why</Link></li>
                                <li><Link href="/saga/journey">Journey</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <h6>Craftsmanship</h6>
                            <ul className="list-unstyled custom-bullets">
                                <li><Link href="/craftsmanship/canvas">Canvas</Link></li>
                                <li><Link href="/craftsmanship/digital-tales">Digital Tales</Link></li>
                                <li><Link href="/craftsmanship/echoes">Echoes</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <h6>Whispers</h6>
                            <ul className="list-unstyled custom-bullets">
                                <li><Link href="/whispers/conversations">Conversations</Link></li>
                                <li><Link href="/whispers/conversations">Voices</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-2">
                            <h6>Crossroads</h6>
                            <ul className="list-unstyled custom-bullets">
                                <li><Link href="/crossroads/connect">Connect</Link></li>
                                <li><Link href="/crossroads/join-the-tale">Join the Tale</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>


            <p className="copyright">Copyright © {new Date().getFullYear()} Spakcomm. All rights reserved.</p>



        </>
    );
};

export default Footer;