const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-inner">

        <p>
          © {new Date().getFullYear()} Portfolio Creator. All rights reserved.
        </p>

        <p>
          Build. Publish. Share.
        </p>

      </div>
    </footer>
  );
};

export default Footer;