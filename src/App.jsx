import React from 'react';
import {
  Container, Col, Row,
} from 'react-bootstrap';
import './App.css';
import Header from './components/Layout/Header';
import AuthComponent from './components/Auth';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <div className="App" style={{ background: 'url(/body_bg.png)' }}>
      <Header />
      <Container as="main">
        <Row as="section" className="info-auth" style={{ minHeight: '20vh' }}>
          <Col>
            <p>Loading...</p>
          </Col>
          <Col>
            <AuthComponent />
          </Col>
        </Row>
        <Row as="section" className="payment-or-content" style={{ minHeight: '50vh' }}>
          <Col>payment</Col>
          <Col>or</Col>
          <Col>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((course) => (
              <Row key={course} className="my-2">
                <Col>
                  <img src="/logo192.png" alt="course-logo" height={100} />
                </Col>
                <Col>
                  <p>
                    course_
                    {course}
                    _link
                  </p>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
