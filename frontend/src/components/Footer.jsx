import React from 'react';
import '../styles/component/footer.css';

export default function Footer() {
  return (
        <footer className="container-fluid text-center">
          <div className="row">
            <div className="col-6 d-flex flex-column justify-content-center align-items-center pb-2">
              <h5 className="text">Get connected with us on social networks:</h5>
              <div className="d-flex justify-content-center">
                <a href="" className="text-reset mx-2">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="" className="text-reset mx-2">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="" className="text-reset mx-2">
                  <i className="fab fa-google"></i>
                </a>
                <a href="" className="text-reset mx-2">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="" className="text-reset mx-2">
                  <i className="fab fa-github"></i>
                </a>
              </div>
              <div className="sub-text d-none d-lg-block d-md-block">
              <span>All social buttons are still under development, there are no social links. These buttons are just to enhance the visual of footer.</span>
              </div>
            </div>
            <div className="col-6 d-flex flex-column justify-content-end align-items-center pb-2">
              <h4 className="text">Contact</h4>
              <span className='contact'><i className="fas fa-home me-3"></i> Hawthorn, VIC 3123</span>
              <a href="mailto:KTRolster@gmail.com" className='contact text-black'><i className="fas fa-envelope me-3"></i>KTRolster@gmail.com</a>
              <p className='contact'><i className="fas fa-phone me-3"></i>04-1233-4554</p>
            </div>
            <div className="col-12 copyright w-100 text-center">
                © {new Date().getFullYear()} All Rights Reserved
                <span className='d-none d-lg-block d-md-block d-sm-block'>| KT Rolster Group | Website by team KT</span>
            </div>
          </div>
      </footer>
  );
}
